/**
 * Applications Database Module
 * Handles all application-related database operations
 */

import { readData, writeData, generateId, findById, findByQuery } from './index.js';

const FILENAME = 'applications.json';

/**
 * Get all applications
 * @returns {Promise<Array>} - All applications
 */
export const getAllApplications = async () => {
    const apps = await readData(FILENAME);
    return apps || [];
};

/**
 * Get application by ID
 * @param {string} id - Application ID
 * @returns {Promise<Object|null>} - Application or null
 */
export const getApplicationById = async (id) => {
    const apps = await readData(FILENAME);
    return findById(apps, id) || null;
};

/**
 * Get applications by email
 * @param {string} email - Applicant email
 * @returns {Promise<Array>} - Applications for the email
 */
export const getApplicationsByEmail = async (email) => {
    const apps = await readData(FILENAME);
    return findByQuery(apps, { applicantEmail: email });
};

/**
 * Get applications by job ID
 * @param {string} jobId - Job ID
 * @returns {Promise<Array>} - Applications for the job
 */
export const getApplicationsByJobId = async (jobId) => {
    const apps = await readData(FILENAME);
    return findByQuery(apps, { jobId });
};

/**
 * Create a new application
 * @param {Object} appData - Application data
 * @returns {Promise<Object>} - Created application with _id
 */
export const createApplication = async (appData) => {
    const apps = await readData(FILENAME);
    
    // Check for duplicates
    const exists = apps.some(
        app => app.jobId === appData.jobId && 
               app.applicantEmail === appData.applicantEmail
    );
    
    if (exists) {
        throw new Error('Already applied for this job');
    }
    
    const newApp = {
        _id: generateId(),
        ...appData,
        status: appData.status || 'Pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    apps.push(newApp);
    await writeData(FILENAME, apps);
    
    return newApp;
};

/**
 * Update an application
 * @param {string} id - Application ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object|null>} - Updated application or null
 */
export const updateApplication = async (id, updateData) => {
    const apps = await readData(FILENAME);
    const index = apps.findIndex(app => app._id === id);
    
    if (index === -1) return null;
    
    apps[index] = {
        ...apps[index],
        ...updateData,
        updatedAt: new Date().toISOString()
    };
    
    await writeData(FILENAME, apps);
    return apps[index];
};

/**
 * Delete an application
 * @param {string} id - Application ID
 * @returns {Promise<boolean>} - True if deleted, false if not found
 */
export const deleteApplication = async (id) => {
    const apps = await readData(FILENAME);
    const index = apps.findIndex(app => app._id === id);
    
    if (index === -1) return false;
    
    apps.splice(index, 1);
    await writeData(FILENAME, apps);
    
    return true;
};

export default {
    getAllApplications,
    getApplicationById,
    getApplicationsByEmail,
    getApplicationsByJobId,
    createApplication,
    updateApplication,
    deleteApplication
};
