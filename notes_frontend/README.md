# Notes Frontend Application

A modern, minimalistic single-page application for managing notes built with Vite and vanilla JavaScript.

## Features

- **Create Notes**: Add new notes with title and content
- **Edit Notes**: Update existing notes in real-time
- **Delete Notes**: Remove notes with confirmation
- **Search Notes**: Find notes by title or content
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean, minimalistic design with custom color palette

## Color Palette

- **Primary**: #4F8A8B (Teal Blue)
- **Secondary**: #FBD46D (Golden Yellow)  
- **Accent**: #F85F73 (Coral Pink)

## Technology Stack

- **Frontend**: Vite + Vanilla JavaScript (ES6+)
- **HTTP Client**: Axios
- **Icons**: Lucide
- **Styling**: Modern CSS with CSS Variables
- **Linting**: ESLint with modern configuration

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── NoteEditor.js   # Note editing interface
│   └── NotesList.js    # Notes sidebar list
├── services/           # API and external services
│   └── api.js          # REST API client
├── utils/              # Utility functions
│   └── index.js        # Common helpers and validators
├── main.js             # Application entry point
└── style.css           # Global styles and theme
```

## Development

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

Built files will be in the `dist/` directory.

### Linting

```bash
npm run lint
```

## Environment Configuration

Copy `.env.example` to `.env` and configure:

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api

# Application Configuration  
VITE_APP_NAME=Notes App
VITE_APP_VERSION=1.0.0
```

## API Integration

The application expects a REST API with the following endpoints:

- `GET /api/notes` - Get all notes
- `GET /api/notes/:id` - Get specific note
- `POST /api/notes` - Create new note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note
- `GET /api/notes/search?q=query` - Search notes

### Note Data Format

```json
{
  "id": "string|number",
  "title": "string",
  "content": "string", 
  "created_at": "ISO date string",
  "updated_at": "ISO date string"
}
```

## Features Detail

### Notes Management
- **Create**: Click "New Note" button or use keyboard shortcut
- **Edit**: Select note from sidebar to edit in main area
- **Save**: Click save button or use Ctrl/Cmd + S
- **Delete**: Click delete button with confirmation dialog

### Search Functionality
- Real-time search as you type
- Searches both title and content
- Debounced for performance
- Clear search to show all notes

### Keyboard Shortcuts
- `Ctrl/Cmd + S`: Save current note
- `Ctrl/Cmd + N`: Create new note (when implemented)

### Responsive Design
- **Desktop**: Sidebar + main content layout
- **Mobile**: Stacked layout with collapsible sidebar
- **Touch-friendly**: Optimized for mobile interaction

## Architecture

### Component System
- **Functional Components**: Pure functions returning HTML strings
- **Event System**: Global event handlers via window object
- **State Management**: Centralized application state
- **Service Layer**: Separated API logic

### Error Handling
- **Network Errors**: User-friendly error messages
- **Validation**: Client-side input validation
- **Loading States**: Visual feedback during operations
- **Offline Support**: Graceful degradation

### Performance
- **Debounced Search**: Prevents excessive API calls
- **Optimized Rendering**: Minimal DOM updates
- **Code Splitting**: Modular architecture
- **Caching**: Browser caching for assets

## Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## Contributing

1. Follow the existing code style
2. Add comments for public interfaces
3. Include error handling
4. Test on multiple browsers
5. Update documentation

## License

MIT License - see LICENSE file for details
