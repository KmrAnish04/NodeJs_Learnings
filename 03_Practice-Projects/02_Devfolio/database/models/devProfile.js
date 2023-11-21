const mongoose = require('mongoose')

const devProfile = mongoose.model('DeveloperProfile', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    title: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 20
    },
    summary: {
        type: String,
        required: true,
        minlength: 0,
        maxlength: 1000
    },
    contactInfo: {
        LinkedIn: {
            type: String,
            trim: true,
            unique: true
        },
        Instagram: {
            type: String,
            trim: true,
            unique: true
        },
        Email: {
            type: String,
            trim: true,
            unique: true
        },
        Mobile: {
            type: String,
            trim: true,
            unique: true
        },
    },
    // profileImg: {
    //     data: Buffer,
    //     contentType: String
    // }
}));

exports.devProfile = devProfile;