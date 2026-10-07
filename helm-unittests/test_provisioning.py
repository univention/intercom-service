# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2026 Univention GmbH

from pytest_helm.helm import HelmChart


def provisioning_command(chart: HelmChart) -> str:
    """Render the chart and return the script of the Keycloak provisioning container.

    Args:
        chart: The Helm chart under test.

    Returns:
        The shell script that the "keycloak-provisioning" init container runs.
    """
    result = chart.helm_template(values={"provisioning": {"enabled": True}})
    deployment = result.get_resource(kind="Deployment")
    init_containers = deployment["spec"]["template"]["spec"]["initContainers"]
    container = next(c for c in init_containers if c["name"] == "keycloak-provisioning")
    return container["command"][-1]


def test_provisioning_creates_ics_client(chart: HelmChart) -> None:
    command = provisioning_command(chart)

    assert "oidc/rp create" in command
    assert "--add-ics-mappers" in command
