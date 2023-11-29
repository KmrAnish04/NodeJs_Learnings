// models/project.js

const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  images: {
    type: [String], // Array of image URLs
    default: []
  },
  projectLink: {type: String,},
  githubLink: {type: String,},
  likes: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Assuming you have a User model
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Assuming you have a User model
      },
      text: String,
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  dateCreated: {
    type: Date,
    default: Date.now
  }
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
