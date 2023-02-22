const mongoose = require('mongoose')

const professorSchema = new mongoose.Schema(
  {
    professor: {
      type: String,
      required: true
    },
    designation: {
      type: String,
      required: true
    },
    avatar: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
    }
  }
)

module.exports = mongoose.model('Professor', professorSchema)