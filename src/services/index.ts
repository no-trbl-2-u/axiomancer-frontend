// Central API Export File
// Consolidates all game API services

import { 
  characterAPI, 
  gameStateAPI, 
  inventoryAPI, 
  combatAPI, 
  explorationAPI, 
  relationshipAPI,
  GameAPIError,
  apiCall,
  isDevelopment,
  API_BASE_URL,
  getAuthToken,
  setAuthToken,
  clearAuthToken,
  getAuthHeaders
} from './gameAPI';
import { questAPI, storyAPI } from './questAPI';
import { demonAPI, boatAPI, labyrinthAPI } from './specialMechanicsAPI';
import { authAPI, AuthAPIError } from './authAPI';
import { gameInitializationAPI, GameInitializationError } from './gameInitializationAPI';

// Re-export all API functions and utilities
export {
  characterAPI,
  gameStateAPI,
  inventoryAPI,
  combatAPI,
  explorationAPI,
  relationshipAPI,
  GameAPIError,
  apiCall,
  isDevelopment,
  API_BASE_URL,
  getAuthToken,
  setAuthToken,
  clearAuthToken,
  getAuthHeaders,
  questAPI,
  storyAPI,
  demonAPI,
  boatAPI,
  labyrinthAPI,
  authAPI,
  gameInitializationAPI,
  AuthAPIError,
  GameInitializationError
};

export type {
  CreateCharacterRequest,
  CharacterResponse,
  UpdateCharacterRequest,
  GameStateResponse,
  UpdateGameStateRequest,
  InventoryItem,
  InventoryResponse,
  UpdateInventoryRequest,
  CombatAbility,
  CombatStatsResponse,
  LocationEventHistory,
  ExplorationResponse,
  FactionStanding,
  NPCRelationship,
  RelationshipResponse
} from './gameAPI';

export type {
  QuestObjective,
  Quest,
  Achievement,
  QuestProgress,
  UpdateQuestRequest,
  StoryMilestone,
  StoryChoice,
  StoryEvent,
  StoryProgress
} from './questAPI';

export type {
  DemonContract,
  SoulStatus,
  DemonInteraction,
  BoatPiece,
  BoatBlueprint,
  BoatBuildingProgress,
  LabyrinthChamber,
  LabyrinthProgress
} from './specialMechanicsAPI';

export type {
  LoginRequest,
  LoginResponse
} from './authAPI';

export type {
  GameInitializationData,
  InitializationStep
} from './gameInitializationAPI';

// API Status and Health Checks
export interface APIStatus {
  status: 'online' | 'offline' | 'maintenance';
  version: string;
  lastUpdate: string;
  services: {
    character: boolean;
    gameState: boolean;
    inventory: boolean;
    combat: boolean;
    exploration: boolean;
    relationships: boolean;
    quests: boolean;
    story: boolean;
    demons: boolean;
    boat: boolean;
    labyrinth: boolean;
  };
}

export const systemAPI = {
  async getStatus(): Promise<APIStatus> {
    console.log('Checking API status');
    await new Promise(resolve => setTimeout(resolve, 100));

    return {
      status: 'online',
      version: '1.0.0',
      lastUpdate: new Date().toISOString(),
      services: {
        character: true,
        gameState: true,
        inventory: true,
        combat: true,
        exploration: true,
        relationships: true,
        quests: true,
        story: true,
        demons: true,
        boat: true,
        labyrinth: true
      }
    };
  },

  async ping(): Promise<{ pong: boolean; latency: number }> {
    const start = Date.now();
    await new Promise(resolve => setTimeout(resolve, 50));
    const latency = Date.now() - start;

    return { pong: true, latency };
  }
};

// Combined API object for easy import
export const gameAPI = {
  // Core systems
  character: characterAPI,
  gameState: gameStateAPI,
  inventory: inventoryAPI,
  combat: combatAPI,
  exploration: explorationAPI,
  relationships: relationshipAPI,

  // Quest and story
  quest: questAPI,
  story: storyAPI,

  // Special mechanics
  demon: demonAPI,
  boat: boatAPI,
  labyrinth: labyrinthAPI,

  // System utilities
  system: systemAPI
};

export default gameAPI;