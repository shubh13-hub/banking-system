const express = require('express');
const AccountController = require('../controllers/AccountController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Customer routes
router.get('/transactions', authMiddleware, AccountController.getTransactions);
router.post('/deposit', authMiddleware, AccountController.deposit);
router.post('/withdraw', authMiddleware, AccountController.withdraw);

// Banker routes
router.get('/customers', authMiddleware, AccountController.getAllCustomers);
router.get('/customers/:userId/transactions', authMiddleware, AccountController.getCustomerTransactions);

module.exports = router;
