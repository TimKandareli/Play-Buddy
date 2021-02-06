const { Router } = require('express')
const User = require('../models/user')
const router = Router()


router.get('/', (req, res) => {
  res.send('Server')
})

router.post('/edit', async (req, res) => {
  const { name, info, phone } = req.body.inputs;
  const { userId } = req.body
  req.session.user = { ...req.session.user, name, userId }
  const user = await User.findByIdAndUpdate(userId, {
    $set: {
      name,
      information: info,
      phone
    }
  }, null, () => {});
  res.json(user)
})


module.exports = router
