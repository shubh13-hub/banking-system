const pool = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
  constructor(id, username, email, password, role) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.role = role;
  }

  static async create(username, email, password, role) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *';
    const result = await pool.query(query, [username, email, hashedPassword, role]);
    return new User(result.rows[0].id, result.rows[0].username, result.rows[0].email, result.rows[0].password, result.rows[0].role);
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async findByUsername(username) {
    const query = 'SELECT * FROM users WHERE username = $1';
    const result = await pool.query(query, [username]);
    return result.rows[0];
  }

  static async validatePassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }

  static async getAllCustomers() {
    const query = 'SELECT id, username, email, role FROM users WHERE role = $1';
    const result = await pool.query(query, ['customer']);
    return result.rows;
  }
}

module.exports = User;
