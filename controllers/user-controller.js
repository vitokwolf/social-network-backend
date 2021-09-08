const { User, Thought } = require('../models')

const userController = {
  getAllUsers(req, res) {
    User.find({})
      .populate({
        path: 'thoughts',
        select: '-__v',
      })
      .select('-__v')
      .then((userData) => res.json(userData))
      .catch((err) => {
        console.log(err)
        res.status(400).json(err)
      })
  },
  getUserById({ params }, res) {
    User.findOne({ _id: params.userId })
      .populate({
        path: 'thoughts',
        select: '-__v',
      })
      .select('-__v')
      .then((userData) => {
        if (!userData) {
          res.status(404).json({ message: 'No user found with this id!' })
          return
        }
        res.json(userData)
      })
      .catch((err) => {
        console.log(err)
        res.status(400).json(err)
      })
  },
  createUser({ body }, res) {
    User.create(body)
      .then((userData) => res.json(userData))
      .catch((err) => {
        console.log(err)
        res.status(400).json(err)
      })
  },
  updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.userId }, body, {
      new: true,
      runValidators: true,
    })
      .then((userData) => {
        if (!userData) {
          res.status(404).json({ message: 'No user found with this id!' })
          return
        }
        res.json(userData)
      })
      .catch((err) => res.status(400).json(err))
  },
  addFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $push: { friends: params.friendId } },
      { new: true },
    )
      .select('-__v')
      .then((userData) => {
        if (!userData) {
          res.status(404).json({ message: 'No user found with this id!' })
          return
        }
        res.json(userData)
      })
      .catch((err) => {
        res.status(400).json(err)
      })
  },
  deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.userId })
      .then((userData) => {
        if (!userData) {
          res.status(404).json({ message: 'No user found with this id' })
          return
        }
        User.updateMany(
          { _id: { $in: userData.friends } },
          { $pull: { friends: params.userId } },
        )
          .then(() => {
            Thought.deleteMany({ author: userData.author })
              .then(() => {
                res.json({ message: 'Successfully deleted user' })
              })
              .catch((err) => res.status(400).json(err))
          })
          .catch((err) => res.status(400).json(err))
      })
      .catch((err) => res.status(400).json(err))
  },
  removeFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $pull: { friends: params.friendId } },
      { new: true },
    )
      .select('-__v')
      .then((userData) => {
        if (!userData) {
          res.status(404).json({ message: 'No friend found with this id!' })
          return
        }
        res.json(userData)
      })
      .catch((err) => res.status(400).json(err))
  },
}

module.exports = userController
