const { Thought, User, Types } = require('../models')

const thoughtController = {
  getAllThoughts(req, res) {
    Thought.find({})
      .select('-__v')
      .sort({ _id: -1 })
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => {
        console.log(err)
        res.status(400).json(err)
      })
  },
  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.thoughtId })
      .select('-__v')
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'There are no records' })
          return
        }
        res.json(dbThoughtData)
      })
      .catch((err) => {
        console.log(err)
        res.status(400).json(err)
      })
  },
  addThought({ params, body }, res) {
    Thought.create(body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: params.userId },
          { $push: { thoughts: _id } },
          { new: true },
        )
      })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No User found with this id' })
          return
        }
        res.json(dbUserData)
      })
      .catch((err) => res.json(err))
  },
}

module.exports = thoughtController
