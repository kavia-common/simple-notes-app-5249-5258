import { Search, Plus } from '../utils/icons.js';
import { formatDate, generatePreview } from '../utils/index.js';

// PUBLIC_INTERFACE
/**
 * Notes list component for the sidebar
 * @param {Object} props - Component props
 * @param {Array} props.notes - Array of notes to display
 * @param {string|null} props.selectedNoteId - ID of the currently selected note
 * @param {Function} props.onNoteSelect - Callback when a note is selected
 * @param {Function} props.onNewNote - Callback when new note button is clicked
 * @param {Function} props.onSearch - Callback when search input changes
 * @param {string} props.searchQuery - Current search query
 * @param {boolean} props.loading - Whether notes are loading
 * @returns {string} HTML string for the notes list
 */
export function NotesList({
  notes = [],
  selectedNoteId = null,
  onNoteSelect: _onNoteSelect,
  onNewNote: _onNewNote,
  onSearch: _onSearch,
  searchQuery = '',
  loading = false
}) {
  const searchIcon = Search({ className: 'search-icon' });
  const plusIcon = Plus({ className: 'icon' });
  
  // Event handlers are attached via the initialization system
  
  const renderNoteItem = (note) => {
    const isActive = selectedNoteId === note.id;
    const preview = generatePreview(note.content, 80);
    const formattedDate = formatDate(note.updated_at || note.created_at);
    
    return `
      <div class="note-item ${isActive ? 'active' : ''}" 
           onclick="window.notesList.handleNoteClick('${note.id}')">
        <h3 class="note-title">${escapeHtml(note.title || 'Untitled')}</h3>
        <p class="note-preview">${escapeHtml(preview)}</p>
        <div class="note-date">${formattedDate}</div>
      </div>
    `;
  };
  
  const renderNotesList = () => {
    if (loading) {
      return '<div class="loading">Loading notes...</div>';
    }
    
    if (notes.length === 0) {
      return `
        <div class="empty-state" style="padding: 2rem 1.5rem; text-align: center; color: var(--text-secondary);">
          <h3 style="margin: 0 0 0.5rem 0; font-size: 1rem; font-weight: 500;">No notes found</h3>
          <p style="margin: 0; font-size: 0.875rem;">
            ${searchQuery ? 'Try adjusting your search query.' : 'Create your first note to get started.'}
          </p>
        </div>
      `;
    }
    
    return notes.map(renderNoteItem).join('');
  };
  
  return `
    <div class="sidebar">
      <div class="header">
        <h1>Notes</h1>
      </div>
      
      <div class="search-section">
        <div class="search-container">
          ${searchIcon}
          <input 
            type="text" 
            class="search-input" 
            placeholder="Search notes..."
            value="${escapeHtml(searchQuery)}"
            oninput="window.notesList.handleSearchInput(event)"
          />
        </div>
        
        <button 
          class="new-note-btn" 
          onclick="window.notesList.handleNewNoteClick()"
        >
          ${plusIcon}
          New Note
        </button>
      </div>
      
      <div class="notes-list">
        ${renderNotesList()}
      </div>
    </div>
  `;
}

// PUBLIC_INTERFACE
/**
 * Initialize the notes list component with event handlers
 * @param {Object} handlers - Event handler functions
 * @param {Function} handlers.onNoteSelect - Note selection handler
 * @param {Function} handlers.onNewNote - New note handler
 * @param {Function} handlers.onSearch - Search handler
 */
export function initializeNotesList(handlers) {
  window.notesList = {
    handleNoteClick: handlers.onNoteSelect,
    handleNewNoteClick: handlers.onNewNote,
    handleSearchInput: handlers.onSearch
  };
}

// Helper function to escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
