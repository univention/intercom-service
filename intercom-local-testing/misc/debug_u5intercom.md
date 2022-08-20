Working Token from ox:

{
"exp": 1650948356,
"iat": 1650948056,
"auth_time": 1650947452,
"jti": "a5fa602f-f6c1-4820-9069-6962f73b09ec",
"iss": "https://id.dpx-u5intercom.at-univention.de/auth/realms/dpx-u5intercom",
"aud": "account",
"sub": "273450bf-b68e-4680-9156-c4ab51f80968",
"typ": "Bearer",
"azp": "oxoidc",
"nonce": "TkRX5xYUw36EWw_TzsW1xBGldS1MqTQYZH13sTOgys0",
"session_state": "52316eba-bbf9-4d64-9fa3-d8f1f412337e",
"acr": "1",
"allowed-origins": [
"*"
],
"realm_access": {
"roles": [
"offline_access",
"uma_authorization"
]
},
"resource_access": {
"account": {
"roles": [
"manage-account",
"manage-account-links",
"view-profile"
]
}
},
"scope": "openid email",
"entryUUID": "369c9b9c-559f-103c-9bdb-dfbe36b38f74",
"email_verified": false,
"context": "2",
"preferred_username": "Andi-User",
"email": "andi-user@tnt0002.dpx-u5intercom.at-univention.de"
}


my token:

{
"exp": 1650948814,
"iat": 1650948514,
"auth_time": 1650948513,
"jti": "12e0a45d-627a-466a-8743-5735f086e6e3",
"iss": "https://id.dpx-u5intercom.at-univention.de/auth/realms/dpx-u5intercom",
"sub": "273450bf-b68e-4680-9156-c4ab51f80968",
"typ": "Bearer",
"azp": "intercom",
"nonce": "7_fYPrZ_z3NtJqWueDJGofxLvpvVNqUSE6ZUJmUrW5g",
"session_state": "53ea12b1-6a97-4698-8478-dcd1b0c11e3d",
"acr": "0",
"scope": "openid profile email",
"email_verified": false,
"name": "User Andi",
"preferred_username": "369c9b9c-559f-103c-9bdb-dfbe36b38f74",
"given_name": "User",
"family_name": "Andi",
"email": "andi-user@tnt0002.dpx-u5intercom.at-univention.de"
}



<?xml version="1.0"?>
<d:multistatus xmlns:d="DAV:" xmlns:s="http://sabredav.org/ns" xmlns:oc="http://owncloud.org/ns" xmlns:nc="http://nextcloud.org/ns"><d:response><d:href>/remote.php/dav/files/581aed746e1d923e3372f9fb487daab7736b24b78c76426179ef77b7c63f7eaa/</d:href><d:propstat><d:prop><d:resourcetype><d:collection/></d:resourcetype></d:prop><d:status>HTTP/1.1 200 OK</d:status></d:propstat></d:response></d:multistatus>
