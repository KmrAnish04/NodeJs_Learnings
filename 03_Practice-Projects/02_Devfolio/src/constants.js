// CONSTANTS

module.exports.SSO_SERVER_URL = "http://localhost:3000/api/v1";

module.exports.SSO_SERVER_AUTH_ROUTES = {
    LOGIN: "auth/login",
    LOGOUT: "auth/logout",
    SSO_TOKEN_VERIFICATION: "auth/verifySSOToken",
    REGISTER: "sign-up", // Not Working Right Now
};

module.exports.JWT_TOKEN_HEADERS = {
    issuer: "SSO-Server-Anish",
    algorithms: ["RS256"]
};