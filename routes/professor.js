const express = require('express')
const router = express.Router()
const Professor = require('../models/Professor')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

//register professor
router.post("/register", async (req, res) => {
  const { professor, designation, email, password } = req.body
  if (!(professor && designation && email && password)) {
    return res.status(400).send("Please enter all required information")
  }

  const emailExists = await Professor.findOne({ email: req.body.email })
  if (emailExists) {
    return res.status(400).send("Email already exists")
  }

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(req.body.password, salt)

  const newProfessor = new Professor({
    professor: req.body.professor,
    designation: req.body.designation,
    email: req.body.email,
    password: hashedPassword
  })

  try {
    const savedProfessor = await newProfessor.save()
    res.status(200).json(savedProfessor)
  } catch (err) {
    res.status(500).json(err)
  }
})

//login professor
router.post("/login", async (req, res) => {
  try {

    const { email, password } = req.body
    if (!(email || password)) {
      return res.status(400).send("Please enter email and password")
    }

    const professor = await Professor.findOne({ email: req.body.email })
    if (!professor) {
      return res.status(400).send("Invalid email or password")
    }

    const validPassword = await bcrypt.compare(req.body.password, professor.password)
    if (!validPassword) {
      return res.status(400).send("Invalid email or password")
    }

    const token = jwt.sign(
      { id: professor._id },
      process.env.JWT_SEC,
      { expiresIn: process.env.JWT_EXPIRES_TIME }
    )

    return res.status(200).json({ token, professor })

  } catch (err) {
    res.status(500).json(err)
  }
})

//get all professors
router.get("/", async (req, res) => {

  try {
    const professors = await Professor.find()
    res.status(200).json(professors)

  } catch (err) {
    res.status(500).json(err)
  }
})

module.exports = router