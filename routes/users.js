const router = require('express').Router();
const {
  validateGetUser,
  validateUpdateUser,
  validateUpdateAvatar,
} = require('../middlewares/validations');
const {
  getUsers,
  getUser,
  updateUser,
  updateAvatar,
  getUserMe,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUserMe);
router.get('/:userId', validateGetUser, getUser);
router.patch('/me', validateUpdateUser, updateUser);
router.patch('/me/avatar', validateUpdateAvatar, updateAvatar);

module.exports = router;
