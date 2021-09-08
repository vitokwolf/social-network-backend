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
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'No record found' })
          return
        }
        res.json(dbThoughtData)
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
          { _id: params.username },
          { $pull: { thoughts: params.thoughtId } },
          { new: true },
        )
      })
      .then((dbThoughtData) => {
        res.json(dbThoughtData)
      })
      .catch((err) => res.json(err))
  },
}

module.exports = thoughtController
