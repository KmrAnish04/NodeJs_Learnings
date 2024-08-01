const axios = require("axios");
const {verifyJwtToken} = require('../src/verifyJwtToken.js');
const {SSO_SERVER_URL, SSO_SERVER_AUTH_ROUTES} = require("../src/constants.js");

const ssoRedirect = ()=>{
    return async function (req, res, next) {
        console.log("In checkSSORedirect() :>> ");

        const {ssoToken} = req.query;
        console.log("ssoToken :>> ", ssoToken);
        console.log(`SSO Auth Server URL :>> ${SSO_SERVER_URL}/${SSO_SERVER_AUTH_ROUTES.SSO_TOKEN_VERIFICATION}`);

        if(ssoToken != null){
            // const redirctURL = url.parse(req.url).pathname; // depricated
            const redirctURL = new URL(req.url , `http://${req.headers.host}`).pathname;
            
            console.log("RedirectURL: ", redirctURL);

            try {
                const response = await axios.get(
                    `${SSO_SERVER_URL}/${SSO_SERVER_AUTH_ROUTES.SSO_TOKEN_VERIFICATION}?ssoToken=${ssoToken}`,
                    { headers: { Authorization: `Bearer ${process.env.APP_TOKEN}` } }
                );

                console.log('accessToken :>> ', response.data.data.accessToken);
                console.log('refreshToken :>> ', response.data.data.refreshToken);
                // console.log("axios response :>> ", response.data.data.accessToken);
                const token = response.data.data.accessToken;
                const decoded = await verifyJwtToken(token);
                req.session.user = {
                    ...decoded, 
                    accessToken: response.data.data.accessToken, 
                    refreshToken: response.data.data.refreshToken
                };
                
                req.user = decoded;
                console.log("Tried to Login User ✅");
            } 
            catch (error) { return next(error) }

            console.log("req.session : >> ", req.session);
            console.log<<"\n\n";
            return res.redirect(`${redirctURL}`);
        }

        next(); //Didn't got any ssoToken in query parameters, so ignore
    }
}


module.exports = ssoRedirect;