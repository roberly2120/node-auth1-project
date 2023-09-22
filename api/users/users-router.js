const Users = require('./users-model')
const express = require('express')
const router = express.Router();
const {restricted} = require('../auth/auth-middleware')

router.get('/', restricted, (req, res, next) => {
  Users.find()
    .then(users => {
      res.status(200).json(users)
    })
})

module.exports = router;