// Game API Service Layer
// Mock implementation for backend endpoints based on Backend_Roadmap.md

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
  portrait: string;
  level: number;
  experience: number;
  experienceToNext: number;
  age: number;
  currentHp: number;
  maxHp: number;
  currentMp: number;
  maxMp: number;
  stats: {
    body: number;
    mind: number;
    heart: number;
  };
  detailedStats?: {
    physicalAtk: number;
    physicalDef: number;
    accuracy: number;
    critDamage: number;
    constitution: number;
    mentalAtk: number;
    mentalDef: number;
    evasion: number;
    perception: number;
    reflexSave: number;
    charisma: number;
    ailmentAtk: number;
    criticalRate: number;
    willpower: number;
    empathy: number;
    luck: number;
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
    console.log('Creating character:', data);

    // Get current user UID from sessionStorage
    const uid = sessionStorage.getItem('currentUID');
    console.log('UID from sessionStorage:', uid);
    console.log('All sessionStorage items:', {
      authToken: sessionStorage.getItem('authToken'),
      currentUID: sessionStorage.getItem('currentUID'),
      username: sessionStorage.getItem('username')
    });

    if (!uid) {
      console.error('ERROR: No UID found in sessionStorage!');
      console.error('Available sessionStorage keys:', Object.keys(sessionStorage));
      throw new GameAPIError('No user authenticated - UID not found in session', 401);
    }

    try {
      const requestBody = {
        ...data,
        uid
      };
      console.log('Request body being sent:', requestBody);
      console.log('Request body JSON:', JSON.stringify(requestBody));

      const response = await fetch(`${API_BASE_URL}/create-character`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();


      if (!response.ok) {
        throw new GameAPIError(result.message || 'Character creation failed', response.status);
      }

      return result;
    } catch (error) {
      if (error instanceof GameAPIError) {
        throw error;
      }

      throw new GameAPIError(
        `Character creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        500
      );
    }
  },

  async get(characterId: string): Promise<CharacterResponse> {
    console.log('Getting character:', characterId);

    try {
      const response = await fetch(`${API_BASE_URL}/character/${characterId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new GameAPIError(result.message || 'Character not found', response.status);
      }

      return result;
    } catch (error) {
      if (error instanceof GameAPIError) {
        throw error;
      }

      throw new GameAPIError(
        `Failed to get character: ${error instanceof Error ? error.message : 'Unknown error'}`,
        500
      );
    }
  },

  async update(data: UpdateCharacterRequest): Promise<CharacterResponse> {
    console.log('Updating character:', data);

    try {
      const response = await fetch(`${API_BASE_URL}/update-character`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new GameAPIError(result.message || 'Character update failed', response.status);
      }

      return result;
    } catch (error) {
      if (error instanceof GameAPIError) {
        throw error;
      }

      throw new GameAPIError(
        `Failed to update character: ${error instanceof Error ? error.message : 'Unknown error'}`,
        500
      );
    }
  },

  async delete(characterId: string): Promise<void> {
    console.log('Deleting character:', characterId);

    try {
      const response = await fetch(`${API_BASE_URL}/delete-character`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        body: JSON.stringify({ uid: characterId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new GameAPIError(result.message || 'Character deletion failed', response.status);
      }
    } catch (error) {
      if (error instanceof GameAPIError) {
        throw error;
      }

      throw new GameAPIError(
        `Failed to delete character: ${error instanceof Error ? error.message : 'Unknown error'}`,
        500
      );
    }
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

    try {
      const response = await fetch(`${API_BASE_URL}/get-game-state?uid=${characterId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new GameAPIError(result.message || 'Failed to get game state', response.status);
      }

      return result;
    } catch (error) {
      if (error instanceof GameAPIError) {
        throw error;
      }

      // Return default state if no game state exists yet
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
    }
  },

  async update(data: UpdateGameStateRequest): Promise<GameStateResponse> {
    console.log('Updating game state:', data);

    try {
      const response = await fetch(`${API_BASE_URL}/update-game-state`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new GameAPIError(result.message || 'Failed to update game state', response.status);
      }

      return result;
    } catch (error) {
      if (error instanceof GameAPIError) {
        throw error;
      }

      throw new GameAPIError(
        `Failed to update game state: ${error instanceof Error ? error.message : 'Unknown error'}`,
        500
      );
    }
  },

  async save(characterId: string, slot: number = 1): Promise<void> {
    console.log('Saving game for character:', characterId, 'slot:', slot);

    try {
      const response = await fetch(`${API_BASE_URL}/save-game`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ uid: characterId, slot }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new GameAPIError(result.message || 'Failed to save game', response.status);
      }
    } catch (error) {
      if (error instanceof GameAPIError) {
        throw error;
      }

      throw new GameAPIError(
        `Failed to save game: ${error instanceof Error ? error.message : 'Unknown error'}`,
        500
      );
    }
  },

  async load(characterId: string, slot: number = 1): Promise<GameStateResponse> {
    console.log('Loading game for character:', characterId, 'slot:', slot);

    try {
      const response = await fetch(`${API_BASE_URL}/load-game`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ uid: characterId, slot }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new GameAPIError(result.message || 'Failed to load game', response.status);
      }

      return result;
    } catch (error) {
      if (error instanceof GameAPIError) {
        throw error;
      }

      throw new GameAPIError(
        `Failed to load game: ${error instanceof Error ? error.message : 'Unknown error'}`,
        500
      );
    }
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

    try {
      const response = await fetch(`${API_BASE_URL}/get-inventory?uid=${characterId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new GameAPIError(result.message || 'Failed to get inventory', response.status);
      }

      return result;
    } catch (error) {
      if (error instanceof GameAPIError) {
        throw error;
      }

      // Return default empty inventory if none exists yet
      return {
        characterId,
        items: [],
        equipment: {
          accessories: []
        },
        maxCapacity: 50
      };
    }
  },

  async update(data: UpdateInventoryRequest): Promise<InventoryResponse> {
    console.log('Updating inventory:', data);

    try {
      let endpoint = '';
      let requestData: any = { uid: data.characterId };

      switch (data.action) {
        case 'add':
          endpoint = '/add-item';
          requestData = { uid: data.characterId, itemId: data.itemId, quantity: data.quantity || 1 };
          break;
        case 'remove':
          endpoint = '/remove-item';
          requestData = { uid: data.characterId, itemId: data.itemId, quantity: data.quantity || 1 };
          break;
        case 'equip':
          endpoint = '/equip-item';
          requestData = { uid: data.characterId, itemId: data.itemId, slot: data.slot };
          break;
        case 'unequip':
          endpoint = '/unequip-item';
          requestData = { uid: data.characterId, itemId: data.itemId, slot: data.slot };
          break;
        default:
          throw new GameAPIError(`Invalid inventory action: ${data.action}`, 400);
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new GameAPIError(result.message || 'Failed to update inventory', response.status);
      }

      // Return updated inventory
      return await this.get(data.characterId);
    } catch (error) {
      if (error instanceof GameAPIError) {
        throw error;
      }

      throw new GameAPIError(
        `Failed to update inventory: ${error instanceof Error ? error.message : 'Unknown error'}`,
        500
      );
    }
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

    try {
      const response = await fetch(`${API_BASE_URL}/combat-statistics?uid=${characterId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new GameAPIError(result.message || 'Failed to get combat stats', response.status);
      }

      return result;
    } catch (error) {
      if (error instanceof GameAPIError) {
        throw error;
      }

      // Return default stats if none exist yet
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
    }
  },

  async updateFallacyKnowledge(characterId: string, fallacyId: string, correct: boolean): Promise<PlayerKnowledge> {
    console.log('Updating fallacy knowledge:', { characterId, fallacyId, correct });

    try {
      const response = await fetch(`${API_BASE_URL}/fallacy-challenge`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          uid: characterId,
          fallacyId,
          correct
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new GameAPIError(result.message || 'Failed to update fallacy knowledge', response.status);
      }

      return result.fallacyKnowledge || result;
    } catch (error) {
      if (error instanceof GameAPIError) {
        throw error;
      }

      throw new GameAPIError(
        `Failed to update fallacy knowledge: ${error instanceof Error ? error.message : 'Unknown error'}`,
        500
      );
    }
  },

  async recordCombatResult(characterId: string, result: 'win' | 'loss' | 'agreement'): Promise<void> {
    console.log('Recording combat result:', { characterId, result });

    try {
      const response = await fetch(`${API_BASE_URL}/combat-action`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          uid: characterId,
          action: 'record_result',
          result
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new GameAPIError(responseData.message || 'Failed to record combat result', response.status);
      }
    } catch (error) {
      if (error instanceof GameAPIError) {
        throw error;
      }

      throw new GameAPIError(
        `Failed to record combat result: ${error instanceof Error ? error.message : 'Unknown error'}`,
        500
      );
    }
  },

  async initiateCombat(characterId: string, opponent?: string): Promise<any> {
    console.log('Initiating combat for:', characterId, 'opponent:', opponent);

    try {
      const response = await fetch(`${API_BASE_URL}/initiate-combat`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          uid: characterId,
          opponent
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new GameAPIError(result.message || 'Failed to initiate combat', response.status);
      }

      return result;
    } catch (error) {
      if (error instanceof GameAPIError) {
        throw error;
      }

      throw new GameAPIError(
        `Failed to initiate combat: ${error instanceof Error ? error.message : 'Unknown error'}`,
        500
      );
    }
  },

  async getAvailableSpecialAttacks(characterId: string): Promise<CombatAbility[]> {
    console.log('Getting available special attacks for:', characterId);

    try {
      const response = await fetch(`${API_BASE_URL}/available-special-attacks?uid=${characterId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new GameAPIError(result.message || 'Failed to get special attacks', response.status);
      }

      return result.abilities || result;
    } catch (error) {
      if (error instanceof GameAPIError) {
        throw error;
      }

      // Return empty array if none available
      return [];
    }
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

    try {
      const response = await fetch(`${API_BASE_URL}/get-available-areas?uid=${characterId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new GameAPIError(result.message || 'Failed to get exploration progress', response.status);
      }

      return result;
    } catch (error) {
      if (error instanceof GameAPIError) {
        throw error;
      }

      // Return default exploration data if none exists yet
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
    }
  },

  async getCurrentLocation(characterId: string): Promise<any> {
    console.log('Getting current location for:', characterId);

    try {
      const response = await fetch(`${API_BASE_URL}/get-location?uid=${characterId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new GameAPIError(result.message || 'Failed to get current location', response.status);
      }

      return result;
    } catch (error) {
      if (error instanceof GameAPIError) {
        throw error;
      }

      throw new GameAPIError(
        `Failed to get current location: ${error instanceof Error ? error.message : 'Unknown error'}`,
        500
      );
    }
  },

  async moveToLocation(characterId: string, locationId: string): Promise<void> {
    console.log('Moving to location:', { characterId, locationId });

    try {
      const response = await fetch(`${API_BASE_URL}/move-to-location`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          uid: characterId,
          locationId
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new GameAPIError(result.message || 'Failed to move to location', response.status);
      }
    } catch (error) {
      if (error instanceof GameAPIError) {
        throw error;
      }

      throw new GameAPIError(
        `Failed to move to location: ${error instanceof Error ? error.message : 'Unknown error'}`,
        500
      );
    }
  },

  async recordLocationEvent(characterId: string, locationId: string, eventId: string): Promise<void> {
    console.log('Recording location event:', { characterId, locationId, eventId });

    // For now, this doesn't have a direct backend endpoint, so we'll use moveToLocation
    // In a full implementation, this would be a separate endpoint
    try {
      await this.moveToLocation(characterId, locationId);
    } catch (error) {
      console.warn('Failed to record location event:', error);
    }
  },

  async unlockArea(characterId: string, areaId: string): Promise<void> {
    console.log('Unlocking area:', { characterId, areaId });

    // This would typically be handled by the game state or story progression system
    // For now, we'll just log it since there's no specific unlock endpoint
    try {
      await this.moveToLocation(characterId, areaId);
    } catch (error) {
      console.warn('Failed to unlock area:', error);
    }
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
export const getAPIBaseURL = () => {
  // For now, these are the two possible environments. In the future, we'll have a STAGING environment
  switch (process.env.NODE_ENV) {
    case 'development':
      return process.env.REACT_APP_API_URL_DEV;
    case 'production':
      return process.env.REACT_APP_API_URL_PROD;
    // Default to development environment
    default:
      return process.env.REACT_APP_API_URL_DEV;
  }
}

// Base API URL - would come from environment variables
export const API_BASE_URL = getAPIBaseURL();

// Auth token management for API calls
export function getAuthToken(): string | null {
  return sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
}

export function setAuthToken(token: string): void {
  sessionStorage.setItem('authToken', token);
  localStorage.setItem('authToken', token);
}

export function clearAuthToken(): void {
  sessionStorage.removeItem('authToken');
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