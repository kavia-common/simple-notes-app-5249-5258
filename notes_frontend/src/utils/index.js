// PUBLIC_INTERFACE
/**
 * Format a date string to a human-readable format
 * @param {string|Date} dateString - The date to format
 * @returns {string} Formatted date string
 */
export function formatDate(dateString) {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now - date;
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) {
    // Today - show time
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diffInDays === 1) {
    // Yesterday
    return 'Yesterday';
  } else if (diffInDays < 7) {
    // This week - show day name
    return date.toLocaleDateString([], { weekday: 'long' });
  } else if (diffInDays < 365) {
    // This year - show month and day
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  } else {
    // Older - show month, day, and year
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  }
}

// PUBLIC_INTERFACE
/**
 * Generate a preview text from note content
 * @param {string} content - The note content
 * @param {number} maxLength - Maximum length of preview (default: 100)
 * @returns {string} Preview text
 */
export function generatePreview(content, maxLength = 100) {
  if (!content) return 'No content';
  
  // Remove line breaks and extra spaces
  const cleanContent = content.replace(/\s+/g, ' ').trim();
  
  if (cleanContent.length <= maxLength) {
    return cleanContent;
  }
  
  return cleanContent.substring(0, maxLength).trim() + '...';
}

// PUBLIC_INTERFACE
/**
 * Debounce function to limit the rate of function calls
 * @param {Function} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// PUBLIC_INTERFACE
/**
 * Check if a string is empty or contains only whitespace
 * @param {string} str - The string to check
 * @returns {boolean} True if empty or whitespace only
 */
export function isEmpty(str) {
  return !str || str.trim().length === 0;
}

// PUBLIC_INTERFACE
/**
 * Generate a unique ID for new notes (client-side temporary ID)
 * @returns {string} Unique ID
 */
export function generateTempId() {
  return `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// PUBLIC_INTERFACE
/**
 * Validate note data
 * @param {Object} noteData - The note data to validate
 * @param {string} noteData.title - The note title
 * @param {string} noteData.content - The note content
 * @returns {Object} Validation result with isValid boolean and errors array
 */
export function validateNote(noteData) {
  const errors = [];
  
  if (isEmpty(noteData.title)) {
    errors.push('Title is required');
  } else if (noteData.title.trim().length > 200) {
    errors.push('Title must be 200 characters or less');
  }
  
  if (isEmpty(noteData.content)) {
    errors.push('Content is required');
  } else if (noteData.content.trim().length > 10000) {
    errors.push('Content must be 10,000 characters or less');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// PUBLIC_INTERFACE
/**
 * Handle API errors and return user-friendly messages
 * @param {Error} error - The error object
 * @returns {string} User-friendly error message
 */
export function handleApiError(error) {
  if (!error.response) {
    return 'Unable to connect to the server. Please check your internet connection.';
  }
  
  const { status, data } = error.response;
  
  switch (status) {
    case 400:
      return data.message || 'Invalid request. Please check your input.';
    case 401:
      return 'You are not authorized to perform this action.';
    case 403:
      return 'You do not have permission to perform this action.';
    case 404:
      return 'The requested note was not found.';
    case 409:
      return data.message || 'A conflict occurred. Please try again.';
    case 422:
      return data.message || 'Invalid data provided.';
    case 500:
      return 'An internal server error occurred. Please try again later.';
    case 502:
    case 503:
    case 504:
      return 'The server is temporarily unavailable. Please try again later.';
    default:
      return data.message || 'An unexpected error occurred. Please try again.';
  }
}
