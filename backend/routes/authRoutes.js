const express = require('express');
const { register, login } = require('../controllers/authController');
const authenticate = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/validate-token', authenticate, (req, res) => {
  res.status(200).json({ message: 'Token is valid', user: req.user });
});
module.exports = router;
