const { User, Thought } = require('../models')

const userController = {
  getAllUsers(req, res) {
    User.find({})
      .populate({
        path: 'thoughts',
        select: '-__v',
      })
      .select('-__v')
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => {
        console.log(err)
        res.status(400).json(err)
      })
  },
}

module.exports = userController
