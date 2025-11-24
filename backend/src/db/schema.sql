-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create calculations table
CREATE TABLE IF NOT EXISTS calculations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_id INTEGER REFERENCES calculations(id) ON DELETE CASCADE,
    starting_number DECIMAL,
    operation VARCHAR(20) CHECK (operation IN ('add', 'subtract', 'multiply', 'divide')),
    operand DECIMAL,
    result DECIMAL NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_calculations_parent_id ON calculations(parent_id);
CREATE INDEX IF NOT EXISTS idx_calculations_user_id ON calculations(user_id);
