/**
 * Database Module
 * Handles all database operations for jobs, applications, and users
 * Uses JSON files as the data store
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../data');

// Ensure data directory exists
const initializeDatabase = async () => {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
        console.log('✓ Database directory ready:', DATA_DIR);
    } catch (error) {
        console.error('Failed to initialize database directory:', error);
        throw error;
    }
};

/**
 * Read data from a JSON file
 * @param {string} filename - Name of the file (without path)
 * @returns {Promise<Array>} - Array of records
 */
export const readData = async (filename) => {
    try {
        const filepath = path.join(DATA_DIR, filename);
        const data = await fs.readFile(filepath, 'utf-8');
        return JSON.parse(data) || [];
    } catch (error) {
        if (error.code === 'ENOENT') {
            // File doesn't exist, return empty array
            return [];
        }
        console.error(`Error reading ${filename}:`, error);
        throw error;
    }
};

/**
 * Write data to a JSON file
 * @param {string} filename - Name of the file (without path)
 * @param {Array} data - Data to write
 * @returns {Promise<void>}
 */
export const writeData = async (filename, data) => {
    try {
        const filepath = path.join(DATA_DIR, filename);
        await fs.writeFile(filepath, JSON.stringify(data, null, 2), 'utf-8');
        console.log(`✓ Updated ${filename}`);
    } catch (error) {
        console.error(`Error writing to ${filename}:`, error);
        throw error;
    }
};

/**
 * Generate a unique ID
 * @returns {string} - Unique ID
 */
export const generateId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Find record by ID
 * @param {Array} records - Array of records
 * @param {string} id - Record ID
 * @returns {Object|null} - Found record or null
 */
export const findById = (records, id) => {
    return records.find(record => record._id === id) || null;
};

/**
 * Find records by query
 * @param {Array} records - Array of records
 * @param {Object} query - Query object (e.g., { email: 'user@example.com' })
 * @returns {Array} - Matching records
 */
export const findByQuery = (records, query) => {
    return records.filter(record => {
        return Object.entries(query).every(([key, value]) => {
            return record[key] === value;
        });
    });
};

export default {
    initializeDatabase,
    readData,
    writeData,
    generateId,
    findById,
    findByQuery
};
