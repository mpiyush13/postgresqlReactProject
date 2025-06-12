const express = require('express');
const Transaction = require('../models/Transaction')
const { register, login } = require('../controllers/authController');
const authenticate = require('../middleware/authMiddleware');
// const { Transaction } = require('../models/Transaction');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/validate-token', authenticate, (req, res) => {
  res.status(200).json({ message: 'Token is valid', user: req.user });
});
router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;
    const transactions = await Transaction.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });
    res.json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', authenticate, async (req, res) => {
  // res.json({'Transaction model': Transaction});

  const userId = req.user.userId;
  // res.json({userId})
  const { description, amount } = req.body;

  if (!description || typeof amount !== 'number') {
    return res.status(400).json({ message: 'Description and numeric amount are required' });
  }

  try {
    const transaction = await Transaction.create({ userId, description, amount });
    res.status(201).json(transaction);
  }catch (err) {
  console.error("Post Error →", err);  // ✅ See the full stack
  res.status(500).json({ message: 'Server error' });
}

});

router.delete('/:id', authenticate, async (req, res) => {
  const userId = req.user.userId;
  const transactionId = req.params.id;

  try {
    // Find the transaction first and make sure it belongs to the user
    const transaction = await Transaction.findOne({
      where: { id: transactionId, userId }
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found or unauthorized' });
    }

    await transaction.destroy();
    res.json({ message: 'Transaction deleted successfully' });

  } catch (err) {
    console.error("Delete Error →", err);
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;
