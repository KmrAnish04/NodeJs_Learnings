const axios = require("axios");
const {verifyJwtToken} = require('../src/verifyJwtToken.js');
const {SSO_SERVER_URL, SSO_SERVER_AUTH_ROUTES} = require("../src/constants.js");
const RedisSessionStore = require('../RedisConfig/redis.SessionStore.js');

const ssoRedirect = ()=>{
    return async function (req, res, next) {
        console.log("\n\n********************************************");
        console.log("In checkSSORedirect() :>> ");
        
        const {ssoToken} = req.query;

        if(ssoToken){
            console.log("req.session.user", req.session.user);
            console.log("ssoToken :>> ", ssoToken);
            console.log(`SSO Server URL :>> ${SSO_SERVER_URL}/${SSO_SERVER_AUTH_ROUTES.SSO_TOKEN_VERIFICATION}`);

            const redirctURL = new URL(req.url , `http://${req.headers.host}`).pathname;
            console.log("RedirectURL: ", redirctURL);

            try {
                const verifySSOTokenResponse = await axios.get(
                    `${SSO_SERVER_URL}/${SSO_SERVER_AUTH_ROUTES.SSO_TOKEN_VERIFICATION}?ssoToken=${ssoToken}`,
                    { headers: { Authorization: `Bearer ${process.env.APP_TOKEN}` } }
                );

                const { accessToken, refreshToken } = verifySSOTokenResponse.data.data;

                console.log('Got accessToken :>> ', accessToken);
                console.log('Got refreshToken :>> ', refreshToken);

                const decoded = await verifyJwtToken(accessToken);

                req.session.user = {
                    ...decoded, 
                    accessToken, 
                    refreshToken
                };

                console.log("saving data in session store", req.sessionID)

                // Register the sessionID in SSO server 
                const registerSIDResponse = await axios.post(
                    `${SSO_SERVER_URL}/${SSO_SERVER_AUTH_ROUTES.REGISTER_USER_SID}`,
                    {userId: req.session.user.userId, sessionID: req.sessionID},
                    { headers: { Authorization: `Bearer ${process.env.APP_TOKEN}` } }    
                );

                console.log(registerSIDResponse)
                
                
                console.log("Tried to Login User ✅");
            } 
            catch (error) { return next(error) }

            return res.redirect(`${redirctURL}`);
        }

        next(); //Didn't got any ssoToken in query parameters, so ignore
    }
}


module.exports = ssoRedirect;