const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const accountRoutes = require('./routes/accounts');

const app = express();

// Middleware
app.use(cors({
  origin: "https://banking-system-shh7-765hoy9eg-shubhs-projects-7495b277.vercel.app",
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
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
});

module.exports = app;