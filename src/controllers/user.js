import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import User from '../schema/user'

export const register = async (req, res) => {
  if (req.body.username && req.body.email && req.body.password) {
    const created = Date.now()

    try {
      const user = await User.findOne({
        $or: [{ email: req.body.email }, { username: req.body.username }],
      })

      if (!user) {
        const hash = await bcrypt.hash(req.body.password, 10)

        const newUser = new User({
          username: req.body.username,
          email: req.body.email,
          password: hash,
          downloaded: {},
          uploaded: {},
          created,
        })

        newUser.uid = crypto
          .createHash('sha256')
          .update(newUser._id)
          .digest('hex')

        newUser.token = jwt.sign(
          { id: newUser._id, email: req.body.email, created: created },
          process.env.JWT_SECRET
        )

        const createdUser = await newUser.save()

        if (createdUser) {
          res.send({
            token: createdUser.token,
            id: createdUser._id,
          })
        }
      } else {
        res.sendStatus(409)
      }
    } catch (err) {
      console.error(err)
      res.status(500).send(err.message)
    }
  } else {
    res.sendStatus(400)
  }
}

export const login = async (req, res) => {
  if (req.body.username && req.body.password) {
    try {
      const user = await User.findOne({ username: req.body.username })

      if (user) {
        const matches = await bcrypt.compare(req.body.password, user.password)

        if (matches) {
          res.send({
            token: user.token,
            id: user._id,
          })
        } else {
          res.sendStatus(401)
        }
      } else {
        res.sendStatus(404)
      }
    } catch (err) {
      console.error(err)
      res.status(500).send(err.message)
    }
  } else {
    res.sendStatus(400)
  }
}