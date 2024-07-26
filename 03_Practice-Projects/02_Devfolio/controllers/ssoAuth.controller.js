


////////////////////////////////////////////////////////////////////////////
//                           Login user With SSO Serive
////////////////////////////////////////////////////////////////////////////
const loginWithSSO = (req, res) => {

    const authProviderUrl = 'http://localhost:3000/api/v1/auth/login'; // Replace with your authentication provider's URL
    const redirectUrl = `${req.protocol}://${req.headers.host}`;

    const ssoRedirectUrl = `${authProviderUrl}?redirectURL=${redirectUrl}`;
    console.log("redi: ", redirectUrl);

    res.redirect(ssoRedirectUrl);
}



module.exports = {
    loginWithSSO
}