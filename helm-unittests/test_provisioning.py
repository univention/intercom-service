# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2026 Univention GmbH

from pytest_helm.helm import HelmChart


def provisioning_command(chart: HelmChart, values: dict | None = None) -> str:
    """Render the chart and return the script of the Keycloak provisioning container.

    Args:
        chart: The Helm chart under test.
        values: Values that override the linter values.

    Returns:
        The shell script that the "keycloak-provisioning" init container runs.
    """
    values = {**(values or {}), "provisioning": {"enabled": True}}
    result = chart.helm_template(values=values)
    deployment = result.get_resource(kind="Deployment")
    init_containers = deployment["spec"]["template"]["spec"]["initContainers"]
    container = next(c for c in init_containers if c["name"] == "keycloak-provisioning")
    return container["command"][-1]


def test_provisioning_creates_ics_client(chart: HelmChart) -> None:
    command = provisioning_command(chart)

    assert "oidc/rp create" in command
    assert "--add-ics-mappers" in command


def test_provisioning_uses_default_ics_claims(chart: HelmChart) -> None:
    command = provisioning_command(chart)

    assert '--ics-username-claim "phoenixusername"' in command
    assert '--ics-unique-claim "entryuuid"' in command


def test_provisioning_uses_custom_ics_claims(chart: HelmChart) -> None:
    values = {
        "ics": {
            "usernameClaim": "opendesk_username",
            "userUniqueMapper": "opendesk_useruuid",
        }
    }

    command = provisioning_command(chart, values)

    assert '--ics-username-claim "opendesk_username"' in command
    assert '--ics-unique-claim "opendesk_useruuid"' in command


def realms(chart: HelmChart, values: dict) -> tuple[str, str]:
    """Render the chart and return the realms of ICS and of the provisioning.

    Args:
        chart: The Helm chart under test.
        values: Values that override the linter values.

    Returns:
        The realm that ICS uses and the realm in which the provisioning
        creates the client.
    """
    result = chart.helm_template(values=values)
    secret = next(
        s
        for s in result.get_resources(kind="Secret")
        if "REALM_NAME" in s.get("stringData", {})
    )
    env = next(
        c
        for c in result.get_resources(kind="ConfigMap")
        if c["metadata"]["name"].endswith("-provisioning-env")
    )
    return secret["stringData"]["REALM_NAME"], env["data"]["KEYCLOAK_REALM"]


def test_provisioning_uses_ics_realm_by_default(chart: HelmChart) -> None:
    values = {"provisioning": {"config": {"keycloak": {"realm": ""}}}}

    assert realms(chart, values) == ("nubus", "nubus")


def test_provisioning_follows_custom_ics_realm(chart: HelmChart) -> None:
    values = {
        "ics": {"keycloak": {"realm": "custom"}},
        "provisioning": {"config": {"keycloak": {"realm": ""}}},
    }

    assert realms(chart, values) == ("custom", "custom")


def test_provisioning_realm_can_be_set_separately(chart: HelmChart) -> None:
    values = {
        "ics": {"keycloak": {"realm": "custom"}},
        "provisioning": {"config": {"keycloak": {"realm": "other"}}},
    }

    assert realms(chart, values) == ("custom", "other")
