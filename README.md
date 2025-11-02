# Game Design Notepad - Frontend

A modern React-based frontend for the Game Design Notepad application, providing an intuitive interface for organizing and analyzing game design elements.

## Overview

This frontend application allows users to:

- Browse and manage collections (both internal and external)
- Create and organize items with types, tags, and color schemes
- View relationships between items
- Take detailed notes on any element
- Filter and search through collections
- Manage user authentication

## Tech Stack

- **Framework**: React 18.3.1
- **Router**: React Router DOM 6.26.2
- **Build Tool**: Vite 5.3.4
- **Styling**: Sass
- **Icons**: Font Awesome
- **Testing**: Playwright 1.49.1
- **Linting**: ESLint

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the frontend directory:

   ```bash
   cd gd-notepad-fe
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The application will start on `http://localhost:5173` (or another port if 5173 is in use)

## Available Scripts

- `npm run dev` - Start development server with hot module reloading
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality
- `npm run test` - Run all Playwright tests
- `npm run test:ui` - Run tests with interactive UI mode
- `npm run test:headed` - Run tests with visible browser

## Application Structure

```
gd-notepad-fe/
├── public/               # Static assets
├── src/
│   ├── assets/          # Images, fonts, etc.
│   ├── components/      # React components
│   │   ├── context/     # Context providers (Auth, Collections)
│   │   ├── forms/       # Form components
│   │   ├── item-cards/  # Card views and displays
│   │   ├── nav/         # Navigation components
│   │   └── pages/       # Page components
│   │       ├── collections/
│   │       └── external-collections/
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility libraries
│   ├── styles/          # Sass stylesheets
│   ├── util/            # Utility functions
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Application entry point
├── tests/               # Playwright test suites
├── dist/                # Production build output
└── package.json         # Dependencies and scripts
```

## Features

### Collections

- **External Collections**: Browse game collections from Google Sheets
- **Internal Collections**: Create and manage your own game collections
- **Collection Details**: View items, types, relationships, and notes for each collection

### items

- **Items**: Create items with customizable types
- **Types**: Define categories with color schemes and icons
- **Relationships**: Link items together with descriptive relationships
- **Tags**: Label and organize items across collections
- **Notes**: Take detailed notes on any element

### User Interface

- **Multiple View Types**: Square, Card, Row, and Page views
- **Advanced Filtering**: Filter by type, relationships, and search terms
- **Responsive Design**: Works on desktop and mobile devices
- **Color Coding**: Visual organization with custom color schemes

### Authentication

- User login/logout
- Protected routes
- Session management
- Role-based access (coming soon)

## Routes

- `/` - Home page (External Collections)
- `/login` - Login page
- `/dashboard` - Dashboard (requires authentication)
- `/collection/:id` - Internal collection details
- `/external-collection/:id` - External collection details
- `/item/:id` - Item details
- `/type/:id` - Type details

## Testing

The application includes comprehensive Playwright tests covering:

- Collection browsing and navigation
- Item display and filtering
- Authentication flows
- Search functionality
- View type switching

Run tests with:

```bash
npm run test
```

## Configuration

### Environment Variables

The application expects the backend API to be running at `http://localhost:8086`. Configure this in:

- `src/lib/apiCall.js` - API base URL configuration

### Google Sheets Integration

External collections load from a Google Sheet configured in:

- `src/components/pages/external-collections/ExternalCollections.jsx`

## Development Notes

### Context Providers

- **AuthContext**: Manages user authentication state
- **CollectionContext**: Manages collection data and API calls

### Custom Hooks

- `useFetch`: Fetch data from API
- `useTriggeredFetch`: Fetch data with manual triggers
- `useItemActions`: Handle item navigation and deletion

### Styling

- Global styles in `styles/main.scss`
- Component-specific styles in respective directories
- Sass mixins for reusable styles

## Contributing

When contributing to the frontend:

1. Follow existing code style
2. Add tests for new features
3. Run linting before committing
4. Ensure all tests pass

## License

See LICENSE file for details.
