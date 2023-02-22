const express = require('express')
const router = express.Router()
const Student = require('../models/Student')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

//register student
router.post("/register", async (req, res) => {

  const { studentname, email, password } = req.body
  if (!(studentname && email && password)) {
    return res.status(400).send("Please enter all required information")
  }

  const emailExists = await Student.findOne({ email: req.body.email })
  if (emailExists) {
    return res.status(400).send("Email already exists")
  }

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(req.body.password, salt)

  const newStudent = new Student({
    studentname: req.body.studentname,
    email: req.body.email,
    password: hashedPassword
  })

  try {
    const savedStudent = await newStudent.save()
    res.status(200).json(savedStudent)
  } catch (err) {
    res.status(500).json(err)
  }
})

//login student
router.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body
    if (!(email || password)) {
      return res.status(400).send("Please enter email and password")
    }

    const student = await Student.findOne({ email: req.body.email })
    if (!student) {
      return res.status(400).send("Invalid email or password")
    }

    const validPassword = await bcrypt.compare(req.body.password, student.password)
    if (!validPassword) {
      return res.status(400).send("Invalid email or password")
    }

    const token = jwt.sign(
      { id: student._id },
      process.env.JWT_SEC,
      { expiresIn: process.env.JWT_EXPIRES_TIME }
    )
    res.status(200).json({ token, student })

  } catch (err) {
    res.status(500).json(err)
  }
})

module.exports = router
