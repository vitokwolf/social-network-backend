const { Thought, User } = require('../models')

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
    User.findById(params.userId)
      .then((userData) => {
        if (!userData) {
          res.status(404).json({ message: 'No record found' })
        }
        return Thought.create({
          author: userData.username,
          thoughtText: body.thoughtText,
          userId: userData._id,
        })
      })
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: params.userId },
          { $push: { thoughts: _id } },
          { new: true, runValidators: true },
        )
      })
      .then((userData) => {
        if (!userData) {
          res.status(404).json({ message: 'No record found' })
          return
        }
        res.json(userData)
      })
      .catch((err) => res.json(err))
  },
  addReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $push: { reactions: body } },
      { new: true },
    )
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'No record found' })
          return
        }
        res.json(dbThoughtData)
      })
      .catch((err) => res.json(err))
  },
  removeThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.thoughtId })
      .then((deletedThought) => {
        if (!deletedThought) {
          return res.status(404).json({ message: 'No records found' })
        }
        return User.findOneAndUpdate(
          { _id: params.userId },
          { $pull: { thoughts: params.thoughtId } },
          { new: true },
        )
      })
      .then((dbUserData) => {
        res.json(dbUserData)
      })
      .catch((err) => res.json(err))
  },
  removeReaction({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { new: true },
    )
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => res.json(err))
  },
}

module.exports = thoughtController
