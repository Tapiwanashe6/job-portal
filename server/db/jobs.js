/**
 * Jobs Database Module
 * Handles all job-related database operations
 */

import { readData, writeData, generateId, findById, findByQuery } from './index.js';

const FILENAME = 'jobs.json';

/**
 * Get all jobs
 * @returns {Promise<Array>} - All jobs
 */
export const getAllJobs = async () => {
    const jobs = await readData(FILENAME);
    return jobs || [];
};

/**
 * Get job by ID
 * @param {string} id - Job ID
 * @returns {Promise<Object|null>} - Job or null
 */
export const getJobById = async (id) => {
    const jobs = await readData(FILENAME);
    return findById(jobs, id) || null;
};

/**
 * Get jobs by filter
 * @param {Object} filter - Filter query (e.g., { category: 'IT' })
 * @returns {Promise<Array>} - Matching jobs
 */
export const getJobsByFilter = async (filter) => {
    const jobs = await readData(FILENAME);
    return findByQuery(jobs, filter);
};

/**
 * Create a new job
 * @param {Object} jobData - Job data
 * @returns {Promise<Object>} - Created job with _id
 */
export const createJob = async (jobData) => {
    const jobs = await readData(FILENAME);
    
    const newJob = {
        _id: generateId(),
        ...jobData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    jobs.push(newJob);
    await writeData(FILENAME, jobs);
    
    return newJob;
};

/**
 * Update a job
 * @param {string} id - Job ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object|null>} - Updated job or null
 */
export const updateJob = async (id, updateData) => {
    const jobs = await readData(FILENAME);
    const index = jobs.findIndex(job => job._id === id);
    
    if (index === -1) return null;
    
    jobs[index] = {
        ...jobs[index],
        ...updateData,
        updatedAt: new Date().toISOString()
    };
    
    await writeData(FILENAME, jobs);
    return jobs[index];
};

/**
 * Delete a job
 * @param {string} id - Job ID
 * @returns {Promise<boolean>} - True if deleted, false if not found
 */
export const deleteJob = async (id) => {
    const jobs = await readData(FILENAME);
    const index = jobs.findIndex(job => job._id === id);
    
    if (index === -1) return false;
    
    jobs.splice(index, 1);
    await writeData(FILENAME, jobs);
    
    return true;
};

export default {
    getAllJobs,
    getJobById,
    getJobsByFilter,
    createJob,
    updateJob,
    deleteJob
};
