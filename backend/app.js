const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
const authRoutes = require('./routes/auth');
const accountRoutes = require('./routes/accounts');

const app = express();

// Database initialization
async function initializeDatabase() {
  try {
    // Check if Users table exists
    const checkTableQuery = `
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_name = 'users'
      );
    `;
    const result = await pool.query(checkTableQuery);

    if (!result.rows[0].exists) {
      console.log('Initializing database...');
      // Create Users table
      await pool.query(`
        CREATE TABLE IF NOT EXISTS Users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(50) UNIQUE NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          role VARCHAR(20) NOT NULL CHECK (role IN ('customer', 'banker'))
        );
      `);

      // Create Accounts table
      await pool.query(`
        CREATE TABLE IF NOT EXISTS Accounts (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES Users(id) ON DELETE CASCADE,
          type VARCHAR(10) NOT NULL CHECK (type IN ('deposit', 'withdraw')),
          amount DECIMAL(10,2) NOT NULL,
          date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Insert sample data
      await pool.query(`
        INSERT INTO Users (username, email, password, role) VALUES
        ('customer1', 'customer1@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer'),
        ('banker1', 'banker1@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'banker')
        ON CONFLICT (email) DO NOTHING;
      `);

      // Insert sample transactions
      await pool.query(`
        INSERT INTO Accounts (user_id, type, amount) VALUES
        (1, 'deposit', 1000.00),
        (1, 'withdraw', 200.00)
        ON CONFLICT DO NOTHING;
      `);

      console.log('Database initialized successfully.');
    } else {
      console.log('Database already initialized.');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Middleware
app.use(cors({
  origin: ["https://shubh-bank.vercel.app", "https://banking-system-2-4s3p.onrender.com"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;

// Initialize database and start server
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  });
}).catch((error) => {
  console.error('Failed to initialize database:', error);
  process.exit(1);
});

module.exports = app;