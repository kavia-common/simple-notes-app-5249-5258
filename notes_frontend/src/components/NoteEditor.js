import { Save, Trash2, FileText } from '../utils/icons.js';
import { validateNote } from '../utils/index.js';

// PUBLIC_INTERFACE
/**
 * Note editor component for the main content area
 * @param {Object} props - Component props
 * @param {Object|null} props.note - The note being edited
 * @param {Function} props.onSave - Callback when note is saved
 * @param {Function} props.onDelete - Callback when note is deleted
 * @param {boolean} props.saving - Whether the note is being saved
 * @param {boolean} props.deleting - Whether the note is being deleted
 * @param {string|null} props.error - Error message to display
 * @returns {string} HTML string for the note editor
 */
export function NoteEditor({
  note = null,
  onSave: _onSave,
  onDelete: _onDelete,
  saving = false,
  deleting = false,
  error = null
}) {
  const saveIcon = Save({ className: 'icon' });
  const deleteIcon = Trash2({ className: 'icon' });
  const fileIcon = FileText({ size: 48, color: 'var(--text-muted)' });
  
  // Event handlers are managed through the initialization system
  
  if (!note) {
    return `
      <div class="main-content">
        <div class="empty-state">
          ${fileIcon}
          <h2>Select a note to edit</h2>
          <p>Choose a note from the sidebar or create a new one to get started.</p>
        </div>
      </div>
    `;
  }
  
  return `
    <div class="main-content">
      <div class="editor-header">
        <div class="editor-actions">
          <button 
            class="btn btn-primary" 
            onclick="window.noteEditor.handleSave()"
            ${saving || deleting ? 'disabled' : ''}
          >
            ${saveIcon}
            ${saving ? 'Saving...' : 'Save'}
          </button>
          
          ${note.id && !note.id.startsWith('temp_') ? `
            <button 
              class="btn btn-danger" 
              onclick="window.noteEditor.handleDelete()"
              ${saving || deleting ? 'disabled' : ''}
            >
              ${deleteIcon}
              ${deleting ? 'Deleting...' : 'Delete'}
            </button>
          ` : ''}
        </div>
      </div>
      
      ${error ? `<div class="error">${escapeHtml(error)}</div>` : ''}
      
      <div class="editor-content">
        <input 
          type="text" 
          id="note-title"
          class="title-input" 
          placeholder="Note title..."
          value="${escapeHtml(note.title || '')}"
          onkeydown="window.noteEditor.handleKeyDown(event)"
          ${saving || deleting ? 'disabled' : ''}
        />
        
        <textarea 
          id="note-content"
          class="content-textarea" 
          placeholder="Start writing your note..."
          onkeydown="window.noteEditor.handleKeyDown(event)"
          ${saving || deleting ? 'disabled' : ''}
        >${escapeHtml(note.content || '')}</textarea>
      </div>
    </div>
  `;
}

// PUBLIC_INTERFACE
/**
 * Initialize the note editor component with event handlers
 * @param {Object} handlers - Event handler functions
 * @param {Function} handlers.onSave - Save handler
 * @param {Function} handlers.onDelete - Delete handler
 */
export function initializeNoteEditor(handlers) {
  window.noteEditor = {
    handleSave: () => {
      const titleInput = document.getElementById('note-title');
      const contentTextarea = document.getElementById('note-content');
      
      if (!titleInput || !contentTextarea) return;
      
      const noteData = {
        title: titleInput.value.trim(),
        content: contentTextarea.value.trim()
      };
      
      const validation = validateNote(noteData);
      if (!validation.isValid) {
        alert(validation.errors.join('\n'));
        return;
      }
      
      if (handlers.onSave) {
        handlers.onSave(noteData);
      }
    },
    handleDelete: () => {
      const currentNote = window.appState?.selectedNote;
      if (!currentNote || !currentNote.id || currentNote.id.startsWith('temp_')) return;
      
      if (confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
        if (handlers.onDelete) {
          handlers.onDelete(currentNote.id);
        }
      }
    },
    handleKeyDown: (event) => {
      // Save with Ctrl+S or Cmd+S
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        window.noteEditor.handleSave();
      }
    }
  };
}

// Helper function to escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
