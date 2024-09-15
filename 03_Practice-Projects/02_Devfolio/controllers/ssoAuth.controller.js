const {SSO_SERVER_URL, SSO_SERVER_AUTH_ROUTES} = require('../src/constants.js');
const getRedisSessionStore = require('../RedisConfig/redis.SessionStore.js');


////////////////////////////////////////////////////////////////////////////
//                           Login user With SSO Serive
////////////////////////////////////////////////////////////////////////////
const loginWithSSO = (req, res) => {
    console.log("\t***************************************");
    console.log("Inside loginWithSSO() :>> ");
    const authProviderUrl = `${SSO_SERVER_URL}/${SSO_SERVER_AUTH_ROUTES.LOGIN}`; // Replace with your authentication provider's URL
    const redirectUrl = `${req.protocol}://${req.headers.host}`;

    const ssoRedirectUrl = `${authProviderUrl}?redirectURL=${redirectUrl}`;
    console.log(`Redirecting to ${ssoRedirectUrl}`)
    console.log("***************************************\t");
    res.redirect(ssoRedirectUrl);
}


////////////////////////////////////////////////////////////////////////////
//                           Logout user With SSO Serive
////////////////////////////////////////////////////////////////////////////
const logoutWithSSO = (req, res) => {
    console.log("\t***************************************");
    console.log("Inside logoutWithSSO() :>> ");
    const authProviderUrl = `${SSO_SERVER_URL}/${SSO_SERVER_AUTH_ROUTES.LOGOUT}`; // Replace with your authentication provider's URL
    const redirectUrl = `${req.protocol}://${req.headers.host}`;

    const ssoRedirectUrl = `${authProviderUrl}?redirectURL=${redirectUrl}`;
    console.log(`Redirecting to ${ssoRedirectUrl}`)
    console.log("***************************************\t");
    return res.redirect(ssoRedirectUrl);
}



////////////////////////////////////////////////////////////////////////////
//                    Back Channel Logout Method For SSO Server
// This route can only accessible to sso server, no user should manually 
// have the access of this route
////////////////////////////////////////////////////////////////////////////
const backChannelLogoutSSOServer = async (req, res) => {
    console.log("\t***************************************");
    console.log("Inside backChannelLogoutSSOServer() :>> ");
    console.log("curr user session: ", req.session);
    const {userId, sessionID} = req.body;
    
    console.log("logout req for userId :>> ", userId);
    console.log("with sessionID :>> ", sessionID);

    await getRedisSessionStore().destroy(sessionID, (err, data)=>{
        console.log("delting user session data from redis !!!");
        console.log('err :>> ', err);
        console.log('data :>> ', data);
    });
    
    return res
    .status(200)
    .json({status: 200, message: "User LoggedOut Successfully!☑️"});
}






//////////////////////////////////////////////////////////
//             Export Controller Functions
//////////////////////////////////////////////////////////
module.exports = {
    loginWithSSO,
    logoutWithSSO,
    backChannelLogoutSSOServer
}