# Axiomancer Frontend - Game Implementation Changes

## Overview
This document outlines all the changes made to implement the core game pages and functionality based on the game-documentation.md requirements. The implementation follows a dark fantasy aesthetic inspired by Mork Borg, Elden Ring, and Buriedbornes.

## New Files Created

### Context & State Management

#### `src/context/CharacterContext.tsx`
- **Purpose**: Centralized character state management with mocked API calls
- **Key Features**:
  - Mock `/get-character` API call with 3-second delay
  - Character creation with portrait-based stat bonuses
  - Portrait unlock system (only elf, Drake, Arc-mage unlocked initially)
  - Complete character data structure including basic and detailed stats
  - Error handling and loading states

#### `src/hooks/useMapLocation.ts`
- **Purpose**: Custom hook for location-based map image selection
- **Features**:
  - Dynamic map image selection based on character location
  - Placeholder images using Picsum for different locations
  - Extensible for future location additions

### Pages

#### `src/Pages/LoadingPage/LoadingPage.tsx`
- **Purpose**: Dark fantasy-themed loading screen
- **Design Elements**:
  - Atmospheric dark gradients with brown/orange accents
  - Pulsating animations and flickering title effect
  - 3-second loading simulation
  - Flavor text emphasizing the game's dark themes
  - "Awakening from the Void" loading message

#### `src/Pages/CharacterPage/CharacterPage.tsx`
- **Purpose**: Character selection hub (handles both no-character and existing character states)
- **Features**:
  - Dotted border "Create Character" card with hover effects
  - Character display card showing stats, health, mana
  - Portrait integration with `/images/portraits/` assets
  - Navigation to exploration page on character selection
  - Modal integration for character creation

#### `src/Pages/CharacterPage/CharacterCreationModal.tsx`
- **Purpose**: Character creation modal overlay
- **Key Features**:
  - Portrait dropdown with all available options
  - Locked overlay for unavailable portraits
  - Real-time stat preview based on portrait selection
  - Stat bonuses system (locked characters show enhanced stats)
  - Form validation and loading states
  - Dark fantasy modal styling with blur backdrop

#### `src/Pages/ExplorationPage/ExplorationPage.tsx`
- **Purpose**: Main exploration interface with three-pane layout
- **Layout Implementation**:
  - **Top-left Description Pane**: Location info with action buttons
    - Dynamic location header with icon
    - Atmospheric location description
    - Action buttons (Enter Combat, Rest, Inventory)
  - **Top-right Map Pane**: Location-based map display
    - Custom hook integration for dynamic map images
    - Sepia filter for dark fantasy aesthetic
  - **Bottom Character Pane**: Expandable character stats
    - **Collapsed view**: Health/Mana bars + core stats (Body/Mind/Heart)
    - **Expanded view**: Full detailed stats breakdown by category
    - Clickable expand/collapse with smooth transitions
    - Color-coded stat categories (Body=red, Mind=blue, Heart=green)
    - Experience bar and tooltip area

#### `src/Pages/CombatPage/CombatPage.tsx`
- **Purpose**: Turn-based combat interface
- **Combat System Implementation**:
  - **Enemy Pane**: Enemy portrait, name, health bar
  - **Battle Log Pane**: Scrollable combat history with colored entries
  - **Player Action Pane**: Two-section layout
    - **Player Info**: Portrait, level, health/mana, move type selection
    - **Action Selection**: Attack/Defend/Special Attack buttons
  - **Advantage System**: 
    - Body > Mind > Heart > Body (rock-paper-scissors)
    - Visual indicators for advantage/disadvantage states
    - Color-coded move type buttons with advantage highlighting
  - **Move Selection**: Two-step process (move type → action type)
  - Flee option to return to exploration

## Modified Files

### `src/App.tsx`
- **Changes**:
  - Added imports for all new pages
  - Wrapped app in CharacterProvider
  - Added routes for `/loading`, `/character`, `/exploration`, `/combat`
  - Maintained existing AuthProvider wrapper

### `src/context/AuthContext.tsx` (Previously Modified)
- Updated to support proper login/register flow with password handling
- Renamed `isUserLoggedIn` to `isLoggedIn` as requested
- Enhanced API parameter handling for both username+password (login) and username+email+password (register)

## Design Decisions & Rationale

### Dark Fantasy Aesthetic
- **Color Palette**: Dark grays/blacks with brown (#8B4513) and red accents
- **Visual Effects**: Gradients, glows, shadows, and atmospheric elements
- **Typography**: Bold fonts with text shadows and letter spacing
- **No Light-Hearted Elements**: All UI elements convey struggle, death, and moral ambiguity

### Portrait System Implementation
- **Asset Integration**: Uses actual files from `/public/images/portraits/`
- **Filename Display**: Shows portrait names minus extensions (e.g., "Arc-mage.jpg" → "Arc-mage")
- **Lock System**: Visual overlays and stat previews for locked characters
- **Stat Bonuses**: Each portrait has predefined stat bonuses applied at creation

### Stats System Architecture
- **Two-Tier Display**: 
  - Basic stats (Body/Mind/Heart) always visible
  - Detailed stats (Physical Atk, Mental Def, etc.) in expanded view only
- **Character Creation**: All stats start at 0 unless portrait bonuses apply
- **Detailed Stats**: Full breakdown matching `exploration_expanded.png` reference

### Combat Mechanics Foundation
- **Advantage System**: Implemented rock-paper-scissors mechanics from game docs
- **Visual Feedback**: Color coding and indicators for strategic clarity  
- **Two-Phase Selection**: Move type selection → action selection (as specified)
- **Battle Log**: Structured for future expansion with different entry types

### State Management Strategy
- **Single Source of Truth**: CharacterContext holds all character data
- **API Simulation**: Realistic 2-3 second delays for authentic feel
- **Error Handling**: Proper loading/error states throughout
- **Mocked Data**: Rich, realistic character data for demonstration

## Technical Implementation Notes

### Responsive Design
- Grid layouts for proper pane organization
- Flexible components that scale with content
- Hover effects and transitions for enhanced UX

### Performance Considerations
- Optimized re-renders with proper dependency arrays
- Image optimization with object-fit and filters
- Conditional rendering for expanded/collapsed states

### Future Extensibility
- Modular component structure for easy expansion
- Hook-based architecture for reusable logic
- Clear separation of concerns between UI and data

### Asset Management
- Dynamic portrait loading from public directory
- Placeholder map images ready for replacement
- Filter effects for consistent dark fantasy look

## Game Flow Implementation

1. **Authentication** → Login/Register (existing)
2. **Character Loading** → LoadingPage (3s simulation)  
3. **Character Selection** → CharacterPage (create or select)
4. **Character Creation** → Modal overlay with portrait selection
5. **Exploration** → Main game interface with three panes
6. **Combat** → Turn-based combat with advantage system

## Testing Notes
- All mocked API calls include realistic delays
- Character creation properly validates portrait selection
- Navigation flow works correctly between all pages
- Combat advantage system displays proper visual feedback
- Stats display correctly in both collapsed and expanded modes

## Next Steps for Future Development
1. Replace placeholder map images with actual game art
2. Implement actual combat calculations and mechanics
3. Add inventory system and item management  
4. Create additional locations and enemy types
5. Implement save/load functionality
6. Add sound effects and background music
7. Integrate actual backend API calls
8. Implement the labyrinth progression system
9. Add faction system and moral choice mechanics
10. Create multiple endings based on player choices

## Dependencies Added
- All implementations use existing dependencies (React, Emotion, React Router)
- No additional package installations required
- Leverages existing dark fantasy design system