const axios = require("axios");
const {verifyJwtToken} = require('../src/verifyJwtToken.js');
const {SSO_SERVER_URL, SSO_SERVER_AUTH_ROUTES} = require("../src/constants.js");

const ssoRedirect = ()=>{
    return async function (req, res, next) {
        const {ssoToken} = req.query;
        console.log("ssoToken: ", ssoToken);
        console.log(`${SSO_SERVER_URL}/${SSO_SERVER_AUTH_ROUTES.SSO_TOKEN_VERIFICATION}`);

        if(ssoToken != null){
            // const redirctURL = url.parse(req.url).pathname; // depricated
            const redirctURL = new URL(req.url , `http://${req.headers.host}`).pathname;
            
            console.log("redirectURL: ", redirctURL);

            try {
                const response = await axios.get(
                    `${SSO_SERVER_URL}/${SSO_SERVER_AUTH_ROUTES.SSO_TOKEN_VERIFICATION}?ssoToken=${ssoToken}`,
                    { headers: { Authorization: `Bearer ${process.env.APP_TOKEN}` } }
                );

                // console.log("response: ", response.data);
                console.log("response: ", response.data.data.token);
                const token = response.data.data.token;
                const decoded = await verifyJwtToken(token);
                req.session.user = decoded;
                console.log("Tried to Login User ✅");
            } 
            catch (error) { return next(error) }

            console.log("req.session : >> ", req.session);
            return res.redirect(`${redirctURL}`);
        }

        next(); //Didn't got any ssoToken in query parameters, so ignore
    }
}


module.exports = ssoRedirect;