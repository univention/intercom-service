/*
  Copyright 2021 Univention GmbH

  https://www.univention.de/

  All rights reserved.

  The source code of this program is made available
  under the terms of the GNU Affero General Public License version 3
  (GNU AGPL V3) as published by the Free Software Foundation.

  Binary versions of this program provided by Univention to you as
  well as other copyrighted, protected or trademarked materials like
  Logos, graphics, fonts, specific documentations and configurations,
  cryptographic keys etc. are subject to a license agreement between
  you and Univention and not subject to the GNU AGPL V3.

  In the case you use this program under the terms of the GNU AGPL V3,
  the program is provided in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public
  License with the Debian GNU/Linux or Univention distribution in file
  /usr/share/common-licenses/AGPL-3; if not, see
  <https://www.gnu.org/licenses/>.
*/


package de.univention.authenticator;

import java.util.LinkedList;
import java.util.List;

import org.jboss.logging.Logger;
import org.keycloak.authentication.Authenticator;
import org.keycloak.authentication.AuthenticatorFactory;
import org.keycloak.models.AuthenticationExecutionModel;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.KeycloakSessionFactory;
import org.keycloak.provider.ProviderConfigProperty;
import org.keycloak.provider.ProviderConfigurationBuilder;
import org.keycloak.Config;


public class UniventionAuthenticatorFactory implements AuthenticatorFactory {

    private static final Logger logger =
        Logger.getLogger(UniventionAuthenticatorFactory.class);

    private static final
        UniventionAuthenticator UNIVENTION_AUTHENTICATOR_INSTANCE
            = new UniventionAuthenticator();


    static final String UDM_ENDPOINT_CONFIG_PROPERTY_NAME =
        "udm_endpoint";
    static final String UDM_USER_CONFIG_PROPERTY_NAME =
        "udm_user";
    static final String UDM_PASSWORD_CONFIG_PROPERTY_NAME =
        "udm_password";

    static final String configPropertyNames[] = {
        UDM_ENDPOINT_CONFIG_PROPERTY_NAME, UDM_USER_CONFIG_PROPERTY_NAME,
        UDM_PASSWORD_CONFIG_PROPERTY_NAME
    };

    // TODO: Currently this config is not validated,
    // so when the user enters the URL it might not even be available
    // and the username/password might be incorrect
    // These kinds of issues ideally should be checked on the spot.
    private static final List<ProviderConfigProperty> configProperties =
        ProviderConfigurationBuilder.create()
            .property()
                .name(UDM_ENDPOINT_CONFIG_PROPERTY_NAME)
                .type(ProviderConfigProperty.STRING_TYPE)
                .label("UDM REST API endpoint")
                .helpText("FQDN or IP Address of UDM REST API endpoint")
                // TODO: Pick a better default!!!
                .defaultValue("http://10.200.69.10/univention/udm")
                .add()
            .property()
                .name(UDM_USER_CONFIG_PROPERTY_NAME)
                .type(ProviderConfigProperty.STRING_TYPE)
                .label("Username")
                .helpText("Username of the UDM REST API user")
                .defaultValue("Administrator")
                .add()
            .property()
                .name(UDM_PASSWORD_CONFIG_PROPERTY_NAME)
                .type(ProviderConfigProperty.PASSWORD)
                .label("Password")
                .helpText("Password of the UDM REST API user")
                .defaultValue("univention")
                .secret(true)
                .add()
            .build();

    @Override
    public void close() {

    }

    @Override
    public Authenticator create(KeycloakSession session) {
        // TODO: Review and re-test if this could be debug logging or should be removed
        logger.infof("Univention Authenticator Factory, create has been called");
        logger.infof("Univention Authenticator instance is:" + UNIVENTION_AUTHENTICATOR_INSTANCE.toString());
        return UNIVENTION_AUTHENTICATOR_INSTANCE;
    }

    @Override
    public List<ProviderConfigProperty> getConfigProperties() {
        return configProperties;
    }

    @Override
    public String getDisplayType() {
        return "Univention Authenticator";
    }

    @Override
    public String getHelpText() {
        return "Handles Ad-hoc federation tasks (first login detection, CRUD)";
    }

    @Override
    public String getId() {
        return  "univention-authenticator";
    }

    @Override
    public String getReferenceCategory() {
        return "Univention Authenticator Reference Category";
    }

    @Override
    public AuthenticationExecutionModel.Requirement[] getRequirementChoices() {
        // TODO: Shouldn't this be REQUIRED in all cases? Can it be?
        AuthenticationExecutionModel.Requirement[] REQUIREMENT_CHOICES = {
                    AuthenticationExecutionModel.Requirement.REQUIRED,
                    AuthenticationExecutionModel.Requirement.DISABLED
            };

        return REQUIREMENT_CHOICES;
    }

    @Override
    public void init(Config.Scope scope) {

    }

    @Override
    public boolean isConfigurable() {
        return true;
    }

    @Override
    public boolean isUserSetupAllowed() {
        return true;
    }

    @Override
    public void postInit(KeycloakSessionFactory keycloakSessionFactory) {

    }
}
