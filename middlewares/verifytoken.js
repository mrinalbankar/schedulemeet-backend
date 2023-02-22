const jwt = require('jsonwebtoken')
const Student = require('../models/Student')
const Professor = require('../models/Professor')

const verifyToken = async (req, res, next) => {

  const authHeader = req.headers['authorization']
  if (!authHeader) {
    return res.status(403).json("Login is required")
  }

  const token = authHeader?.split(' ')[1]
  const decoded = jwt.verify(token, process.env.JWT_SEC)
  req.user = await Professor.findById(decoded.id)
  if (!req.user) {
    return res.status(403).json("Login is required")
  }

  next()
}

const verifyStudent = async (req, res, next) => {

  const authHeader = req.headers['authorization']
  if (!authHeader) {
    return res.status(403).json("Login is required")
  }

  const token = authHeader?.split(' ')[1]
  const decoded = jwt.verify(token, process.env.JWT_SEC)
  req.user = await Student.findById(decoded.id)
  if (!req.user) {
    return res.status(403).json("Login is required")
  }

  next()
}

module.exports = { verifyToken, verifyStudent }