const express = require('express');
const router = express.Router();
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  toggleWishlist
} = require('../controllers/wishlistController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.get('/', getWishlist);
router.post('/:productId', addToWishlist);
router.post('/:productId/toggle', toggleWishlist);
router.delete('/:productId', removeFromWishlist);

module.exports = router;
