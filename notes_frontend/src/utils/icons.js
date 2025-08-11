// PUBLIC_INTERFACE
/**
 * Simple SVG icons for the notes application
 */

/**
 * Search icon
 * @param {Object} props - Icon properties
 * @param {string} props.className - CSS class name
 * @returns {string} SVG icon as HTML string
 */
export function Search({ className = '' } = {}) {
  return `<svg class="${className}" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>`;
}

/**
 * Plus icon
 * @param {Object} props - Icon properties
 * @param {string} props.className - CSS class name
 * @returns {string} SVG icon as HTML string
 */
export function Plus({ className = '' } = {}) {
  return `<svg class="${className}" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 5v14"></path>
    <path d="M5 12h14"></path>
  </svg>`;
}

/**
 * Save icon
 * @param {Object} props - Icon properties
 * @param {string} props.className - CSS class name
 * @returns {string} SVG icon as HTML string
 */
export function Save({ className = '' } = {}) {
  return `<svg class="${className}" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
    <polyline points="17,21 17,13 7,13 7,21"></polyline>
    <polyline points="7,3 7,8 15,8"></polyline>
  </svg>`;
}

/**
 * Trash2 icon
 * @param {Object} props - Icon properties
 * @param {string} props.className - CSS class name
 * @returns {string} SVG icon as HTML string
 */
export function Trash2({ className = '' } = {}) {
  return `<svg class="${className}" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="3,6 5,6 21,6"></polyline>
    <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>`;
}

/**
 * FileText icon
 * @param {Object} props - Icon properties
 * @param {string} props.className - CSS class name
 * @param {number} props.size - Icon size (default: 16)
 * @param {string} props.color - Icon color
 * @returns {string} SVG icon as HTML string
 */
export function FileText({ className = '', size = 16, color = 'currentColor' } = {}) {
  return `<svg class="${className}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M14,2H6a2,2 0 0,0 -2,2v16a2,2 0 0,0 2,2h12a2,2 0 0,0 2,-2V8z"></path>
    <polyline points="14,2 14,8 20,8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10,9 9,9 8,9"></polyline>
  </svg>`;
}
