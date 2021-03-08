const getUserContexts = (keycloak, team, staffid) => {
  const contexts = {
    data: {
      environmentContext: {
        attachmentServiceUrl: '/files',
        operationalDataUrl: '/opdata',
        privateUiUrl: window.location.origin,
        referenceDataUrl: '/refdata',
        workflowUrl: '/camunda',
      },
      extendedStaffDetailsContext: {
        delegateEmails: keycloak.tokenParsed.delegate_email,
        email: keycloak.tokenParsed.email,
        linemanagerEmail: keycloak.tokenParsed.line_manager_email,
        name: keycloak.tokenParsed.name,
      },
      keycloakContext: {
        accessToken: keycloak.token,
        adelphi: keycloak.tokenParsed.adelphi_number,
        email: keycloak.tokenParsed.email,
        familyName: keycloak.tokenParsed.family_name,
        givenName: keycloak.tokenParsed.given_name,
        gradeId: keycloak.tokenParsed.grade_id,
        groups: keycloak.tokenParsed.groups,
        locationId: keycloak.tokenParsed.location_id,
        phone: keycloak.tokenParsed.phone,
        realm: keycloak.realm,
        refreshToken: keycloak.refreshToken,
        roles: keycloak.tokenParsed.realm_access.roles,
        sessionId: keycloak.tokenParsed.session_state,
        subject: keycloak.subject,
        url: keycloak.authServerUrl,
      },
      shiftDetailsContext: {
        email: keycloak.tokenParsed.email,
        locationid: String(keycloak.tokenParsed.location_id),
        phone: keycloak.tokenParsed.phone,
        roles: keycloak.tokenParsed.realm_access.roles,
        team,
        teamid: team.id,
      },
      staffDetailsDataContext: {
        adelphi: keycloak.tokenParsed.adelphi_number,
        dateofleaving: keycloak.tokenParsed.dateofleaving,
        defaultlocationid: keycloak.tokenParsed.location_id,
        defaultteam: team,
        defaultteamid: team.id,
        email: keycloak.tokenParsed.email,
        firstname: keycloak.tokenParsed.given_name,
        gradeid: keycloak.tokenParsed.grade_id,
        locationid: keycloak.tokenParsed.location_id,
        phone: keycloak.tokenParsed.phone,
        staffid,
        surname: keycloak.tokenParsed.family_name,
        teamid: team.id,
      },
    },
  };

  return contexts;
};

export default getUserContexts;
