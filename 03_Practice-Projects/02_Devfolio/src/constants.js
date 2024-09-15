module.exports.G_DRIVE_BASE_LINK = 'https://drive.google.com';

module.exports.SSO_SERVER_URL = "http://localhost:3000/api/v1";

module.exports.G_DRIVE_LINK_TYPES = {
    BASE: 'base',
    PREVIEW: 'preview',
    SHARING: 'sharing',
    DOWNLOAD: 'download'
};


module.exports.SSO_SERVER_AUTH_ROUTES = {
    LOGIN: "auth/login",
    LOGOUT: "auth/logout",
    SSO_TOKEN_VERIFICATION: "auth/verifySSOToken",
    REGISTER_USER_SID: "auth/register-sessionid",
    UPDATE_TOKEN: 'auth/update-auth-tokens',
    REGISTER: "auth/sign-up", // Not Working Right Now
};


module.exports.JWT_TOKEN_HEADERS = {
    issuer: "SSO-Server-Anish",
    algorithms: ["RS256"]
};