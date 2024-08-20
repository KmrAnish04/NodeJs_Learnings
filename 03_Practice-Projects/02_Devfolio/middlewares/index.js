// Add Middleware Functions Here and Export it.
const axios = require("axios");
const {verifyJwtToken} = require('../src/verifyJwtToken.js');
const { TokenExpiredError, NotBeforeError, JsonWebTokenError } = require('jsonwebtoken');
const {SSO_SERVER_URL, SSO_SERVER_AUTH_ROUTES} = require('../src/constants.js');


////////////////////////////////////////////////////////////////////////////
//                      Jwt Token Verificator Middleware
////////////////////////////////////////////////////////////////////////////
module.exports.verifyJwt = async (req, res, next)=>{
    // console.log("Inside verifyJwt():", req.session.user);
    const accessToken = req.session?.user?.accessToken;
    const refreshToken = req.session?.user?.refreshToken;
    // console.log('accessToken :>> ', accessToken); 
    // console.log('refreshToken :>> ', refreshToken); 


    if(!accessToken){
        return res
        .status(401)
        .json({message: "Unauthorized Request!!! ⚠️"})
    }
    

    try {
        const decodedToken = await verifyJwtToken(accessToken)
        console.log('decodedToken :>> ', decodedToken);
        next();
    } 
    catch (error) {
        console.log("\n\nSome Error Occured While Verifying AccessToken!\n\n");
        console.log("\n\nError :>> ", error, "\n\n");
        // throw new Error("Error While Accessing Protected Route!!! ⚠️❌")

        if (error instanceof TokenExpiredError) {
            // return res
            // .status(401)
            // .send({ success: false, message: 'Unauthorized! Access Token was expired!' });
            
            try {
                const response = await axios.post(
                    `${SSO_SERVER_URL}/${SSO_SERVER_AUTH_ROUTES.UPDATE_TOKEN}`,
                    {refreshToken: refreshToken},
                    { headers: { Authorization: `Bearer ${process.env.APP_TOKEN}` } }
                );

                const newAccessToken = response.data.data.newAccessToken;
                console.log('accessToken :>> ', newAccessToken);

                console.log('old accessToken :>> ', newAccessToken);
                const decoded = await verifyJwtToken(newAccessToken);
                req.session.user.accessToken = newAccessToken

                console.log('req.user :>> ', req.user);

                console.log('\n\nnew AccessToken :>> ', newAccessToken);
                // console.log("Tried to Login User ✅");

                next();
            } 
            catch (error) { return next(error) }
        }
        if (error instanceof NotBeforeError) {
        return res.status(401).send({ success: false, message: 'jwt not active' });
        }
        if (error instanceof JsonWebTokenError) {
        return res.status(401).send({ success: false, message: 'jwt malformed' });
        }
    }

    // const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
    // if(!user){ new ApiError(404, "Invalid AccessToken!!!");}
    // req.user = user;
    
};
