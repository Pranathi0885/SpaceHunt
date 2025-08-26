# Overview

Space Hunt Mission is an orbital debris collection web-based video game built to educate players about the growing problem of space junk. The application is a 2D interactive game where players select collection tools, navigate to planets, complete maze challenges, and collect orbital debris while avoiding satellites. Players can then choose to dispose of debris in graveyards or recycle it into useful space products. The game combines educational content about space debris with engaging gameplay mechanics.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The application uses a React-based frontend with TypeScript, leveraging modern React patterns:
- **Component Structure**: Game phases are organized into separate components (StartScreen, ToolSelection, PlanetSelection, MazeGame, DebrisCollection, EndGame, Graveyard, RecyclingCenter)
- **State Management**: Zustand is used for game state management with separate stores for game logic (`useSpaceGame`) and audio controls (`useAudio`)
- **Styling**: Tailwind CSS provides utility-first styling with a custom theme configuration supporting dark mode
- **UI Components**: Radix UI primitives are used for accessible, customizable UI components
- **3D Graphics**: React Three Fiber and Drei provide 3D rendering capabilities for enhanced visual effects

## Backend Architecture
The backend follows a minimal Express.js architecture:
- **Server Structure**: Express.js server with modular route registration
- **Data Storage**: Abstract storage interface (`IStorage`) with in-memory implementation (`MemStorage`) for user data
- **Development Setup**: Vite integration for hot module replacement and development server
- **Production Build**: ESBuild handles server-side bundling for production deployment

## Game Architecture
The game implements a phase-based state machine:
- **Game Phases**: Sequential phases (start, tool-selection, planet-selection, maze-game, debris-collection, end-game, graveyard, recycling)
- **Physics Simulation**: Custom orbital mechanics calculations for realistic space object movement using elliptical orbits
- **Collision Detection**: AABB and circular collision detection systems for game interactions
- **Audio System**: Centralized audio management with mute controls and sound effect triggers

## Data Storage Solutions
- **Database Layer**: Drizzle ORM configured for PostgreSQL with schema definitions
- **Local Storage**: Browser localStorage for user preferences and game settings
- **Memory Storage**: Runtime storage for game state and temporary data during gameplay

# External Dependencies

## Database and ORM
- **Drizzle Kit**: Database migrations and schema management
- **@neondatabase/serverless**: Serverless PostgreSQL database connectivity
- **Drizzle-Zod**: Runtime schema validation integration

## Frontend Libraries
- **React Ecosystem**: React 18 with TypeScript for component-based UI
- **Three.js Stack**: @react-three/fiber, @react-three/drei, @react-three/postprocessing for 3D graphics
- **State Management**: Zustand for lightweight state management
- **UI Framework**: Radix UI primitives with Tailwind CSS for consistent design system
- **Data Fetching**: TanStack React Query for server state management

## Development Tools
- **Build Tools**: Vite for fast development and building, ESBuild for server bundling
- **TypeScript**: Full TypeScript support across frontend and backend
- **Styling**: PostCSS with Tailwind CSS and Autoprefixer
- **GLSL Support**: vite-plugin-glsl for shader loading capabilities

## Audio and Assets
- **Font Loading**: @fontsource/inter for consistent typography
- **Asset Support**: Custom Vite configuration for 3D models (.gltf, .glb) and audio files (.mp3, .ogg, .wav)

## Utility Libraries
- **Styling Utilities**: clsx and tailwind-merge for conditional class names
- **Date Handling**: date-fns for date manipulation
- **Validation**: Zod for runtime type checking and validation
- **Command Interface**: cmdk for command palette functionality