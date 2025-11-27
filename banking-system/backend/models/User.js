const pool = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
  static async create(username, email, password, role) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO Users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [username, email, hashedPassword, role];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM Users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT id, username, email, role FROM Users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async getAllCustomers() {
    const query = 'SELECT id, username, email FROM Users WHERE role = $1';
    const result = await pool.query(query, ['customer']);
    return result.rows;
  }

  static async validatePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
}

module.exports = User;
