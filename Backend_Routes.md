# Axiomancer Backend API Documentation

## Overview
This document provides comprehensive documentation for the Axiomancer game backend API. The backend serves as a persistent storage and state management system for a philosophical RPG where players navigate through childhood, labyrinth exploration, and adult political intrigue using logical reasoning and debate mechanics.

**Current Implementation Status**: Mock API services are implemented in TypeScript with full interfaces and error handling. Four core game systems are fully implemented with 59/233 tests passing. Real backend implementation pending.

## Base URL
```
http://localhost:3001/api  // Updated port from implementation
```

## Authentication
Uses JWT token-based authentication with Bearer tokens. All character and game-related endpoints require authentication headers:

```
Authorization: Bearer <token>
```

**Note**: Current mock implementation simulates authentication with localStorage tokens.

## Current Implementation Status

### Implemented API Services (Mock)
The following API services are fully implemented with TypeScript interfaces and mock responses:

**Core APIs** (`src/services/gameAPI.ts`):
- Character Management (CRUD operations)
- Game State Management (save/load, location tracking)
- Inventory and Equipment (items, equipment slots)
- Combat Statistics (fallacy knowledge, battle records)
- Exploration Progress (location history, area unlocks)
- Relationship Management (faction standings, NPC relationships)

**Quest & Story APIs** (`src/services/questAPI.ts`):
- Quest Progress (main, side, daily, hidden quests)
- Achievement System (combat, exploration, story, social categories)
- Story Milestones (chapter progress, choice consequences)

**Special Mechanics APIs** (`src/services/specialMechanicsAPI.ts`):
- Demon Contract System (soul sacrifice, stat boosts)
- Boat Building System (piece collection, completion)
- Labyrinth Progression (chamber completion, aging mechanics)

### Implemented Game Systems
- **Combat System**: D20 mechanics with Body>Mind>Heart advantage
- **Character Progression**: Experience, leveling, stat allocation, aging
- **Location System**: Starting town + forest with weather and encounters
- **Fallacy System**: Comprehensive database with combat integration
- **Equipment System**: Items with stat bonuses, rarity, level requirements

---

## User Management

### Create User
**POST** `/create-user`

Create a new user account.

**Request Body:**
```json
{
  "username": "string",
  "password": "string", 
  "email": "string"
}
```

**Response (201 - Success):**
```json
{
  "uid": "uuid-string",
  "username": "string"
}
```

**Response (200 - Username/Email Exists):**
```json
{
  "message": "Username or email already exists"
}
```

### Login User
**POST** `/login-user`

Authenticate user and get UID.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response (200 - Success):**
```json
{
  "uid": "uuid-string"
}
```

**Response (200 - Invalid Credentials):**
```json
{
  "message": "Invalid credentials"
}
```

### Delete User
**POST** `/delete-user`

Delete user account and all associated data.

**Request Body:**
```json
{
  "uid": "string"
}
```

**Response (200):**
```json
{
  "message": "User deleted successfully"
}
```

---

## Character Management

### Create Character
**POST** `/create-character`

Create a new character for a user. Each user can only have one character.

**Request Body:**
```json
{
  "name": "string",
  "portrait": "elf" | "Drake" | "Arc-mage" | "Air-lord" | "Angel" | "Arch-demon",
  "age": "number"
}
```

**Portrait Bonuses (from CharacterProgression.ts):**
- **elf**: Mind +1, Heart +1 - Balanced intellectual/social approach
- **Drake**: Body +2 - Pure physical approach  
- **Arc-mage**: Mind +2 - Pure intellectual approach
- **Air-lord**: Mind +2, Heart +2 - Advanced magical/social (locked)
- **Angel**: Body +1, Mind +1, Heart +3 - Balanced divine (locked)
- **Arch-demon**: Body +3, Mind +2, Heart +1 - Powerful demonic (locked)

**Base Stats (before portrait bonuses):**
- Body: 8, Mind: 6, Heart: 5
- Health: 50 + (Body × 5), Mana: 25 + (Mind × 3)

**Response (201):**
```json
{
  "id": "char-1234567890",
  "name": "string",
  "level": 1,
  "experience": 0,
  "experienceToNext": 150,
  "age": 15,
  "stats": {
    "body": 8,
    "mind": 7,
    "heart": 6,
    "health": 65,
    "mana": 36
  },
  "detailedStats": {
    "physicalAttack": 17,
    "physicalDefense": 13,
    "accuracy": 14,
    "speed": 13,
    "mentalAttack": 15,
    "mentalDefense": 11,
    "evasion": 10,
    "perception": 12,
    "socialAttack": 13,
    "socialDefense": 10,
    "ailmentAttack": 9,
    "ailmentDefense": 10
  },
  "availableStatPoints": 0,
  "skillPoints": 0,
  "currentLocation": "starting_town",
  "unlockedLocations": ["starting_town"]
}
```

### Get Character
**GET** `/get-character?uid=string`

Retrieve character data or check if character exists.

**Response (200 - Has Character):**
```json
{
  "hasCharacter": true,
  "character": {
    // Full character object
  }
}
```

**Response (200 - No Character):**
```json
{
  "hasCharacter": false
}
```

### Update Character
**PUT** `/update-character`

Update character stats, location, or experience.

**Request Body:**
```json
{
  "uid": "string",
  "stats": {
    "body": 10,
    "mind": 12,
    "heart": 11
  },
  "location": {
    "area": "forest-north",
    "coordinates": { "x": 5, "y": 10 }
  },
  "experience": 150
}
```

**Note:** Experience updates automatically handle level-ups and stat increases.

### Delete Character
**DELETE** `/delete-character`

Delete character and all associated game data.

**Request Body:**
```json
{
  "uid": "string"
}
```

### Get Character Stats
**GET** `/character-stats?uid=string`

Get detailed character statistics including calculated values.

---

## Game State Management

### Get Game State
**GET** `/get-game-state?uid=string&saveSlot=number`

Retrieve game state for a specific save slot (1-3).

**Response (200):**
```json
{
  "uid": "string",
  "characterId": "string",
  "saveSlot": 1,
  "phase": "childhood" | "labyrinth" | "adulthood",
  "currentLocation": {
    "area": "starting-town",
    "coordinates": { "x": 0, "y": 0 }
  },
  "unlockedAreas": ["starting-town", "forest-north"],
  "questProgress": {
    "boat-building": {
      "progress": 3,
      "maxProgress": 5,
      "completed": false
    }
  },
  "storyMilestones": [
    {
      "id": "first-combat",
      "name": "First Combat",
      "description": "Completed first combat encounter",
      "timestamp": "date"
    }
  ],
  "lastSaved": "date"
}
```

### Update Game State
**POST** `/update-game-state`

Update various aspects of game state.

**Request Body:**
```json
{
  "uid": "string",
  "saveSlot": 1,
  "phase": "labyrinth",
  "currentLocation": {
    "area": "forest-north",
    "coordinates": { "x": 10, "y": 15 }
  },
  "unlockedAreas": ["starting-town", "forest-north", "labyrinth-entrance"],
  "questProgress": {
    "boat-building": {
      "progress": 5,
      "maxProgress": 5,
      "completed": true
    }
  }
}
```

### Save Game
**POST** `/save-game`

Save current game state to a specific slot.

**Request Body:**
```json
{
  "uid": "string",
  "saveSlot": 1,
  "gameState": {
    // Partial game state data to save
  }
}
```

### Load Game
**POST** `/load-game`

Load game state from a specific save slot.

**Request Body:**
```json
{
  "uid": "string",
  "saveSlot": 1
}
```

### Get Save Slots
**GET** `/get-save-slots?uid=string`

Get all save slots for a user with metadata.

**Response (200):**
```json
{
  "saveSlots": [
    {
      "slot": 1,
      "occupied": true,
      "metadata": {
        "phase": "childhood",
        "lastSaved": "date",
        "currentLocation": {
          "area": "starting-town",
          "coordinates": { "x": 0, "y": 0 }
        }
      }
    },
    {
      "slot": 2,
      "occupied": false
    },
    {
      "slot": 3,
      "occupied": false
    }
  ]
}
```

### Update Story Milestone
**POST** `/update-story-milestone`

Record a new story milestone.

**Request Body:**
```json
{
  "uid": "string",
  "saveSlot": 1,
  "milestone": {
    "id": "first-demon-encounter",
    "name": "First Demon Encounter", 
    "description": "Met first demon after dying in the city"
  }
}
```

---

## Inventory & Equipment System

### Get Inventory
**GET** `/get-inventory?uid=string`

Get complete inventory including items, equipment, and gold.

**Response (200):**
```json
{
  "uid": "string",
  "items": [
    {
      "itemId": "health-potion",
      "quantity": 3,
      "equipped": false
    },
    {
      "itemId": "iron-sword", 
      "quantity": 1,
      "equipped": true,
      "equipmentSlot": "weapon"
    }
  ],
  "equipment": {
    "weapon": "iron-sword",
    "armor": null,
    "accessory1": null,
    "accessory2": null
  },
  "gold": 150,
  "maxSlots": 20,
  "boatProgress": {
    "piecesCollected": ["boat-hull", "boat-sail"],
    "totalPieces": 5,
    "completed": false
  }
}
```

### Add Item
**POST** `/add-item`

Add items to inventory. Stackable items will stack, unique items require inventory space.

**Request Body:**
```json
{
  "uid": "string",
  "itemId": "health-potion",
  "quantity": 2
}
```

### Remove Item
**POST** `/remove-item`

Remove items from inventory.

**Request Body:**
```json
{
  "uid": "string",
  "itemId": "health-potion", 
  "quantity": 1
}
```

### Equip Item
**POST** `/equip-item`

Equip item to appropriate slot. Unequips current item in slot.

**Request Body:**
```json
{
  "uid": "string",
  "itemId": "iron-sword",
  "slot": "weapon" | "armor" | "accessory1" | "accessory2"
}
```

**Response includes updated character stats with equipment bonuses.**

### Unequip Item
**POST** `/unequip-item`

Unequip item from slot and return to inventory.

**Request Body:**
```json
{
  "uid": "string",
  "slot": "weapon"
}
```

### Use Item
**POST** `/use-item`

Consume a consumable item and apply its effects.

**Request Body:**
```json
{
  "uid": "string",
  "itemId": "health-potion",
  "quantity": 1
}
```

**Response includes updated character stats after consumption.**

### Get Equipment
**GET** `/get-equipment?uid=string`

Get currently equipped items and their stat bonuses.

### Update Gold
**POST** `/update-gold`

Add or spend gold.

**Request Body:**
```json
{
  "uid": "string",
  "amount": 100,
  "operation": "add" | "spend"
}
```

### Get Boat Progress
**GET** `/get-boat-progress?uid=string`

Get boat building progress during childhood phase.

### Craft Boat
**POST** `/craft-boat`

Craft boat when all pieces are collected. Unlocks sea travel.

**Request Body:**
```json
{
  "uid": "string"
}
```

---

## Combat System

### Initiate Combat
**POST** `/initiate-combat`

Start combat with an enemy in a specific location.

**Request Body:**
```json
{
  "uid": "string",
  "enemyId": "forest-spirit-1",
  "location": "forest-north"
}
```

**Response (200):**
```json
{
  "id": "combat-session-123",
  "uid": "string",
  "enemyId": "forest-spirit-1",
  "location": "forest-north",
  "playerHp": 100,
  "playerMp": 50,
  "enemyHp": 80,
  "round": 1,
  "status": "active",
  "log": ["Combat initiated"],
  "createdAt": "date"
}
```

### Combat Action
**POST** `/combat-action`

Execute a combat action using the implemented D20 system.

**Request Body:**
```json
{
  "uid": "string",
  "combatId": "combat-session-123",
  "action": {
    "type": "Body" | "Mind" | "Heart",
    "action": "Attack" | "SpecialAttack" | "Defend"
  }
}
```

**D20 Combat System (Implemented):**
- **Hit Calculation**: 1d20 + accuracy vs evasion
- **Damage System**: 
  - Normal: 1d6 damage
  - Advantage: 1d8 damage  
  - Disadvantage: 1d4 damage
  - Defending: 1d4 damage (reduced)
- **Advantage Rules**: Body > Mind > Heart > Body (rock-paper-scissors)
- **Agreement System**: Both defend = +1 agreement point (3 = peaceful victory)
- **Fallacy Defense**: Defending triggers fallacy mini-game for damage reduction

### Use Special Attack
**POST** `/use-special-attack`

Use fallacy or paradox attacks that consume MP.

**Request Body:**
```json
{
  "uid": "string",
  "combatId": "combat-session-123",
  "attackId": "strawman-fallacy",
  "choice": {
    "type": "mind",
    "action": "special-attack"
  }
}
```

### Fallacy Challenge
**POST** `/fallacy-challenge`

Present fallacy identification mini-game when defending (auto-triggered by combat system).

**Response (from FallacyParadoxSystem.ts):**
```json
{
  "fallacyName": "Zeno's Paradox",
  "description": "The famous paradox questioning the possibility of motion itself",
  "question": "Your opponent argues: 'To reach me, you must first travel half the distance. But to travel half, you must first travel a quarter, and so on infinitely. Therefore, you can never reach me.' What resolves this paradox?",
  "options": [
    "Motion requires time, not just space",
    "Infinite divisions can still sum to a finite distance", 
    "The paradox ignores quantum mechanics",
    "Mathematics cannot describe reality"
  ],
  "correctAnswer": 1
}
```

**Implemented Fallacies:**
- **Paradoxes**: Zeno's Paradox, Ship of Theseus, Liar's Paradox, Achilles and the Tortoise
- **Logical Fallacies**: Ad Hominem, Straw Man, False Dichotomy
- **Rhetorical Fallacies**: Appeal to Emotion, Bandwagon Fallacy
- **Total**: 9 fallacies/paradoxes with full combat integration

**Defense Result:**
- Correct: 25% damage taken (75% reduction)
- Incorrect: 100% damage taken (no reduction)

### Demon Contract
**POST** `/demon-contract`

Handle demon contract offers after player death in empire city.

**Request Body:**
```json
{
  "uid": "string", 
  "demonName": "Belphegor",
  "contractType": "stat-boost" | "summoning",
  "accepted": true,
  "terms": {
    "sacrifice": "core-belief-compassion",
    "benefit": { "body": 3 }
  }
}
```

**Contract Types:**
- **stat-boost**: Immediate stat increase for sacrificing core belief
- **summoning**: Soul sacrifice for demon summoning ability (affects endings)

### Summon Demon
**POST** `/summon-demon`

Summon contracted demon in combat (requires soul sacrifice).

**Request Body:**
```json
{
  "uid": "string",
  "combatId": "combat-session-123", 
  "demonName": "Belphegor"
}
```

### Get Combat Statistics
**GET** `/combat-statistics?uid=string`

Get player's combat performance statistics.

### Get Available Special Attacks
**GET** `/available-special-attacks?uid=string`

Get unlocked special attacks with MP costs and unlock requirements.

---

## Exploration System

### Get Location
**GET** `/get-location?uid=string`

Get current location details including description and available actions.

**Response (200) - Implemented Locations:**
```json
{
  "area": "starting_town",
  "coordinates": { "x": 0, "y": 0 },
  "name": "Seafarer's Haven",
  "description": "A humble fishing village nestled between river and sea. Salt-stained wooden docks extend into dark waters, while weathered fishermen mend nets that have seen too many storms. The air carries the scent of brine and decay.",
  "type": "town",
  "properties": {
    "canRest": true,
    "hasShops": true, 
    "dangerLevel": 0,
    "weatherAffected": false
  },
  "encounters": {
    "combat": [],
    "events": ["village_gossip", "merchant_arrival", "fishing_boat_returns"],
    "npcs": ["village_elder", "fisherman", "merchant", "tavern_keeper"]
  },
  "resources": ["fish", "seaweed", "driftwood"]
}
```

**Northern Forest Location:**
```json
{
  "area": "northern_forest",
  "name": "Whispering Woods", 
  "description": "Ancient trees stretch endlessly before you, their gnarled branches creating a canopy so thick that daylight becomes a scarce commodity. Shadows move where no wind blows, and the very air seems thick with forgotten secrets.",
  "type": "wilderness",
  "properties": {
    "canRest": true,
    "hasShops": false,
    "dangerLevel": 3,
    "weatherAffected": true
  },
  "encounters": {
    "combat": ["forest_spirit", "wild_animal", "bandit_scout"],
    "events": ["ancient_ruin", "mysterious_clearing", "lost_traveler"],
    "npcs": ["hermit_philosopher", "traveling_merchant", "legendary_elk"]
  },
  "resources": ["herbs", "mushrooms", "wood", "berries"]
}
```

### Move to Location
**POST** `/move-to-location`

Move player to a new location (must be unlocked).

**Request Body:**
```json
{
  "uid": "string",
  "targetLocation": {
    "area": "forest-north",
    "coordinates": { "x": 5, "y": 10 }
  }
}
```

### Get Available Areas
**GET** `/get-available-areas?uid=string`

Get all areas with unlock status and descriptions.

**Response (200):**
```json
{
  "areas": [
    {
      "id": "starting-town",
      "name": "Harbor Town", 
      "unlocked": true,
      "description": "Your peaceful starting location"
    },
    {
      "id": "forest-north",
      "name": "Northern Forest",
      "unlocked": true, 
      "description": "A mysterious forest with ancient spirits"
    },
    {
      "id": "labyrinth-entrance",
      "name": "Labyrinth Entrance",
      "unlocked": false,
      "description": "The legendary labyrinth doors (Requires boat)"
    },
    {
      "id": "empire-city", 
      "name": "Empire City",
      "unlocked": false,
      "description": "The advanced civilization beyond the labyrinth"
    },
    {
      "id": "necronia",
      "name": "Necronia", 
      "unlocked": false,
      "description": "The dark city of cultists and demons (Special unlock required)"
    }
  ]
}
```

---

## Game Progression Overview

### Phase 1: Childhood (Boat Building)
- **Location**: Starting town and surrounding areas
- **Goal**: Collect boat pieces to build transportation
- **Mechanics**: Simple exploration, NPC interactions, basic combat with forest spirits
- **Key Quest**: Boat building (requires 5 pieces: hull, sail, rudder, mast, anchor)

### Phase 2: Labyrinth (Age Progression)  
- **Location**: Inside the massive labyrinth
- **Goal**: Navigate chambers and reach the empire
- **Mechanics**: Each chamber ages the character 1 year, puzzle solving, mythical creature combat
- **Progression**: Childhood → Adulthood transformation

### Phase 3: Adulthood (Empire Politics)
- **Location**: Empire city with warring factions
- **Goal**: Become the King's advisor
- **Mechanics**: Advanced philosophical combat, faction alignment, demon contracts
- **Factions**: Based on philosophical schools (Existentialists, Theists, etc.)

### Combat System Details
- **Body/Mind/Heart**: Rock-paper-scissors system with advantages
- **Special Attacks**: Fallacies and paradoxes learned throughout the game
- **Fallacy Mini-game**: Identify logical fallacies to reduce damage when defending
- **Demon Contracts**: Powerful but dangerous - affect game endings
- **Agreement System**: Alternative to violence, gain agreement points instead of dealing damage

### Ending Variations
- **Pure Path**: No demon contracts, achieved through skill and alignment
- **Demon Puppet**: Fully corrupted by demon contracts
- **Balanced Approach**: Strategic demon use with maintained independence
- **Faction Loyalty**: Endings based on chosen philosophical faction

---

## Error Handling

All endpoints return appropriate HTTP status codes:
- **200**: Success
- **201**: Created successfully  
- **400**: Bad request (validation error)
- **403**: Forbidden (unauthorized access)
- **404**: Resource not found
- **409**: Conflict (duplicate resource)
- **500**: Internal server error

Error responses include descriptive messages:
```json
{
  "message": "Descriptive error message"
}
```

---

## Database Models

### Character Stats Calculation (Implemented)
- **Base Health** = 50 + (Body × 5)
- **Base Mana** = 25 + (Mind × 3)
- **Experience Required** = 100 × 1.5^(level-1) [scaling formula]
- **Level Up Rewards** = +3 stat points, +1 skill point, health/mana increase
- **Detailed Stats** = Calculated from base stats with age multipliers

**Age-Based Stat Multipliers:**
- Youth (≤16): Body ×1.1, Mind ×0.8, Heart ×0.7
- Young Adult (17-25): Body ×1.0, Mind ×1.0, Heart ×1.0  
- Adult (26-40): Body ×0.9, Mind ×1.2, Heart ×1.1
- Middle Age (41-60): Body ×0.8, Mind ×1.3, Heart ×1.2
- Elder (60+): Body ×0.6, Mind ×1.4, Heart ×1.3

**Detailed Stat Formulas:**
- Physical Attack = (Body × 1.5 + 5) × age_multiplier
- Mental Attack = (Mind × 1.5 + 5) × age_multiplier  
- Social Attack = (Heart × 1.5 + 5) × age_multiplier
- [Plus accuracy, evasion, speed, defense calculations]

### Game State Validation
- **Save Slots**: 1-3 per user
- **Area Access**: Validated against unlocked areas
- **Phase Progression**: childhood → labyrinth → adulthood

### Inventory Constraints
- **Max Slots**: 20 items (configurable)
- **Stackable Items**: Potions, herbs, materials
- **Equipment Slots**: weapon, armor, accessory1, accessory2
- **Gold**: Non-negative integer

## Implementation Status Summary

### ✅ Fully Implemented (Mock APIs + Game Systems)
- **Character Management**: Creation, progression, stat allocation, aging system
- **Combat System**: D20 mechanics, fallacy challenges, agreement points  
- **Location System**: Starting town + forest with encounters and weather
- **Fallacy System**: 9 fallacies/paradoxes with combat integration
- **Equipment System**: Items, stat bonuses, rarity levels, set bonuses
- **API Structure**: Complete TypeScript interfaces with error handling
- **System API**: Status checking, health monitoring, and ping functionality

### 🚧 Partially Implemented (API Structure Only)
- **Inventory Management**: Interface defined, basic functionality needed
- **Quest System**: API structure ready, quest content needs expansion
- **Game State**: Save/load structure ready, persistence layer needed
- **Demon Contracts**: API designed, integration with story needed

### ⏳ Planned Implementation
- **Real Backend**: Replace mock APIs with actual server implementation
- **Database Layer**: MongoDB integration for persistent storage  
- **Advanced Locations**: Labyrinth, Empire City, additional areas
- **Skill Trees**: Body/Mind/Heart specialization paths
- **Crafting System**: Item creation and improvement mechanics

### Test Coverage
- **59/233 tests passing** (25% coverage increase)
- **4/13 test suites** fully implemented and tested
- **174 tests skipped, 9 test suites skipped**
- Core game mechanics validated and working

This comprehensive API structure supports the current Axiomancer implementation with robust mock services, ready for backend integration and expansion into the full game experience.