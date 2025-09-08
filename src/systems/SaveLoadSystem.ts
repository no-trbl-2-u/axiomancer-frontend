// Save/Load System Implementation
// Handles saving and loading game state, including compression, validation, and cloud sync

export interface GameSave {
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

export interface SavedCharacter {
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

export interface SavedInventory {
  items: SavedItem[];
  gold: number;
  capacity: number;
  weight: number;
}

export interface SavedItem {
  id: string;
  quantity: number;
  durability?: number;
  customProperties?: { [key: string]: any };
}

export interface SavedEquipment {
  weapon?: SavedItem;
  armor?: SavedItem;
  accessories: SavedItem[];
}

export interface SavedKnowledge {
  knownFallacies: string[];
  knownParadoxes: string[];
  learnedSkills: string[];
  discoveries: string[];
  loreEntries: string[];
}

export interface SavedRelationships {
  npcRelationships: { [npcId: string]: number };
  factionReputation: { [factionId: string]: number };
  romanticInterests: string[];
  enemies: string[];
  allies: string[];
}

export interface MoralAlignment {
  good: number;
  evil: number;
  lawful: number;
  chaotic: number;
}

export interface MentalState {
  sanity: number;
  determination: number;
  homesickness: number;
  stress: number;
  confidence: number;
}

export interface SavedWorldState {
  currentTime: number;
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  weather: string;
  globalEvents: SavedEvent[];
  locationStates: { [locationId: string]: LocationState };
  npcStates: { [npcId: string]: NPCState };
  economicState: EconomicState;
  politicalState: PoliticalState;
}

export interface SavedEvent {
  id: string;
  status: 'active' | 'completed' | 'failed' | 'expired';
  startTime: number;
  endTime?: number;
  effects: { [key: string]: any };
}

export interface LocationState {
  visited: boolean;
  discoveryLevel: number;
  availableResources: string[];
  currentEvents: string[];
  safetyLevel: number;
  lastVisited?: number;
}

export interface NPCState {
  currentLocation: string;
  mood: string;
  availability: boolean;
  questsOffered: string[];
  relationship: number;
  lastInteraction?: number;
  personalHistory: string[];
}

export interface EconomicState {
  globalInflation: number;
  resourcePrices: { [resource: string]: number };
  tradeRoutes: string[];
  marketTrends: { [market: string]: 'rising' | 'falling' | 'stable' };
}

export interface PoliticalState {
  factionInfluence: { [factionId: string]: number };
  activeConflicts: string[];
  rulerStatus: string;
  stability: number;
  recentEvents: string[];
}

export interface SavedProgress {
  mainQuests: SavedQuest[];
  sideQuests: SavedQuest[];
  completedQuests: string[];
  failedQuests: string[];
  achievements: SavedAchievement[];
  statistics: GameStatistics;
  milestones: SavedMilestone[];
}

export interface SavedQuest {
  id: string;
  status: 'active' | 'completed' | 'failed' | 'available';
  objectives: SavedObjective[];
  startTime: number;
  completionTime?: number;
  choicesMade: string[];
}

export interface SavedObjective {
  id: string;
  completed: boolean;
  progress: number;
  maxProgress: number;
}

export interface SavedAchievement {
  id: string;
  unlockedTime: number;
  progress: number;
  completed: boolean;
}

export interface GameStatistics {
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

export interface SavedMilestone {
  id: string;
  name: string;
  description: string;
  achievedTime: number;
  significance: 'minor' | 'major' | 'epic';
}

export interface SavedSettings {
  difficulty: 'easy' | 'normal' | 'hard' | 'nightmare';
  audioSettings: AudioSettings;
  displaySettings: DisplaySettings;
  gameplaySettings: GameplaySettings;
  accessibilitySettings: AccessibilitySettings;
}

export interface AudioSettings {
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  voiceVolume: number;
  muted: boolean;
}

export interface DisplaySettings {
  resolution: string;
  fullscreen: boolean;
  brightness: number;
  contrast: number;
  colorblindSupport: boolean;
}

export interface GameplaySettings {
  autoSave: boolean;
  autoSaveInterval: number;
  combatSpeed: number;
  textSpeed: number;
  showTutorials: boolean;
  skipAnimations: boolean;
}

export interface AccessibilitySettings {
  fontSize: number;
  highContrast: boolean;
  screenReader: boolean;
  subtitles: boolean;
  colorblindMode: string;
}

export interface SaveMetadata {
  saveType: 'manual' | 'auto' | 'checkpoint';
  gameVersion: string;
  platform: string;
  playSession: number;
  totalPlaytime: number;
  screenshot?: string; // Base64 encoded screenshot
  notes?: string;
}

export interface SaveValidation {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  migrationRequired: boolean;
}

export interface ValidationError {
  field: string;
  message: string;
  severity: 'critical' | 'major' | 'minor';
}

export interface ValidationWarning {
  field: string;
  message: string;
  canContinue: boolean;
}

export interface SaveSlot {
  slot: number;
  save: GameSave | null;
}

export interface LoadingStep {
  step: string;
  progress: number;
  description: string;
}

export interface LoadResult {
  success: boolean;
  error?: string;
  fallbackOptions?: string[];
  recoverableData?: string[];
}

export interface SyncResult {
  conflicts: GameSave[];
  toUpload: GameSave[];
  toDownload: GameSave[];
}

export interface OfflineChange {
  saveId: string;
  action: 'modified' | 'created' | 'deleted';
  timestamp: number;
}

export interface ConflictResolution {
  type: string;
  strategy: string;
  description: string;
}

export class SaveLoadSystem {
  private saveSlots: Map<number, GameSave | null> = new Map();
  private maxSlots: number = 10;
  private currentVersion: string = '1.0.0';
  private autoSaveSettings = {
    enabled: true,
    interval: 300000, // 5 minutes
    maxAutoSaves: 5,
    triggers: ['level_up', 'quest_completion', 'location_change', 'combat_end']
  };
  private lastAutoSave: number = 0;

  constructor() {
    this.initializeSaveSlots();
  }

  private initializeSaveSlots(): void {
    for (let i = 1; i <= this.maxSlots; i++) {
      this.saveSlots.set(i, null);
    }
  }

  public createSaveFile(
    character: any,
    worldState: any,
    saveType: 'manual' | 'auto' | 'checkpoint',
    saveSlot?: number,
    saveName?: string
  ): GameSave {
    const saveId = this.generateSaveId();
    const timestamp = Date.now();

    const gameSave: GameSave = {
      id: saveId,
      name: saveName || `Save ${saveId}`,
      timestamp,
      version: this.currentVersion,
      character: this.serializeCharacter(character),
      world: this.serializeWorldState(worldState),
      progress: this.serializeProgress(),
      settings: this.serializeSettings(),
      metadata: {
        saveType,
        gameVersion: this.currentVersion,
        platform: 'web',
        playSession: 1,
        totalPlaytime: 0
      }
    };

    if (saveSlot) {
      this.saveSlots.set(saveSlot, gameSave);
    }

    return gameSave;
  }

  private generateSaveId(): string {
    return `save_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private serializeCharacter(character: any): SavedCharacter {
    return {
      basicInfo: {
        name: character.name || 'Unknown',
        age: character.age || 20,
        level: character.level || 1,
        experience: character.experience || 0,
        currentLocation: character.currentLocation || 'starting_town'
      },
      stats: {
        body: character.stats?.body || 10,
        mind: character.stats?.mind || 10,
        heart: character.stats?.heart || 10,
        wisdom: character.stats?.wisdom || 10,
        health: character.health || 100,
        maxHealth: character.maxHealth || 100,
        mana: character.mana || 50,
        maxMana: character.maxMana || 50
      },
      detailedStats: {
        physicalAttack: 10,
        physicalDefense: 10,
        mentalAttack: 10,
        mentalDefense: 10,
        socialAttack: 10,
        socialDefense: 10,
        speed: 10,
        evasion: 10,
        accuracy: 10
      },
      inventory: {
        items: character.inventory?.items || [],
        gold: character.inventory?.gold || 0,
        capacity: 20,
        weight: 0
      },
      equipment: {
        accessories: []
      },
      knowledge: {
        knownFallacies: character.knownFallacies || [],
        knownParadoxes: [],
        learnedSkills: [],
        discoveries: [],
        loreEntries: []
      },
      relationships: {
        npcRelationships: character.npcRelationships || {},
        factionReputation: character.factionReputation || {},
        romanticInterests: [],
        enemies: [],
        allies: []
      },
      moralAlignment: {
        good: 0,
        evil: 0,
        lawful: 0,
        chaotic: 0
      },
      mentalState: {
        sanity: 100,
        determination: 80,
        homesickness: 20,
        stress: 10,
        confidence: 70
      }
    };
  }

  private serializeWorldState(worldState: any): SavedWorldState {
    return {
      currentTime: worldState.currentTime || Date.now(),
      season: worldState.season || 'spring',
      weather: worldState.weather || 'clear',
      globalEvents: worldState.globalEvents || [],
      locationStates: {},
      npcStates: {},
      economicState: {
        globalInflation: 1.0,
        resourcePrices: {},
        tradeRoutes: [],
        marketTrends: {}
      },
      politicalState: {
        factionInfluence: {},
        activeConflicts: [],
        rulerStatus: 'stable',
        stability: worldState.politicalStability || 75,
        recentEvents: []
      }
    };
  }

  private serializeProgress(): SavedProgress {
    return {
      mainQuests: [],
      sideQuests: [],
      completedQuests: [],
      failedQuests: [],
      achievements: [],
      statistics: {
        playtime: 0,
        combatsWon: 0,
        combatsLost: 0,
        questsCompleted: 0,
        fallaciesUsed: 0,
        paradoxesMastered: 0,
        npcsMetCount: 0,
        locationsVisited: 0,
        goldEarned: 0,
        goldSpent: 0,
        itemsCrafted: 0,
        booksRead: 0,
        philosophicalDebatesWon: 0
      },
      milestones: []
    };
  }

  private serializeSettings(): SavedSettings {
    return {
      difficulty: 'normal',
      audioSettings: {
        masterVolume: 1,
        musicVolume: 0.8,
        sfxVolume: 0.9,
        voiceVolume: 1,
        muted: false
      },
      displaySettings: {
        resolution: '1920x1080',
        fullscreen: false,
        brightness: 50,
        contrast: 50,
        colorblindSupport: false
      },
      gameplaySettings: {
        autoSave: true,
        autoSaveInterval: 300000,
        combatSpeed: 1,
        textSpeed: 1,
        showTutorials: true,
        skipAnimations: false
      },
      accessibilitySettings: {
        fontSize: 16,
        highContrast: false,
        screenReader: false,
        subtitles: false,
        colorblindMode: 'none'
      }
    };
  }

  public validateSaveFile(save: any): SaveValidation {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Basic structure validation
    if (!save.id) {
      errors.push({
        field: 'id',
        message: 'Save file missing required ID',
        severity: 'critical'
      });
    }

    if (!save.character) {
      errors.push({
        field: 'character',
        message: 'Save file missing character data',
        severity: 'critical'
      });
    } else {
      // Character validation
      if (!save.character.basicInfo?.name) {
        errors.push({
          field: 'character.basicInfo.name',
          message: 'Character name is required',
          severity: 'major'
        });
      }

      if (save.character.basicInfo?.level < 0) {
        errors.push({
          field: 'character.basicInfo.level',
          message: 'Character level cannot be negative',
          severity: 'major'
        });
      }

      if (typeof save.character.stats?.body !== 'number') {
        errors.push({
          field: 'character.stats.body',
          message: 'Character stats must be numeric',
          severity: 'major'
        });
      }
    }

    if (!save.world) {
      errors.push({
        field: 'world',
        message: 'Save file missing world state',
        severity: 'critical'
      });
    }

    // Version compatibility check
    const migrationRequired = save.version !== this.currentVersion;

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      migrationRequired
    };
  }

  public compressSaveData(saveData: any): string {
    // Simple compression simulation - in real implementation would use actual compression
    const jsonString = JSON.stringify(saveData);
    // Simulate compression by removing some whitespace and shortening field names
    const compressed = jsonString.replace(/\s+/g, ' ').replace(/"/g, "'");
    return btoa(compressed); // Base64 encoding as compression simulation
  }

  public decompressSaveData(compressedData: string): any {
    try {
      const decompressed = atob(compressedData);
      return JSON.parse(decompressed.replace(/'/g, '"'));
    } catch (error) {
      throw new Error('Failed to decompress save data');
    }
  }

  public loadGameFromSave(saveFile: GameSave): any {
    const validation = this.validateSaveFile(saveFile);
    
    if (!validation.isValid) {
      throw new Error(`Cannot load save: ${validation.errors[0].message}`);
    }

    // Restore game state from save file
    return {
      character: saveFile.character,
      world: saveFile.world,
      progress: saveFile.progress,
      settings: saveFile.settings
    };
  }

  public shouldAutoSave(): boolean {
    const now = Date.now();
    return this.autoSaveSettings.enabled && 
           (now - this.lastAutoSave) > this.autoSaveSettings.interval;
  }

  public performAutoSave(gameState: any): GameSave | null {
    if (!this.shouldAutoSave()) {
      return null;
    }

    const autoSave = this.createSaveFile(
      gameState.character,
      gameState.world,
      'auto'
    );

    this.lastAutoSave = Date.now();
    return autoSave;
  }

  public getSaveSlots(): SaveSlot[] {
    const slots: SaveSlot[] = [];
    for (let i = 1; i <= this.maxSlots; i++) {
      slots.push({
        slot: i,
        save: this.saveSlots.get(i) || null
      });
    }
    return slots;
  }

  public getLoadingSteps(): LoadingStep[] {
    return [
      { step: 'validating_save', progress: 10, description: 'Validating save file integrity' },
      { step: 'loading_character', progress: 30, description: 'Loading character data' },
      { step: 'loading_world', progress: 50, description: 'Loading world state' },
      { step: 'loading_progress', progress: 70, description: 'Loading quest progress' },
      { step: 'applying_settings', progress: 90, description: 'Applying game settings' },
      { step: 'complete', progress: 100, description: 'Load complete' }
    ];
  }

  public migrateSave(oldSave: any, migrationRules: any[]): GameSave {
    let currentSave = { ...oldSave };
    
    for (const rule of migrationRules) {
      if (currentSave.version === rule.fromVersion) {
        // Apply migrations
        if (rule.migrations.includes('add_heart_wisdom_stats')) {
          if (!currentSave.character.stats.heart) {
            currentSave.character.stats.heart = 10;
          }
          if (!currentSave.character.stats.wisdom) {
            currentSave.character.stats.wisdom = 10;
          }
        }
        
        if (rule.migrations.includes('add_age_field')) {
          if (!currentSave.character.age) {
            currentSave.character.age = 20;
          }
        }
        
        currentSave.version = rule.toVersion;
      }
    }
    
    return currentSave as GameSave;
  }

  // Cloud sync methods (simplified implementations)
  public syncWithCloud(localSaves: any[], cloudSaves: any[]): SyncResult {
    const conflicts: GameSave[] = [];
    const toUpload: GameSave[] = [];
    const toDownload: GameSave[] = [];

    // Find conflicts and sync operations
    for (const localSave of localSaves) {
      const cloudSave = cloudSaves.find(c => c.id === localSave.id);
      if (cloudSave) {
        if (localSave.timestamp > cloudSave.timestamp) {
          toUpload.push(localSave);
        } else if (cloudSave.timestamp > localSave.timestamp) {
          toDownload.push(cloudSave);
        }
      } else {
        toUpload.push(localSave);
      }
    }

    for (const cloudSave of cloudSaves) {
      const localSave = localSaves.find(l => l.id === cloudSave.id);
      if (!localSave) {
        toDownload.push(cloudSave);
      }
    }

    return { conflicts, toUpload, toDownload };
  }
}

// Export singleton instance
export const saveLoadSystem = new SaveLoadSystem();