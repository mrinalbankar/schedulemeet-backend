const express = require('express')
const router = express.Router()
const Meeting = require('../models/Meeting')

const { verifyToken, verifyStudent } = require('../middlewares/verifytoken')

//add new meeting
router.post("/schedule", verifyStudent, async (req, res) => {
  const newMeeting = new Meeting(req.body)
  try {
    
    const saveMeeting = await newMeeting.save()
    await Meeting.findByIdAndUpdate(
      newMeeting.id,
      {
        $set: {
          student: req.user.studentname,
          action: "pending"
        }
      }
    )
    res.status(200).json(saveMeeting)

  } catch (err) {
    res.status(500).json(err)
  }
})

//get meeting id
router.get("/find/:id", verifyToken, async (req, res) => {
  try {

    const meeting = await Meeting.findById(req.params.id)
    if (!meeting) {
      return res.status(404).json("Meeting not found")
    }
    res.status(200).json(meeting)

  } catch (err) {
    res.status(500).json(err)
  }
})

//get all meetings
router.get("/", verifyToken, async (req, res) => {
  try {
    const meetings = await Meeting.find()
    res.status(200).json(meetings)

  } catch (err) {
    res.status(500).json(err)
  }
})

//edit a meeting
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const updatedMeeting = await Meeting.findByIdAndUpdate(
      req.params.id,
      // { $set: req.body },
      {
        $set: {
          location: req.body.location,
          action: req.body.action,
          fixmeetingdate: req.body.fixmeetingdate,
          fixmeetingtime: req.body.fixmeetingtime
        }
      },
      { new: true }
    )
    res.status(200).json(updatedMeeting)

  } catch (err) {
    res.status(500).json(err)
  }
})

//delete meeting
router.delete("/:id", verifyToken, async (req, res) => {
  try {

    await Meeting.findByIdAndDelete(req.params.id)
    res.status(200).json("meeting is removed")

  } catch (err) {
    res.status(500).json(err)
  }
})

module.exports = router