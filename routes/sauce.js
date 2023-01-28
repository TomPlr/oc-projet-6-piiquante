const express = require('express');
const multer = require('../middleware/multer');
const sauceController = require('../controllers/sauce');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, sauceController.showSauces);
router.get('/:id', auth, sauceController.showOneSauce);
router.post('/', auth, multer, sauceController.createSauce);
router.put('/:id', auth, multer, sauceController.modifySauce);
router.delete('/:id', auth, sauceController.deleteSauce);
router.post('/:id/like', auth, sauceController.likeSauce);

module.exports = router;
