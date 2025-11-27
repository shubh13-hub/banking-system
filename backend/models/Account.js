const pool = require('../config/db');

class Account {
  static async createTransaction(userId, type, amount) {
    const query = 'INSERT INTO Accounts (user_id, type, amount, date) VALUES ($1, $2, $3, NOW()) RETURNING *';
    const values = [userId, type, amount];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getTransactionsByUserId(userId) {
    const query = 'SELECT * FROM Accounts WHERE user_id = $1 ORDER BY date DESC';
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  static async getBalance(userId) {
    const query = `
      SELECT 
        COALESCE(SUM(CASE WHEN type = 'deposit' THEN amount ELSE -amount END), 0) as balance
      FROM Accounts 
      WHERE user_id = $1
    `;
    const result = await pool.query(query, [userId]);
    return parseFloat(result.rows[0].balance);
  }

  static async getAllTransactions() {
    const query = 'SELECT * FROM Accounts ORDER BY date DESC';
    const result = await pool.query(query);
    return result.rows;
  }
}

module.exports = Account;
