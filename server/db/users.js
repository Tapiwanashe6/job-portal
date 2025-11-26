/**
 * Users Database Module
 * Handles all user-related database operations
 */

import { readData, writeData, generateId, findById, findByQuery } from './index.js';

const FILENAME = 'users.json';

/**
 * Get all users
 * @returns {Promise<Array>} - All users
 */
export const getAllUsers = async () => {
    const users = await readData(FILENAME);
    return users || [];
};

/**
 * Get user by ID
 * @param {string} id - User ID
 * @returns {Promise<Object|null>} - User or null
 */
export const getUserById = async (id) => {
    const users = await readData(FILENAME);
    return findById(users, id) || null;
};

/**
 * Get user by email
 * @param {string} email - User email
 * @returns {Promise<Object|null>} - User or null
 */
export const getUserByEmail = async (email) => {
    const users = await readData(FILENAME);
    const results = findByQuery(users, { email });
    return results.length > 0 ? results[0] : null;
};

/**
 * Get users by role
 * @param {string} role - User role (e.g., 'recruiter', 'job_seeker')
 * @returns {Promise<Array>} - Users with the role
 */
export const getUsersByRole = async (role) => {
    const users = await readData(FILENAME);
    return findByQuery(users, { role });
};

/**
 * Create a new user
 * @param {Object} userData - User data
 * @returns {Promise<Object>} - Created user with _id
 */
export const createUser = async (userData) => {
    const users = await readData(FILENAME);
    
    // Check if user already exists
    const exists = users.some(user => user.email === userData.email);
    if (exists) {
        throw new Error('User already exists');
    }
    
    const newUser = {
        _id: generateId(),
        ...userData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    users.push(newUser);
    await writeData(FILENAME, users);
    
    return newUser;
};

/**
 * Update a user
 * @param {string} id - User ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object|null>} - Updated user or null
 */
export const updateUser = async (id, updateData) => {
    const users = await readData(FILENAME);
    const index = users.findIndex(user => user._id === id);
    
    if (index === -1) return null;
    
    users[index] = {
        ...users[index],
        ...updateData,
        updatedAt: new Date().toISOString()
    };
    
    await writeData(FILENAME, users);
    return users[index];
};

/**
 * Delete a user
 * @param {string} id - User ID
 * @returns {Promise<boolean>} - True if deleted, false if not found
 */
export const deleteUser = async (id) => {
    const users = await readData(FILENAME);
    const index = users.findIndex(user => user._id === id);
    
    if (index === -1) return false;
    
    users.splice(index, 1);
    await writeData(FILENAME, users);
    
    return true;
};

export default {
    getAllUsers,
    getUserById,
    getUserByEmail,
    getUsersByRole,
    createUser,
    updateUser,
    deleteUser
};
