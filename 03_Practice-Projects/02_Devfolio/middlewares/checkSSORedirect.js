const axios = require("axios");
const {verifyJwtToken} = require('../src/verifyJwtToken.js');
const {SSO_SERVER_URL, SSO_SERVER_AUTH_ROUTES} = require("../src/constants.js");

const ssoRedirect = ()=>{
    return async function (req, res, next) {
        console.log("\t********************************************");
        console.log("In checkSSORedirect() :>> ");
        
        const {ssoToken} = req.query;

        console.log("req.session.user", req.session.user);
        console.log("ssoToken :>> ", ssoToken);
        console.log(`SSO Server URL :>> ${SSO_SERVER_URL}/${SSO_SERVER_AUTH_ROUTES.SSO_TOKEN_VERIFICATION}`);

        if(ssoToken){
            const redirctURL = new URL(req.url , `http://${req.headers.host}`).pathname;
            console.log("RedirectURL: ", redirctURL);

            try {
                const response = await axios.get(
                    `${SSO_SERVER_URL}/${SSO_SERVER_AUTH_ROUTES.SSO_TOKEN_VERIFICATION}?ssoToken=${ssoToken}`,
                    { headers: { Authorization: `Bearer ${process.env.APP_TOKEN}` } }
                );

                const { accessToken, refreshToken } = response.data.data;

                console.log('Got accessToken :>> ', accessToken);
                console.log('Got refreshToken :>> ', refreshToken);

                const decoded = await verifyJwtToken(accessToken);

                setTimeout(() => {
                    console.log("SetTimeOut Executed!")
                    req.session.user = {
                        ...decoded, 
                        accessToken, 
                        refreshToken
                    };
                }, 5);
                
                
                console.log("Tried to Login User ✅");
            } 
            catch (error) { return next(error) }

            return res.redirect(`${redirctURL}`);
        }

        next(); //Didn't got any ssoToken in query parameters, so ignore
    }
}


module.exports = ssoRedirect;