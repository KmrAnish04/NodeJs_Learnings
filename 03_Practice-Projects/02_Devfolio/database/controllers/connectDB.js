const mongoose = require('mongoose')

async function connectToMongoDB(dbURL){
    return await mongoose.connect(dbURL);
}

module.exports = {connectToMongoDB};