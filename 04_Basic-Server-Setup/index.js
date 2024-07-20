const app = require('./app.js');

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.info(`App Listening On Port ${PORT}`)
});