const router = require('express').Router()
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

router.route('/:id').get(getUserById).delete(deleteUser).put(updateUser)

router.route('/:id/friends/:friendId').put(addFriend).delete(removeFriend)

module.exports = router
