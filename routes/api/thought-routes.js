const router = require('express').Router()
const {
  getAllThoughts,
  getThoughtById,
  removeThought,
  addReaction,
  removeReaction,
} = require('../../controllers/thought-controller')

router.route('/').get(getAllThoughts)

router
  .route('/:thoughtId')
  .get(getThoughtById)
  .put(addReaction)
  .delete(removeThought)

router
  // /api/thoughts/:thoughtId/reactionId
  .route('/:thoughtId/:reactionId')
  .delete(removeReaction)

module.exports = router
