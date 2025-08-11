import './style.css';
import { notesApi } from './services/api.js';
import { NotesList, initializeNotesList } from './components/NotesList.js';
import { NoteEditor, initializeNoteEditor } from './components/NoteEditor.js';
import { debounce, generateTempId, handleApiError } from './utils/index.js';

// Application state
const appState = {
  notes: [],
  selectedNote: null,
  searchQuery: '',
  loading: false,
  saving: false,
  deleting: false,
  error: null
};

// PUBLIC_INTERFACE
/**
 * Main Notes Application class
 */
class NotesApp {
  constructor() {
    this.appElement = document.querySelector('#app');
    this.init();
  }

  // PUBLIC_INTERFACE
  /**
   * Initialize the application
   */
  async init() {
    try {
      // Initialize event handlers
      this.initializeEventHandlers();
      
      // Load initial notes
      await this.loadNotes();
      
      // Render the initial UI
      this.render();
      
      console.log('Notes app initialized successfully');
    } catch (error) {
      console.error('Failed to initialize notes app:', error);
      this.showError('Failed to initialize the application. Please refresh the page.');
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Initialize event handlers for components
   */
  initializeEventHandlers() {
    // Initialize notes list handlers
    initializeNotesList({
      onNoteSelect: this.selectNote.bind(this),
      onNewNote: this.createNewNote.bind(this),
      onSearch: debounce(this.searchNotes.bind(this), 300)
    });

    // Initialize note editor handlers
    initializeNoteEditor({
      onSave: this.saveNote.bind(this),
      onDelete: this.deleteNote.bind(this)
    });
  }

  // PUBLIC_INTERFACE
  /**
   * Load all notes from the API
   */
  async loadNotes() {
    try {
      appState.loading = true;
      this.render();
      
      const response = await notesApi.getAllNotes();
      appState.notes = response.data || [];
      appState.error = null;
      
      // If no note is selected and we have notes, select the first one
      if (!appState.selectedNote && appState.notes.length > 0) {
        appState.selectedNote = appState.notes[0];
      }
    } catch (error) {
      console.error('Failed to load notes:', error);
      appState.error = handleApiError(error);
      appState.notes = [];
    } finally {
      appState.loading = false;
      this.render();
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Search notes by query
   * @param {string} query - Search query
   */
  async searchNotes(query) {
    try {
      appState.searchQuery = query;
      appState.loading = true;
      this.render();
      
      if (query.trim() === '') {
        // If query is empty, load all notes
        await this.loadNotes();
      } else {
        // Search for notes
        const response = await notesApi.searchNotes(query);
        appState.notes = response.data || [];
        appState.error = null;
        
        // Clear selection if current note is not in search results
        if (appState.selectedNote && !appState.notes.find(note => note.id === appState.selectedNote.id)) {
          appState.selectedNote = null;
        }
      }
    } catch (error) {
      console.error('Failed to search notes:', error);
      appState.error = handleApiError(error);
      appState.notes = [];
    } finally {
      appState.loading = false;
      this.render();
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Select a note for editing
   * @param {string} noteId - ID of the note to select
   */
  async selectNote(noteId) {
    try {
      // Find note in current notes list
      let note = appState.notes.find(n => n.id === noteId);
      
      if (!note) {
        // If not found in current list, try to fetch from API
        const response = await notesApi.getNoteById(noteId);
        note = response.data;
      }
      
      if (note) {
        appState.selectedNote = note;
        appState.error = null;
        this.render();
      }
    } catch (error) {
      console.error('Failed to select note:', error);
      this.showError(handleApiError(error));
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Create a new note
   */
  createNewNote() {
    const newNote = {
      id: generateTempId(),
      title: '',
      content: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    appState.selectedNote = newNote;
    appState.error = null;
    this.render();
    
    // Focus on title input
    setTimeout(() => {
      const titleInput = document.getElementById('note-title');
      if (titleInput) {
        titleInput.focus();
      }
    }, 100);
  }

  // PUBLIC_INTERFACE
  /**
   * Save the current note
   * @param {Object} noteData - Note data to save
   */
  async saveNote(noteData) {
    if (!appState.selectedNote) return;
    
    try {
      appState.saving = true;
      appState.error = null;
      this.render();
      
      let savedNote;
      
      if (appState.selectedNote.id.startsWith('temp_')) {
        // Create new note
        const response = await notesApi.createNote(noteData);
        savedNote = response.data;
        
        // Add to notes list
        appState.notes.unshift(savedNote);
      } else {
        // Update existing note
        const response = await notesApi.updateNote(appState.selectedNote.id, noteData);
        savedNote = response.data;
        
        // Update in notes list
        const index = appState.notes.findIndex(n => n.id === appState.selectedNote.id);
        if (index >= 0) {
          appState.notes[index] = savedNote;
        }
      }
      
      appState.selectedNote = savedNote;
      
      // Show success feedback briefly
      this.showSuccess('Note saved successfully');
    } catch (error) {
      console.error('Failed to save note:', error);
      appState.error = handleApiError(error);
    } finally {
      appState.saving = false;
      this.render();
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Delete a note
   * @param {string} noteId - ID of the note to delete
   */
  async deleteNote(noteId) {
    try {
      appState.deleting = true;
      appState.error = null;
      this.render();
      
      await notesApi.deleteNote(noteId);
      
      // Remove from notes list
      appState.notes = appState.notes.filter(n => n.id !== noteId);
      
      // Clear selection if deleted note was selected
      if (appState.selectedNote && appState.selectedNote.id === noteId) {
        appState.selectedNote = appState.notes.length > 0 ? appState.notes[0] : null;
      }
      
      this.showSuccess('Note deleted successfully');
    } catch (error) {
      console.error('Failed to delete note:', error);
      appState.error = handleApiError(error);
    } finally {
      appState.deleting = false;
      this.render();
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Show error message
   * @param {string} message - Error message to display
   */
  showError(message) {
    appState.error = message;
    this.render();
  }

  // PUBLIC_INTERFACE
  /**
   * Show success message
   * @param {string} message - Success message to display
   */
  showSuccess(message) {
    // Simple success feedback - could be enhanced with a toast system
    console.log('Success:', message);
    
    // Clear any existing error
    appState.error = null;
    
    // You could implement a toast notification system here
    // For now, we'll just log it and clear errors
  }

  // PUBLIC_INTERFACE
  /**
   * Render the entire application
   */
  render() {
    const notesListHtml = NotesList({
      notes: appState.notes,
      selectedNoteId: appState.selectedNote ? appState.selectedNote.id : null,
      searchQuery: appState.searchQuery,
      loading: appState.loading
    });

    const noteEditorHtml = NoteEditor({
      note: appState.selectedNote,
      saving: appState.saving,
      deleting: appState.deleting,
      error: appState.error
    });

    this.appElement.innerHTML = `
      <div class="app-container">
        ${notesListHtml}
        ${noteEditorHtml}
      </div>
    `;
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new NotesApp();
  // Make appState globally accessible for components
  window.appState = appState;
});

// Handle browser back/forward navigation
window.addEventListener('popstate', (event) => {
  // You can implement navigation state management here if needed
  console.log('Navigation state changed:', event.state);
});

// Handle page visibility changes to potentially refresh data
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    // Page became visible - you could refresh data here if needed
    console.log('Page became visible');
  }
});

// Export for potential use in other modules
export { NotesApp, appState };
