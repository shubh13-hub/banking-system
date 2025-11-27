const Account = require('../models/Account');
const User = require('../models/User');

class AccountController {
  static async getTransactions(req, res) {
    try {
      const userId = req.user.id;
      const transactions = await Account.getTransactionsByUserId(userId);
      const balance = await Account.getBalance(userId);
      res.json({ transactions, balance });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async deposit(req, res) {
    try {
      const userId = req.user.id;
      const { amount } = req.body;

      if (amount <= 0) {
        return res.status(400).json({ message: 'Invalid amount' });
      }

      const transaction = await Account.createTransaction(userId, 'deposit', amount);
      const balance = await Account.getBalance(userId);

      res.json({ message: 'Deposit successful', transaction, balance });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async withdraw(req, res) {
    try {
      const userId = req.user.id;
      const { amount } = req.body;

      if (amount <= 0) {
        return res.status(400).json({ message: 'Invalid amount' });
      }

      const balance = await Account.getBalance(userId);
      if (amount > balance) {
        return res.status(400).json({ message: 'Insufficient funds' });
      }

      const transaction = await Account.createTransaction(userId, 'withdraw', amount);
      const newBalance = await Account.getBalance(userId);

      res.json({ message: 'Withdrawal successful', transaction, balance: newBalance });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async getAllCustomers(req, res) {
    try {
      const customers = await User.getAllCustomers();
      res.json({ customers });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async getCustomerTransactions(req, res) {
    try {
      const { userId } = req.params;
      const transactions = await Account.getTransactionsByUserId(userId);
      const balance = await Account.getBalance(userId);
      res.json({ transactions, balance });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
}

module.exports = AccountController;
