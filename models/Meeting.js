const mongoose = require('mongoose')

const meetingSchema = new mongoose.Schema(
  {
    student: {
      type: String
    },
    professor: {
      type: String
    },
    meetingdate: {
      startdate:  {
        type: Date,
        required: true
      },
      enddate: {
        type: Date,
        default: Date.now,
      }
    },
    fixmeetingdate: {
      type: Date
    },
    fixmeetingtime: {
      type: String,
    },
    Duration: {
      type: Number
    },
    purpose: {
      type: String,
      required: true
    },
    action: {
      type: String,
      enum: ["pending", "accept", "reject"]
    },
    location: {
      type: String
    }
  }
)

module.exports = mongoose.model('Meeting', meetingSchema)