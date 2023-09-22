const { checkPasswordLength, checkUsernameFree, checkUsernameExists } = require('./auth-middleware')
const express = require('express')
const router = express.Router()
const Users = require('../users/users-model')
const crypt = require('bcryptjs')

router.post('/register', checkUsernameFree, checkPasswordLength, async (req, res, next) => {
  try {
    const { username, password } = req.body
    const hash = crypt.hashSync(password, 7)
    const newUser = { username, password: hash }
    const result = await Users.add(newUser)
      .then(user => {
        const userObj = {
          user_id: user.user_id,
          username: user.username
        }
        res.status(201).json(userObj)
      })
  }
  catch (err) {
    next(err)
  }
})

router.post('/login', checkUsernameExists, async (req, res, next) => {
  try {
    const {username, password} = req.body
    const [user] = await Users.findBy({username: username})
    if(user && crypt.compareSync(password, user.password)) {
      req.session.user = user
      res.status(200).json({ message: `Welcome ${user.username}`})
    } else {
      next({ status: 401, message: "Invalid credentials"})
    }
  }
  catch (err) {
    next(err)
  }
})
router.get('/logout', (req, res, next) => {
  if(req.session.user) {
    req.session.destroy(err => {
      if(err) {
        res.json({message: 'no session'})
      } else {
        // res.set('Set-Cookie', 'chocolatechip=; SameSite=Strict; Path=/; Expires=Thu, 01 Jan 1970 00:00:00')
        res.json({ message: 'logged out'})
      }
    })
  } else {
    res.json({message: 'no session'})
  }
})

module.exports = router
