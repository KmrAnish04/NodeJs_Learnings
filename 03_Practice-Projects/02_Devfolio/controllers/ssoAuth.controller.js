const {SSO_SERVER_URL, SSO_SERVER_AUTH_ROUTES} = require('../src/constants.js');


////////////////////////////////////////////////////////////////////////////
//                           Login user With SSO Serive
////////////////////////////////////////////////////////////////////////////
const loginWithSSO = (req, res) => {

    const authProviderUrl = `${SSO_SERVER_URL}/${SSO_SERVER_AUTH_ROUTES.LOGIN}`; // Replace with your authentication provider's URL
    const redirectUrl = `${req.protocol}://${req.headers.host}`;

    const ssoRedirectUrl = `${authProviderUrl}?redirectURL=${redirectUrl}`;
    console.log("redi: ", redirectUrl);

    res.redirect(ssoRedirectUrl);
}



//////////////////////////////////////////////////////////
//             Export Controller Functions
//////////////////////////////////////////////////////////
module.exports = {
    loginWithSSO
}