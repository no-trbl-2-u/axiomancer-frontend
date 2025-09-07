// Game Initialization Service
// Loads all necessary game data after successful login

import { 
  characterAPI, 
  gameStateAPI, 
  inventoryAPI, 
  explorationAPI, 
  combatAPI,
  relationshipAPI 
} from './gameAPI';
import { questAPI, storyAPI } from './questAPI';
import { demonAPI, boatAPI, labyrinthAPI } from './specialMechanicsAPI';
import { authAPI } from './authAPI';

export interface GameInitializationData {
  character: any;
  gameState: any;
  inventory: any;
  exploration: any;
  combat: any;
  relationships: any;
  quests: any;
  story: any;
  specialMechanics: {
    demons: any;
    boat: any;
    labyrinth: any;
  };
}

export interface InitializationStep {
  name: string;
  description: string;
  completed: boolean;
  error?: string;
}

export class GameInitializationError extends Error {
  constructor(message: string, public step: string) {
    super(message);
    this.name = 'GameInitializationError';
  }
}

export const gameInitializationAPI = {
  async initializeGame(onProgress?: (steps: InitializationStep[]) => void): Promise<GameInitializationData> {
    const uid = authAPI.getCurrentUID();
    if (!uid) {
      throw new GameInitializationError('No authenticated user found', 'authentication');
    }

    const steps: InitializationStep[] = [
      { name: 'character', description: 'Loading character data...', completed: false },
      { name: 'gameState', description: 'Loading game state...', completed: false },
      { name: 'inventory', description: 'Loading inventory and equipment...', completed: false },
      { name: 'exploration', description: 'Loading world map and locations...', completed: false },
      { name: 'combat', description: 'Loading combat statistics...', completed: false },
      { name: 'relationships', description: 'Loading faction relationships...', completed: false },
      { name: 'quests', description: 'Loading quest progress...', completed: false },
      { name: 'story', description: 'Loading story milestones...', completed: false },
      { name: 'demons', description: 'Loading demon contracts...', completed: false },
      { name: 'boat', description: 'Loading boat building progress...', completed: false },
      { name: 'labyrinth', description: 'Loading labyrinth progress...', completed: false },
    ];

    // Report initial progress
    if (onProgress) onProgress([...steps]);

    const gameData: Partial<GameInitializationData> = {};

    try {
      // Step 1: Load character data
      try {
        const characterResponse = await characterAPI.get(uid);
        gameData.character = characterResponse;
        steps[0].completed = true;
        if (onProgress) onProgress([...steps]);
      } catch (error) {
        steps[0].error = error instanceof Error ? error.message : 'Failed to load character';
        if (onProgress) onProgress([...steps]);
        throw new GameInitializationError('Failed to load character data', 'character');
      }

      // Step 2: Load game state
      try {
        const gameStateResponse = await gameStateAPI.get(uid);
        gameData.gameState = gameStateResponse;
        steps[1].completed = true;
        if (onProgress) onProgress([...steps]);
      } catch (error) {
        steps[1].error = error instanceof Error ? error.message : 'Failed to load game state';
        if (onProgress) onProgress([...steps]);
        throw new GameInitializationError('Failed to load game state', 'gameState');
      }

      // Step 3: Load inventory
      try {
        const inventoryResponse = await inventoryAPI.get(uid);
        gameData.inventory = inventoryResponse;
        steps[2].completed = true;
        if (onProgress) onProgress([...steps]);
      } catch (error) {
        steps[2].error = error instanceof Error ? error.message : 'Failed to load inventory';
        if (onProgress) onProgress([...steps]);
        throw new GameInitializationError('Failed to load inventory', 'inventory');
      }

      // Step 4: Load exploration data
      try {
        const explorationResponse = await explorationAPI.getProgress(uid);
        gameData.exploration = explorationResponse;
        steps[3].completed = true;
        if (onProgress) onProgress([...steps]);
      } catch (error) {
        steps[3].error = error instanceof Error ? error.message : 'Failed to load exploration';
        if (onProgress) onProgress([...steps]);
        throw new GameInitializationError('Failed to load exploration data', 'exploration');
      }

      // Step 5: Load combat stats
      try {
        const combatResponse = await combatAPI.getStats(uid);
        gameData.combat = combatResponse;
        steps[4].completed = true;
        if (onProgress) onProgress([...steps]);
      } catch (error) {
        steps[4].error = error instanceof Error ? error.message : 'Failed to load combat stats';
        if (onProgress) onProgress([...steps]);
        throw new GameInitializationError('Failed to load combat statistics', 'combat');
      }

      // Step 6: Load relationships
      try {
        const relationshipsResponse = await relationshipAPI.get(uid);
        gameData.relationships = relationshipsResponse;
        steps[5].completed = true;
        if (onProgress) onProgress([...steps]);
      } catch (error) {
        steps[5].error = error instanceof Error ? error.message : 'Failed to load relationships';
        if (onProgress) onProgress([...steps]);
        throw new GameInitializationError('Failed to load relationships', 'relationships');
      }

      // Step 7: Load quests (use character ID if available)
      try {
        const characterId = gameData.character?.id || uid;
        const questsResponse = await questAPI.getProgress(characterId);
        gameData.quests = questsResponse;
        steps[6].completed = true;
        if (onProgress) onProgress([...steps]);
      } catch (error) {
        steps[6].error = error instanceof Error ? error.message : 'Failed to load quests';
        if (onProgress) onProgress([...steps]);
        throw new GameInitializationError('Failed to load quest data', 'quests');
      }

      // Step 8: Load story progress
      try {
        const characterId = gameData.character?.id || uid;
        const storyResponse = await storyAPI.getProgress(characterId);
        gameData.story = storyResponse;
        steps[7].completed = true;
        if (onProgress) onProgress([...steps]);
      } catch (error) {
        steps[7].error = error instanceof Error ? error.message : 'Failed to load story';
        if (onProgress) onProgress([...steps]);
        throw new GameInitializationError('Failed to load story progress', 'story');
      }

      // Step 9: Load demon contracts
      try {
        const characterId = gameData.character?.id || uid;
        const demonsResponse = await demonAPI.getSoulStatus(characterId);
        gameData.specialMechanics = { demons: demonsResponse } as any;
        steps[8].completed = true;
        if (onProgress) onProgress([...steps]);
      } catch (error) {
        steps[8].error = error instanceof Error ? error.message : 'Failed to load demon contracts';
        if (onProgress) onProgress([...steps]);
        throw new GameInitializationError('Failed to load demon contracts', 'demons');
      }

      // Step 10: Load boat progress
      try {
        const characterId = gameData.character?.id || uid;
        const boatResponse = await boatAPI.getProgress(characterId);
        gameData.specialMechanics!.boat = boatResponse;
        steps[9].completed = true;
        if (onProgress) onProgress([...steps]);
      } catch (error) {
        steps[9].error = error instanceof Error ? error.message : 'Failed to load boat progress';
        if (onProgress) onProgress([...steps]);
        throw new GameInitializationError('Failed to load boat progress', 'boat');
      }

      // Step 11: Load labyrinth progress
      try {
        const characterId = gameData.character?.id || uid;
        const labyrinthResponse = await labyrinthAPI.getProgress(characterId);
        gameData.specialMechanics!.labyrinth = labyrinthResponse;
        steps[10].completed = true;
        if (onProgress) onProgress([...steps]);
      } catch (error) {
        steps[10].error = error instanceof Error ? error.message : 'Failed to load labyrinth progress';
        if (onProgress) onProgress([...steps]);
        throw new GameInitializationError('Failed to load labyrinth progress', 'labyrinth');
      }

      return gameData as GameInitializationData;

    } catch (error) {
      // Report final error state
      if (onProgress) onProgress([...steps]);
      
      if (error instanceof GameInitializationError) {
        throw error;
      }
      
      throw new GameInitializationError(
        error instanceof Error ? error.message : 'Unknown initialization error',
        'unknown'
      );
    }
  },

  async quickInitialize(): Promise<GameInitializationData> {
    // For development/testing - loads minimal data quickly
    return this.initializeGame();
  }
};

export default gameInitializationAPI;