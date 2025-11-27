-- Create the Bank database
CREATE DATABASE Bank;

-- Connect to the Bank database
\c Bank;

-- Create Users table
CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('customer', 'banker'))
);

-- Create Accounts table (for transactions)
CREATE TABLE Accounts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES Users(id) ON DELETE CASCADE,
    type VARCHAR(10) NOT NULL CHECK (type IN ('deposit', 'withdraw')),
    amount DECIMAL(10,2) NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO Users (username, email, password, role) VALUES
('customer1', 'customer1@example.com', '$2a$10$examplehashedpassword', 'customer'),
('banker1', 'banker1@example.com', '$2a$10$examplehashedpassword', 'banker');

-- Insert sample transactions
INSERT INTO Accounts (user_id, type, amount) VALUES
(1, 'deposit', 1000.00),
(1, 'withdraw', 200.00);
