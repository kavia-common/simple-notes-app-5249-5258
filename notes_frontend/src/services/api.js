import axios from 'axios';

// Get API base URL from environment variable or use default
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor for adding authentication headers if needed
api.interceptors.request.use(
  (config) => {
    // Add authentication token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common HTTP errors
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login if needed
          localStorage.removeItem('authToken');
          break;
        case 403:
          // Forbidden
          console.error('Access forbidden:', data.message || 'You do not have permission to perform this action');
          break;
        case 404:
          // Not found
          console.error('Resource not found:', data.message || 'The requested resource was not found');
          break;
        case 500:
          // Server error
          console.error('Server error:', data.message || 'An internal server error occurred');
          break;
        default:
          console.error('API Error:', data.message || 'An unexpected error occurred');
      }
    } else if (error.request) {
      // Network error
      console.error('Network error:', 'Unable to connect to the server. Please check your internet connection.');
    } else {
      // Other error
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// PUBLIC_INTERFACE
/**
 * Notes API service for managing notes
 */
export const notesApi = {
  /**
   * Get all notes
   * @returns {Promise} Promise that resolves to an array of notes
   */
  getAllNotes: () => api.get('/notes'),
  
  /**
   * Get a specific note by ID
   * @param {string|number} id - The note ID
   * @returns {Promise} Promise that resolves to the note data
   */
  getNoteById: (id) => api.get(`/notes/${id}`),
  
  /**
   * Create a new note
   * @param {Object} noteData - The note data
   * @param {string} noteData.title - The note title
   * @param {string} noteData.content - The note content
   * @returns {Promise} Promise that resolves to the created note
   */
  createNote: (noteData) => api.post('/notes', noteData),
  
  /**
   * Update an existing note
   * @param {string|number} id - The note ID
   * @param {Object} noteData - The updated note data
   * @param {string} noteData.title - The note title
   * @param {string} noteData.content - The note content
   * @returns {Promise} Promise that resolves to the updated note
   */
  updateNote: (id, noteData) => api.put(`/notes/${id}`, noteData),
  
  /**
   * Delete a note
   * @param {string|number} id - The note ID
   * @returns {Promise} Promise that resolves when the note is deleted
   */
  deleteNote: (id) => api.delete(`/notes/${id}`),
  
  /**
   * Search notes by query
   * @param {string} query - The search query
   * @returns {Promise} Promise that resolves to an array of matching notes
   */
  searchNotes: (query) => api.get(`/notes/search?q=${encodeURIComponent(query)}`),
};

export default api;
