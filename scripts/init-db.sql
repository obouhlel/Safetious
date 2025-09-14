-- Initialize Safetious Database
-- This script runs when the PostgreSQL container starts for the first time

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable timestamps
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create additional databases if needed
CREATE DATABASE safetious;

-- You can add any additional initialization here
