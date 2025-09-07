// Game API Service Layer
// Mock implementation for backend endpoints based on Backend_Roadmap.md

import { Character } from '../systems/CharacterProgression';
import { CharacterLocation } from '../systems/LocationSystem';
import { PlayerKnowledge } from '../systems/FallacyParadoxSystem';

// ===== CHARACTER MANAGEMENT API =====

export interface CreateCharacterRequest {
  name: string;
  portrait: string;
  age: number;
}

export interface CharacterResponse {
  id: string;
  name: string;
  level: number;
  experience: number;
  experienceToNext: number;
  age: number;
  stats: {
    body: number;
    mind: number;
    heart: number;
    health: number;
    mana: number;
  };
  detailedStats: {
    physicalAttack: number;
    physicalDefense: number;
    accuracy: number;
    speed: number;
    mentalAttack: number;
    mentalDefense: number;
    evasion: number;
    perception: number;
    socialAttack: number;
    socialDefense: number;
    ailmentAttack: number;
    ailmentDefense: number;
  };
  availableStatPoints: number;
  skillPoints: number;
  currentLocation: string;
  unlockedLocations: string[];
}

export interface UpdateCharacterRequest {
  characterId: string;
  updates: Partial<CharacterResponse>;
}

// Character API calls
export const characterAPI = {
  async create(data: CreateCharacterRequest): Promise<CharacterResponse> {
    // Mock implementation - would call backend
    console.log('Creating character:', data);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    
    // This would normally call the backend
    const character: CharacterResponse = {
      id: `char-${Date.now()}`,
      name: data.name,
      level: 1,
      experience: 0,
      experienceToNext: 150,
      age: data.age,
      stats: {
        body: 8,
        mind: 6,
        heart: 5,
        health: 50,
        mana: 25
      },
      detailedStats: {
        physicalAttack: 17,
        physicalDefense: 13,
        accuracy: 14,
        speed: 13,
        mentalAttack: 14,
        mentalDefense: 10,
        evasion: 10,
        perception: 12,
        socialAttack: 13,
        socialDefense: 9,
        ailmentAttack: 9,
        ailmentDefense: 9
      },
      availableStatPoints: 0,
      skillPoints: 0,
      currentLocation: 'starting_town',
      unlockedLocations: ['starting_town']
    };
    
    return character;
  },

  async get(characterId: string): Promise<CharacterResponse> {
    console.log('Getting character:', characterId);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock character data - would come from backend
    throw new Error('Character not found'); // Simulate not found for now
  },

  async update(data: UpdateCharacterRequest): Promise<CharacterResponse> {
    console.log('Updating character:', data);
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Mock update - would merge with backend data
    return data.updates as CharacterResponse;
  },

  async delete(characterId: string): Promise<void> {
    console.log('Deleting character:', characterId);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock deletion
  }
};

// ===== GAME STATE MANAGEMENT API =====

export interface GameStateResponse {
  characterId: string;
  currentLocation: string;
  unlockedLocations: string[];
  gamePhase: 'childhood' | 'adulthood' | 'labyrinth';
  storyProgress: Record<string, boolean>;
  visitHistory: Record<string, boolean>;
  saveSlot: number;
  lastSaved: string;
}

export interface UpdateGameStateRequest {
  characterId: string;
  updates: Partial<GameStateResponse>;
}

export const gameStateAPI = {
  async get(characterId: string): Promise<GameStateResponse> {
    console.log('Getting game state for:', characterId);
    await new Promise(resolve => setTimeout(resolve, 250));
    
    return {
      characterId,
      currentLocation: 'starting_town',
      unlockedLocations: ['starting_town'],
      gamePhase: 'childhood',
      storyProgress: {},
      visitHistory: { starting_town: true },
      saveSlot: 1,
      lastSaved: new Date().toISOString()
    };
  },

  async update(data: UpdateGameStateRequest): Promise<GameStateResponse> {
    console.log('Updating game state:', data);
    await new Promise(resolve => setTimeout(resolve, 350));
    
    // Mock update
    return data.updates as GameStateResponse;
  },

  async save(characterId: string, slot: number = 1): Promise<void> {
    console.log('Saving game for character:', characterId, 'slot:', slot);
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Mock save operation
  },

  async load(characterId: string, slot: number = 1): Promise<GameStateResponse> {
    console.log('Loading game for character:', characterId, 'slot:', slot);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock load - would return saved state
    throw new Error('Save slot not found');
  }
};

// ===== INVENTORY AND EQUIPMENT API =====

export interface InventoryItem {
  id: string;
  itemId: string;
  quantity: number;
  acquired: string;
}

export interface InventoryResponse {
  characterId: string;
  items: InventoryItem[];
  equipment: {
    weapon?: string;
    armor?: string;
    accessories: string[];
  };
  maxCapacity: number;
}

export interface UpdateInventoryRequest {
  characterId: string;
  action: 'add' | 'remove' | 'equip' | 'unequip';
  itemId: string;
  quantity?: number;
  slot?: 'weapon' | 'armor' | 'accessory';
}

export const inventoryAPI = {
  async get(characterId: string): Promise<InventoryResponse> {
    console.log('Getting inventory for:', characterId);
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return {
      characterId,
      items: [],
      equipment: {
        accessories: []
      },
      maxCapacity: 50
    };
  },

  async update(data: UpdateInventoryRequest): Promise<InventoryResponse> {
    console.log('Updating inventory:', data);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock inventory update
    return {
      characterId: data.characterId,
      items: [],
      equipment: { accessories: [] },
      maxCapacity: 50
    };
  }
};

// ===== COMBAT DATA API =====

export interface CombatAbility {
  id: string;
  name: string;
  type: 'Body' | 'Mind' | 'Heart';
  manaCost: number;
  unlocked: boolean;
}

export interface CombatStatsResponse {
  characterId: string;
  unlockedAbilities: CombatAbility[];
  fallacyKnowledge: PlayerKnowledge;
  combatWins: number;
  combatLosses: number;
  agreementResolutions: number;
  demonContracts: string[];
}

export const combatAPI = {
  async getStats(characterId: string): Promise<CombatStatsResponse> {
    console.log('Getting combat stats for:', characterId);
    await new Promise(resolve => setTimeout(resolve, 250));
    
    return {
      characterId,
      unlockedAbilities: [],
      fallacyKnowledge: {
        knownFallacies: ['ad_hominem', 'straw_man', 'zenos_paradox'],
        masteredFallacies: [],
        fallacyExperience: {
          'ad_hominem': 0,
          'straw_man': 0,
          'zenos_paradox': 0
        }
      },
      combatWins: 0,
      combatLosses: 0,
      agreementResolutions: 0,
      demonContracts: []
    };
  },

  async updateFallacyKnowledge(characterId: string, fallacyId: string, correct: boolean): Promise<PlayerKnowledge> {
    console.log('Updating fallacy knowledge:', { characterId, fallacyId, correct });
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Mock fallacy knowledge update
    return {
      knownFallacies: ['ad_hominem', 'straw_man', 'zenos_paradox'],
      masteredFallacies: [],
      fallacyExperience: { 'ad_hominem': 1, 'straw_man': 0, 'zenos_paradox': 0 }
    };
  },

  async recordCombatResult(characterId: string, result: 'win' | 'loss' | 'agreement'): Promise<void> {
    console.log('Recording combat result:', { characterId, result });
    await new Promise(resolve => setTimeout(resolve, 150));
    
    // Mock combat result recording
  }
};

// ===== EXPLORATION AND LOCATION API =====

export interface LocationEventHistory {
  locationId: string;
  eventsTriggered: string[];
  resourcesGathered: Record<string, number>;
  npcsEncountered: string[];
  lastVisited: string;
}

export interface ExplorationResponse {
  characterId: string;
  locationHistory: LocationEventHistory[];
  unlockedAreas: string[];
  explorationXP: number;
}

export const explorationAPI = {
  async getProgress(characterId: string): Promise<ExplorationResponse> {
    console.log('Getting exploration progress for:', characterId);
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return {
      characterId,
      locationHistory: [{
        locationId: 'starting_town',
        eventsTriggered: [],
        resourcesGathered: {},
        npcsEncountered: ['village_elder', 'tavern_keeper'],
        lastVisited: new Date().toISOString()
      }],
      unlockedAreas: ['starting_town'],
      explorationXP: 0
    };
  },

  async recordLocationEvent(characterId: string, locationId: string, eventId: string): Promise<void> {
    console.log('Recording location event:', { characterId, locationId, eventId });
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Mock event recording
  },

  async unlockArea(characterId: string, areaId: string): Promise<void> {
    console.log('Unlocking area:', { characterId, areaId });
    await new Promise(resolve => setTimeout(resolve, 150));
    
    // Mock area unlock
  }
};

// ===== FACTION AND RELATIONSHIP API =====

export interface FactionStanding {
  factionId: string;
  reputation: number;
  relationship: 'enemy' | 'hostile' | 'neutral' | 'friendly' | 'allied';
}

export interface NPCRelationship {
  npcId: string;
  relationshipValue: number;
  status: 'enemy' | 'stranger' | 'acquaintance' | 'friend' | 'ally';
  lastInteraction: string;
}

export interface RelationshipResponse {
  characterId: string;
  factionStandings: FactionStanding[];
  npcRelationships: NPCRelationship[];
  moralAlignment: { law: number; chaos: number; good: number; evil: number };
}

export const relationshipAPI = {
  async get(characterId: string): Promise<RelationshipResponse> {
    console.log('Getting relationships for:', characterId);
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return {
      characterId,
      factionStandings: [],
      npcRelationships: [],
      moralAlignment: { law: 0, chaos: 0, good: 0, evil: 0 }
    };
  },

  async updateFactionStanding(characterId: string, factionId: string, change: number): Promise<void> {
    console.log('Updating faction standing:', { characterId, factionId, change });
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Mock faction update
  },

  async updateNPCRelationship(characterId: string, npcId: string, change: number): Promise<void> {
    console.log('Updating NPC relationship:', { characterId, npcId, change });
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Mock NPC relationship update
  }
};

// ===== ERROR HANDLING =====

export class GameAPIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'GameAPIError';
  }
}

// Generic API call wrapper with error handling
export async function apiCall<T>(
  apiFunction: () => Promise<T>,
  errorMessage: string = 'API call failed'
): Promise<T> {
  try {
    return await apiFunction();
  } catch (error) {
    console.error(`${errorMessage}:`, error);
    
    if (error instanceof GameAPIError) {
      throw error;
    }
    
    // Wrap unknown errors
    throw new GameAPIError(
      `${errorMessage}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      500,
      'UNKNOWN_ERROR'
    );
  }
}

// ===== UTILITY FUNCTIONS =====

// Check if we're in development mode for mock behavior
export const isDevelopment = process.env.NODE_ENV === 'development';

// Base API URL - would come from environment variables
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Auth token management for API calls
export function getAuthToken(): string | null {
  return localStorage.getItem('authToken');
}

export function setAuthToken(token: string): void {
  localStorage.setItem('authToken', token);
}

export function clearAuthToken(): void {
  localStorage.removeItem('authToken');
}

// Add auth headers to requests
export function getAuthHeaders(): Record<string, string> {
  const token = getAuthToken();
  
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
}