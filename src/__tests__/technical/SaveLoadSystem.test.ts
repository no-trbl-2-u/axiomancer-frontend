/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, it } from '@jest/globals';

// Mock interfaces for save/load system
interface GameSave {
  id: string;
  name: string;
  timestamp: number;
  version: string;
  character: SavedCharacter;
  world: SavedWorldState;
  progress: SavedProgress;
  settings: SavedSettings;
  metadata: SaveMetadata;
}

interface SavedCharacter {
  basicInfo: {
    name: string;
    age: number;
    level: number;
    experience: number;
    currentLocation: string;
  };
  stats: {
    body: number;
    mind: number;
    heart: number;
    wisdom: number;
    health: number;
    maxHealth: number;
    mana: number;
    maxMana: number;
  };
  detailedStats: {
    physicalAttack: number;
    physicalDefense: number;
    mentalAttack: number;
    mentalDefense: number;
    socialAttack: number;
    socialDefense: number;
    speed: number;
    evasion: number;
    accuracy: number;
  };
  inventory: SavedInventory;
  equipment: SavedEquipment;
  knowledge: SavedKnowledge;
  relationships: SavedRelationships;
  moralAlignment: MoralAlignment;
  mentalState: MentalState;
}

interface SavedInventory {
  items: SavedItem[];
  gold: number;
  capacity: number;
  weight: number;
}

interface SavedItem {
  id: string;
  quantity: number;
  durability?: number;
  customProperties?: { [key: string]: any };
}

interface SavedEquipment {
  weapon?: SavedItem;
  armor?: SavedItem;
  accessories: SavedItem[];
}

interface SavedKnowledge {
  knownFallacies: string[];
  knownParadoxes: string[];
  learnedSkills: string[];
  discoveries: string[];
  loreEntries: string[];
}

interface SavedRelationships {
  npcRelationships: { [npcId: string]: number };
  factionReputation: { [factionId: string]: number };
  romanticInterests: string[];
  enemies: string[];
  allies: string[];
}

interface MoralAlignment {
  good: number;
  evil: number;
  lawful: number;
  chaotic: number;
}

interface MentalState {
  sanity: number;
  determination: number;
  homesickness: number;
  stress: number;
  confidence: number;
}

interface SavedWorldState {
  currentTime: number;
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  weather: string;
  globalEvents: SavedEvent[];
  locationStates: { [locationId: string]: LocationState };
  npcStates: { [npcId: string]: NPCState };
  economicState: EconomicState;
  politicalState: PoliticalState;
}

interface SavedEvent {
  id: string;
  status: 'active' | 'completed' | 'failed' | 'expired';
  startTime: number;
  endTime?: number;
  effects: { [key: string]: any };
}

interface LocationState {
  visited: boolean;
  discoveryLevel: number;
  availableResources: string[];
  currentEvents: string[];
  safetyLevel: number;
  lastVisited?: number;
}

interface NPCState {
  currentLocation: string;
  mood: string;
  availability: boolean;
  questsOffered: string[];
  relationship: number;
  lastInteraction?: number;
  personalHistory: string[];
}

interface EconomicState {
  globalInflation: number;
  resourcePrices: { [resource: string]: number };
  tradeRoutes: string[];
  marketTrends: { [market: string]: 'rising' | 'falling' | 'stable' };
}

interface PoliticalState {
  factionInfluence: { [factionId: string]: number };
  activeConflicts: string[];
  rulerStatus: string;
  stability: number;
  recentEvents: string[];
}

interface SavedProgress {
  mainQuests: SavedQuest[];
  sideQuests: SavedQuest[];
  completedQuests: string[];
  failedQuests: string[];
  achievements: SavedAchievement[];
  statistics: GameStatistics;
  milestones: SavedMilestone[];
}

interface SavedQuest {
  id: string;
  status: 'active' | 'completed' | 'failed' | 'available';
  objectives: SavedObjective[];
  startTime: number;
  completionTime?: number;
  choicesMade: string[];
}

interface SavedObjective {
  id: string;
  completed: boolean;
  progress: number;
  maxProgress: number;
}

interface SavedAchievement {
  id: string;
  unlockedTime: number;
  progress: number;
  completed: boolean;
}

interface GameStatistics {
  playtime: number;
  combatsWon: number;
  combatsLost: number;
  questsCompleted: number;
  fallaciesUsed: number;
  paradoxesMastered: number;
  npcsMetCount: number;
  locationsVisited: number;
  goldEarned: number;
  goldSpent: number;
  itemsCrafted: number;
  booksRead: number;
  philosophicalDebatesWon: number;
}

interface SavedMilestone {
  id: string;
  name: string;
  description: string;
  achievedTime: number;
  significance: 'minor' | 'major' | 'epic';
}

interface SavedSettings {
  difficulty: 'easy' | 'normal' | 'hard' | 'nightmare';
  audioSettings: AudioSettings;
  displaySettings: DisplaySettings;
  gameplaySettings: GameplaySettings;
  accessibilitySettings: AccessibilitySettings;
}

interface AudioSettings {
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  voiceVolume: number;
  muted: boolean;
}

interface DisplaySettings {
  resolution: string;
  fullscreen: boolean;
  brightness: number;
  contrast: number;
  colorblindSupport: boolean;
}

interface GameplaySettings {
  autoSave: boolean;
  autoSaveInterval: number;
  combatSpeed: number;
  textSpeed: number;
  showTutorials: boolean;
  skipAnimations: boolean;
}

interface AccessibilitySettings {
  fontSize: number;
  highContrast: boolean;
  screenReader: boolean;
  subtitles: boolean;
  colorblindMode: string;
}

interface SaveMetadata {
  saveType: 'manual' | 'auto' | 'checkpoint';
  gameVersion: string;
  platform: string;
  playSession: number;
  totalPlaytime: number;
  screenshot?: string; // Base64 encoded screenshot
  notes?: string;
}

interface SaveValidation {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  migrationRequired: boolean;
}

interface ValidationError {
  field: string;
  message: string;
  severity: 'critical' | 'major' | 'minor';
}

interface ValidationWarning {
  field: string;
  message: string;
  canContinue: boolean;
}

describe('Save/Load System', () => {
  describe('Save Game Creation', () => {
    it.skip('should create comprehensive save files with all game state', () => {
      const _character = {
        name: 'Test Hero',
        age: 25,
        level: 10,
        currentLocation: 'empire_city',
        stats: { body: 15, mind: 20, heart: 18, wisdom: 22 },
        inventory: { items: [], gold: 500 },
        knownFallacies: ['ad_hominem', 'straw_man'],
        factionReputation: { philosophers_guild: 75 }
      };

      const _worldState = {
        currentTime: Date.now(),
        season: 'autumn' as const,
        globalEvents: [],
        politicalStability: 65
      };

      // Should create complete save file
      // const saveFile = createSaveFile(character, worldState, 'manual');
      // expect(saveFile.character.basicInfo.name).toBe('Test Hero');
      // expect(saveFile.world.season).toBe('autumn');
      // expect(saveFile.metadata.saveType).toBe('manual');
    });

    it.skip('should generate unique save IDs and timestamps', () => {
      const _save1 = { id: 'save_001', timestamp: Date.now() };
      const _save2 = { id: 'save_002', timestamp: Date.now() + 1000 };

      // Save IDs should be unique
      // expect(save1.id).not.toBe(save2.id);
      // expect(save2.timestamp).toBeGreaterThan(save1.timestamp);
    });

    it.skip('should compress save data for storage efficiency', () => {
      const _largeSaveData = {
        character: { /* large character object */ },
        world: { /* large world state */ },
        progress: { /* extensive progress data */ }
      };

      // Should compress data to reduce storage size
      // const compressedSave = compressSaveData(largeSaveData);
      // const originalSize = JSON.stringify(largeSaveData).length;
      // const compressedSize = compressedSave.length;
      // expect(compressedSize).toBeLessThan(originalSize * 0.7); // At least 30% compression
    });

    it.skip('should handle save file versioning', () => {
      const _saveV1 = {
        version: '1.0.0',
        character: { name: 'Hero', level: 5 }
      };

      const _saveV2 = {
        version: '1.1.0',
        character: { name: 'Hero', level: 5, age: 20 } // Added age field
      };

      // Should track version changes
      // expect(saveV2.version).not.toBe(saveV1.version);
      // expect('age' in saveV2.character).toBe(true);
      // expect('age' in saveV1.character).toBe(false);
    });
  });

  describe('Save File Management', () => {
    it.skip('should support multiple save slots', () => {
      const _saveSlots = [
        { slot: 1, save: { id: 'save_001', name: 'Main Adventure' } },
        { slot: 2, save: { id: 'save_002', name: 'Alternative Path' } },
        { slot: 3, save: null } // Empty slot
      ];

      const _maxSlots = 10;

      // Should manage multiple save slots
      // expect(saveSlots.length).toBeLessThanOrEqual(maxSlots);
      // expect(saveSlots.find(s => s.slot === 3)?.save).toBeNull();
    });

    it.skip('should implement auto-save functionality', () => {
      const autoSaveSettings = {
        enabled: true,
        interval: 300000, // 5 minutes
        maxAutoSaves: 5,
        triggers: ['level_up', 'quest_completion', 'location_change', 'combat_end']
      };

      const lastAutoSave = Date.now() - 400000; // 6.67 minutes ago
      const currentTime = Date.now();

      // Should trigger auto-save based on time interval
      // const shouldAutoSave = currentTime - lastAutoSave > autoSaveSettings.interval;
      // expect(shouldAutoSave).toBe(true);
    });

    it.skip('should manage save file storage and cleanup', () => {
      const saveFiles = [
        { id: 'save_001', timestamp: Date.now() - 86400000, size: 1024 }, // 1 day old
        { id: 'save_002', timestamp: Date.now() - 172800000, size: 2048 }, // 2 days old
        { id: 'save_003', timestamp: Date.now() - 604800000, size: 1536 } // 1 week old
      ];

      const storageLimit = 100 * 1024 * 1024; // 100MB
      const currentUsage = 50 * 1024 * 1024; // 50MB

      // Should manage storage efficiently
      // const cleanupNeeded = currentUsage > storageLimit * 0.8;
      // expect(cleanupNeeded).toBe(false);
      
      // Should identify old saves for cleanup
      // const oldSaves = saveFiles.filter(s => Date.now() - s.timestamp > 604800000);
      // expect(oldSaves.length).toBe(1);
    });

    it.skip('should provide save file metadata and previews', () => {
      const saveMetadata: SaveMetadata = {
        saveType: 'manual',
        gameVersion: '1.2.0',
        platform: 'web',
        playSession: 15,
        totalPlaytime: 3600000, // 1 hour
        screenshot: 'base64_encoded_image_data',
        notes: 'Before entering the empire'
      };

      const savePreview = {
        characterName: 'Hero',
        level: 10,
        location: 'Empire Gates',
        playtime: '1h 0m',
        timestamp: 'Today 14:30'
      };

      // Should provide rich metadata for save management
      // expect(saveMetadata.totalPlaytime).toBeGreaterThan(0);
      // expect(savePreview.characterName).toBeDefined();
      // expect(saveMetadata.screenshot).toBeDefined();
    });
  });

  describe('Save File Validation', () => {
    it.skip('should validate save file integrity', () => {
      const validSave: GameSave = {
        id: 'save_001',
        name: 'Test Save',
        timestamp: Date.now(),
        version: '1.0.0',
        character: {
          basicInfo: { name: 'Hero', age: 20, level: 5, experience: 1000, currentLocation: 'town' },
          stats: { body: 10, mind: 12, heart: 8, wisdom: 6, health: 100, maxHealth: 100, mana: 60, maxMana: 60 },
          detailedStats: {
            physicalAttack: 15, physicalDefense: 12, mentalAttack: 18, mentalDefense: 15,
            socialAttack: 10, socialDefense: 8, speed: 11, evasion: 9, accuracy: 13
          },
          inventory: { items: [], gold: 100, capacity: 20, weight: 0 },
          equipment: { accessories: [] },
          knowledge: { knownFallacies: [], knownParadoxes: [], learnedSkills: [], discoveries: [], loreEntries: [] },
          relationships: { npcRelationships: {}, factionReputation: {}, romanticInterests: [], enemies: [], allies: [] },
          moralAlignment: { good: 0, evil: 0, lawful: 0, chaotic: 0 },
          mentalState: { sanity: 100, determination: 80, homesickness: 20, stress: 10, confidence: 70 }
        },
        world: {
          currentTime: Date.now(),
          season: 'spring',
          weather: 'clear',
          globalEvents: [],
          locationStates: {},
          npcStates: {},
          economicState: { globalInflation: 0, resourcePrices: {}, tradeRoutes: [], marketTrends: {} },
          politicalState: { factionInfluence: {}, activeConflicts: [], rulerStatus: 'stable', stability: 75, recentEvents: [] }
        },
        progress: {
          mainQuests: [], sideQuests: [], completedQuests: [], failedQuests: [],
          achievements: [], statistics: {
            playtime: 0, combatsWon: 0, combatsLost: 0, questsCompleted: 0, fallaciesUsed: 0,
            paradoxesMastered: 0, npcsMetCount: 0, locationsVisited: 0, goldEarned: 0, goldSpent: 0,
            itemsCrafted: 0, booksRead: 0, philosophicalDebatesWon: 0
          },
          milestones: []
        },
        settings: {
          difficulty: 'normal',
          audioSettings: { masterVolume: 1, musicVolume: 0.8, sfxVolume: 0.9, voiceVolume: 1, muted: false },
          displaySettings: { resolution: '1920x1080', fullscreen: false, brightness: 50, contrast: 50, colorblindSupport: false },
          gameplaySettings: { autoSave: true, autoSaveInterval: 300000, combatSpeed: 1, textSpeed: 1, showTutorials: true, skipAnimations: false },
          accessibilitySettings: { fontSize: 16, highContrast: false, screenReader: false, subtitles: false, colorblindMode: 'none' }
        },
        metadata: {
          saveType: 'manual', gameVersion: '1.0.0', platform: 'web',
          playSession: 1, totalPlaytime: 0
        }
      };

      // Should validate save file structure and data
      // const validation = validateSaveFile(validSave);
      // expect(validation.isValid).toBe(true);
      // expect(validation.errors.length).toBe(0);
    });

    it.skip('should detect corrupted save files', () => {
      const corruptedSave = {
        id: 'save_corrupt',
        character: {
          basicInfo: { name: 'Hero', level: -5 }, // Invalid negative level
          stats: { body: 'invalid' }, // Invalid stat type
        },
        world: null, // Missing required field
        version: '0.0.0' // Unsupported version
      };

      // Should identify corruption and validation errors
      // const validation = validateSaveFile(corruptedSave);
      // expect(validation.isValid).toBe(false);
      // expect(validation.errors.length).toBeGreaterThan(0);
      // expect(validation.errors.find(e => e.field === 'character.basicInfo.level')).toBeDefined();
    });

    it.skip('should handle version compatibility', () => {
      const oldVersionSave = {
        version: '0.9.0',
        character: { name: 'Hero', level: 5 },
        // Missing newer fields
      };

      const currentVersion = '1.2.0';

      // Should detect version compatibility issues
      // const compatibility = checkVersionCompatibility(oldVersionSave.version, currentVersion);
      // expect(compatibility.compatible).toBe(false);
      // expect(compatibility.migrationRequired).toBe(true);
    });

    it.skip('should provide detailed error reporting', () => {
      const invalidSave = {
        character: {
          stats: { body: -10, mind: 150 } // Invalid stat ranges
        }
      };

      const validationResult: SaveValidation = {
        isValid: false,
        errors: [
          { field: 'character.stats.body', message: 'Stat cannot be negative', severity: 'major' },
          { field: 'character.stats.mind', message: 'Stat exceeds maximum value', severity: 'minor' }
        ],
        warnings: [
          { field: 'character.stats.mind', message: 'Unusually high stat value', canContinue: true }
        ],
        migrationRequired: false
      };

      // Should provide comprehensive error information
      // expect(validationResult.errors.length).toBe(2);
      // expect(validationResult.errors.find(e => e.severity === 'major')).toBeDefined();
      // expect(validationResult.warnings.length).toBe(1);
    });
  });

  describe('Load Game Functionality', () => {
    it.skip('should restore complete game state from save file', () => {
      const saveFile: GameSave = {
        id: 'save_001',
        name: 'Test Save',
        timestamp: Date.now(),
        version: '1.0.0',
        character: {
          basicInfo: { name: 'Restored Hero', age: 25, level: 10, experience: 5000, currentLocation: 'empire' },
          stats: { body: 15, mind: 20, heart: 18, wisdom: 22, health: 150, maxHealth: 150, mana: 100, maxMana: 100 },
          detailedStats: {
            physicalAttack: 25, physicalDefense: 20, mentalAttack: 30, mentalDefense: 25,
            socialAttack: 22, socialDefense: 18, speed: 16, evasion: 14, accuracy: 18
          },
          inventory: { items: [{ id: 'magic_sword', quantity: 1 }], gold: 1000, capacity: 30, weight: 5 },
          equipment: { weapon: { id: 'magic_sword', quantity: 1 }, accessories: [] },
          knowledge: { knownFallacies: ['ad_hominem'], knownParadoxes: [], learnedSkills: ['combat'], discoveries: [], loreEntries: [] },
          relationships: { npcRelationships: { 'npc_001': 50 }, factionReputation: { 'faction_001': 75 }, romanticInterests: [], enemies: [], allies: [] },
          moralAlignment: { good: 25, evil: 0, lawful: 15, chaotic: 5 },
          mentalState: { sanity: 90, determination: 85, homesickness: 10, stress: 15, confidence: 80 }
        },
        world: {
          currentTime: Date.now(),
          season: 'summer',
          weather: 'sunny',
          globalEvents: [{ id: 'event_001', status: 'active', startTime: Date.now(), effects: {} }],
          locationStates: { 'location_001': { visited: true, discoveryLevel: 100, availableResources: [], currentEvents: [], safetyLevel: 8 } },
          npcStates: { 'npc_001': { currentLocation: 'town', mood: 'happy', availability: true, questsOffered: [], relationship: 50, personalHistory: [] } },
          economicState: { globalInflation: 1.05, resourcePrices: { 'wood': 10 }, tradeRoutes: [], marketTrends: {} },
          politicalState: { factionInfluence: { 'faction_001': 75 }, activeConflicts: [], rulerStatus: 'stable', stability: 80, recentEvents: [] }
        },
        progress: {
          mainQuests: [{ id: 'main_001', status: 'active', objectives: [], startTime: Date.now(), choicesMade: [] }],
          sideQuests: [], completedQuests: ['quest_001'], failedQuests: [],
          achievements: [{ id: 'first_victory', unlockedTime: Date.now(), progress: 100, completed: true }],
          statistics: {
            playtime: 3600000, combatsWon: 10, combatsLost: 2, questsCompleted: 5, fallaciesUsed: 15,
            paradoxesMastered: 2, npcsMetCount: 20, locationsVisited: 8, goldEarned: 2000, goldSpent: 1000,
            itemsCrafted: 3, booksRead: 5, philosophicalDebatesWon: 7
          },
          milestones: [{ id: 'first_level', name: 'First Level Up', description: 'Reached level 2', achievedTime: Date.now(), significance: 'minor' }]
        },
        settings: {
          difficulty: 'hard',
          audioSettings: { masterVolume: 0.8, musicVolume: 0.6, sfxVolume: 0.9, voiceVolume: 0.7, muted: false },
          displaySettings: { resolution: '2560x1440', fullscreen: true, brightness: 60, contrast: 55, colorblindSupport: true },
          gameplaySettings: { autoSave: false, autoSaveInterval: 600000, combatSpeed: 1.5, textSpeed: 2, showTutorials: false, skipAnimations: true },
          accessibilitySettings: { fontSize: 18, highContrast: true, screenReader: false, subtitles: true, colorblindMode: 'deuteranopia' }
        },
        metadata: {
          saveType: 'manual', gameVersion: '1.0.0', platform: 'web',
          playSession: 5, totalPlaytime: 3600000, screenshot: 'screenshot_data'
        }
      };

      // Should restore all game systems to saved state
      // const restoredGame = loadGameFromSave(saveFile);
      // expect(restoredGame.character.basicInfo.name).toBe('Restored Hero');
      // expect(restoredGame.character.basicInfo.level).toBe(10);
      // expect(restoredGame.world.season).toBe('summer');
      // expect(restoredGame.progress.completedQuests).toContain('quest_001');
    });

    it.skip('should handle save file migration for older versions', () => {
      const oldSave = {
        version: '0.9.0',
        character: {
          name: 'Old Hero',
          level: 5,
          stats: { body: 10, mind: 12 } // Missing heart and wisdom stats
        },
        // Missing world state and other new fields
      };

      const migrationRules = [
        { fromVersion: '0.9.0', toVersion: '1.0.0', migrations: ['add_heart_wisdom_stats', 'add_world_state'] },
        { fromVersion: '1.0.0', toVersion: '1.1.0', migrations: ['add_age_field', 'add_mental_state'] }
      ];

      // Should migrate old save to current version
      // const migratedSave = migrateSave(oldSave, migrationRules);
      // expect(migratedSave.version).toBe('1.1.0');
      // expect(migratedSave.character.stats.heart).toBeDefined();
      // expect(migratedSave.character.stats.wisdom).toBeDefined();
    });

    it.skip('should provide loading progress feedback', () => {
      const loadingSteps = [
        { step: 'validating_save', progress: 10, description: 'Validating save file integrity' },
        { step: 'loading_character', progress: 30, description: 'Loading character data' },
        { step: 'loading_world', progress: 50, description: 'Loading world state' },
        { step: 'loading_progress', progress: 70, description: 'Loading quest progress' },
        { step: 'applying_settings', progress: 90, description: 'Applying game settings' },
        { step: 'complete', progress: 100, description: 'Load complete' }
      ];

      // Should provide detailed loading progress
      // loadingSteps.forEach(step => {
      //   expect(step.progress).toBeGreaterThanOrEqual(0);
      //   expect(step.progress).toBeLessThanOrEqual(100);
      //   expect(step.description).toBeDefined();
      // });
    });

    it.skip('should handle load failures gracefully', () => {
      const corruptedSave = {
        character: null, // Corrupted character data
        world: undefined,
        version: 'invalid'
      };

      const loadResult = {
        success: false,
        error: 'Save file is corrupted and cannot be loaded',
        fallbackOptions: ['load_backup_save', 'start_new_game', 'repair_save_file'],
        recoverableData: ['character_name', 'play_statistics']
      };

      // Should provide recovery options for failed loads
      // expect(loadResult.success).toBe(false);
      // expect(loadResult.fallbackOptions.length).toBeGreaterThan(0);
      // expect(loadResult.recoverableData.length).toBeGreaterThan(0);
    });
  });

  describe('Cloud Save Integration', () => {
    it.skip('should sync saves with cloud storage', () => {
      const localSaves = [
        { id: 'save_001', timestamp: Date.now(), hash: 'abc123' },
        { id: 'save_002', timestamp: Date.now() - 3600000, hash: 'def456' }
      ];

      const cloudSaves = [
        { id: 'save_001', timestamp: Date.now() - 1800000, hash: 'abc123' }, // Older version
        { id: 'save_003', timestamp: Date.now(), hash: 'ghi789' } // New cloud save
      ];

      // Should identify sync conflicts and resolve them
      // const syncResult = syncWithCloud(localSaves, cloudSaves);
      // expect(syncResult.conflicts.length).toBe(1); // save_001 has newer local version
      // expect(syncResult.toUpload.length).toBe(1); // save_002 needs uploading
      // expect(syncResult.toDownload.length).toBe(1); // save_003 needs downloading
    });

    it.skip('should handle offline/online transitions', () => {
      const offlineChanges = [
        { saveId: 'save_001', action: 'modified', timestamp: Date.now() },
        { saveId: 'save_002', action: 'created', timestamp: Date.now() - 1800000 },
        { saveId: 'save_003', action: 'deleted', timestamp: Date.now() - 900000 }
      ];

      const onlineStatus = true;
      
      // Should queue offline changes for sync when online
      // const pendingSync = getPendingSyncOperations(offlineChanges, onlineStatus);
      // expect(pendingSync.length).toBe(3);
      // expect(pendingSync.find(op => op.action === 'created')).toBeDefined();
    });

    it.skip('should implement conflict resolution strategies', () => {
      const conflictScenarios = [
        {
          type: 'newer_local',
          strategy: 'upload_local',
          description: 'Local save is newer than cloud save'
        },
        {
          type: 'newer_cloud',
          strategy: 'download_cloud',
          description: 'Cloud save is newer than local save'
        },
        {
          type: 'different_branches',
          strategy: 'user_choice',
          description: 'Both saves have been modified independently'
        }
      ];

      // Should handle different conflict types appropriately
      // expect(conflictScenarios.find(s => s.strategy === 'user_choice')).toBeDefined();
      // expect(conflictScenarios.every(s => s.strategy)).toBeTruthy();
    });
  });
});