const router = require('express').Router()
const { addThought } = require('../../controllers/thought-controller')
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  addFriend,
  removeFriend,
} = require('../../controllers/user-controller')

router.route('/').get(getAllUsers).post(createUser)

router
  .route('/:userId')
  .get(getUserById)
  .delete(deleteUser)
  .put(updateUser)
  .post(addThought)

router.route('/:userId/friends/:friendId').put(addFriend).delete(removeFriend)

module.exports = router
