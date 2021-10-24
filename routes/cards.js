const router = require('express').Router();
const {
  validateCreateCard,
  validateCardId,
} = require('../middlewares/validations');
const {
  getCards,
  createCard,
  deleteCard,
  addLike,
  delLike,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', validateCreateCard, createCard);
router.delete('/:cardId', validateCardId, deleteCard);
router.put('/:cardId/likes', validateCardId, addLike);
router.delete('/:cardId/likes', validateCardId, delLike);

module.exports = router;
