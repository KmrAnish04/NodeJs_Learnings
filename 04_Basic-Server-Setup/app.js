const express = require('express');
const app = express();
const authRoute = require('./routes/auth.route.js');


//******************************************** Middlewares ********************************************
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));


//******************************************** Routes Handling ********************************************
app.use('/api/user', authRoute);


app.get('/', (req, res, next) => {
    return res
        .status(200)
        .json({
            message: "Hii, From Server",
            status: 200,
            page: "Home"
        });
});




//******************************************** Error Handling ********************************************
app.use((req, res, next) => {
    console.log("404! Not Found!");
    const err = new Error("Resource Not Found!");
    err.statusCode = 404;
    next(err);
});

app.use((err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message;

    if (statusCode === 500) message = "Internal Server Error!";
    if (!message) {
        message = err.message || "Something Went Wrong"
    }

    return res
        .status(statusCode)
        .json({
            message,
            statusCode
        })
});




module.exports = app;