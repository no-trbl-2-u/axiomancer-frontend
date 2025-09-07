// Special Mechanics API
// Demon contracts, boat building, labyrinth progression

// ===== DEMON CONTRACT SYSTEM =====

export interface DemonContract {
  id: string;
  demonName: string;
  demonType: 'lesser' | 'greater' | 'arch' | 'primordial';
  description: string;
  soulCost: number; // Percentage of soul sacrificed
  benefits: {
    statBoosts: Record<string, number>;
    specialAbilities: string[];
    knowledgeGrant: string[];
  };
  consequences: {
    soulCorruption: number;
    moralShift: { law: number; chaos: number; good: number; evil: number };
    physicalChanges: string[];
    mentalEffects: string[];
  };
  terms: string[];
  duration: 'permanent' | 'temporary';
  revocable: boolean;
  signed: boolean;
  signedAt?: string;
}

export interface SoulStatus {
  characterId: string;
  soulIntegrity: number; // 0-100, 0 = completely corrupted
  contractsSigned: DemonContract[];
  corruptionLevel: 'pure' | 'tainted' | 'corrupted' | 'damned';
  soulFragments: number;
  redemptionPossible: boolean;
}

export interface DemonInteraction {
  demonId: string;
  interactionType: 'bargain' | 'summon' | 'banish' | 'question';
  outcome: 'success' | 'failure' | 'partial';
  consequences: string[];
  timestamp: string;
}

export const demonAPI = {
  async getSoulStatus(characterId: string): Promise<SoulStatus> {
    console.log('Getting soul status for:', characterId);
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return {
      characterId,
      soulIntegrity: 100,
      contractsSigned: [],
      corruptionLevel: 'pure',
      soulFragments: 1,
      redemptionPossible: true
    };
  },

  async getAvailableContracts(characterId: string): Promise<DemonContract[]> {
    console.log('Getting available demon contracts for:', characterId);
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const mockContracts: DemonContract[] = [
      {
        id: 'lesser_knowledge_pact',
        demonName: 'Vesper the Whisperer',
        demonType: 'lesser',
        description: 'A minor demon offering forbidden knowledge in exchange for a small portion of your soul.',
        soulCost: 10,
        benefits: {
          statBoosts: { mentalAttack: 5, perception: 3 },
          specialAbilities: ['dark_insight'],
          knowledgeGrant: ['hidden_fallacies']
        },
        consequences: {
          soulCorruption: 10,
          moralShift: { law: 0, chaos: 1, good: 0, evil: 2 },
          physicalChanges: ['eyes_glow_red'],
          mentalEffects: ['whispers_in_darkness']
        },
        terms: [
          'You must share one secret learned with Vesper each month',
          'You cannot refuse to hear the demon\'s whispers',
          'Knowledge gained must be used at least once per year'
        ],
        duration: 'permanent',
        revocable: false,
        signed: false
      },
      {
        id: 'power_bargain',
        demonName: 'Malphas the Destroyer',
        demonType: 'greater',
        description: 'A powerful demon offering immense combat prowess for a significant soul sacrifice.',
        soulCost: 30,
        benefits: {
          statBoosts: { physicalAttack: 10, physicalDefense: 8, speed: 5 },
          specialAbilities: ['demon_rage', 'unholy_strength'],
          knowledgeGrant: ['combat_mastery']
        },
        consequences: {
          soulCorruption: 30,
          moralShift: { law: -2, chaos: 3, good: -3, evil: 4 },
          physicalChanges: ['demonic_markings', 'increased_aggression'],
          mentalEffects: ['bloodlust', 'difficulty_feeling_empathy']
        },
        terms: [
          'You must engage in combat at least once per month',
          'You cannot refuse a direct challenge to battle',
          'Victory in combat partially feeds the demon'
        ],
        duration: 'permanent',
        revocable: false,
        signed: false
      }
    ];
    
    return mockContracts;
  },

  async signContract(characterId: string, contractId: string): Promise<DemonContract> {
    console.log('Signing demon contract:', { characterId, contractId });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock contract signing
    const signedContract: DemonContract = {
      id: contractId,
      demonName: 'Contract Signed',
      demonType: 'lesser',
      description: 'The pact has been sealed',
      soulCost: 10,
      benefits: { statBoosts: {}, specialAbilities: [], knowledgeGrant: [] },
      consequences: { soulCorruption: 10, moralShift: { law: 0, chaos: 0, good: 0, evil: 1 }, physicalChanges: [], mentalEffects: [] },
      terms: [],
      duration: 'permanent',
      revocable: false,
      signed: true,
      signedAt: new Date().toISOString()
    };
    
    return signedContract;
  },

  async recordInteraction(characterId: string, interaction: Omit<DemonInteraction, 'timestamp'>): Promise<void> {
    console.log('Recording demon interaction:', interaction);
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Mock interaction recording
  }
};

// ===== BOAT BUILDING SYSTEM =====

export interface BoatPiece {
  id: string;
  name: string;
  type: 'hull' | 'sail' | 'mast' | 'rudder' | 'anchor' | 'decoration';
  quality: 'crude' | 'decent' | 'fine' | 'masterwork';
  durability: number;
  materials: string[];
  craftedBy?: string;
  craftedAt?: string;
}

export interface BoatBlueprint {
  id: string;
  name: string;
  description: string;
  requiredPieces: { type: string; minQuality: string; quantity: number }[];
  totalPieces: number;
  seaworthiness: number;
  specialFeatures: string[];
}

export interface BoatBuildingProgress {
  characterId: string;
  availablePieces: BoatPiece[];
  currentBlueprint?: BoatBlueprint;
  buildingProgress: number;
  maxProgress: number;
  boatCompleted: boolean;
  completedAt?: string;
  finalBoatStats: {
    seaworthiness: number;
    speed: number;
    durability: number;
    specialFeatures: string[];
  };
}

export const boatAPI = {
  async getProgress(characterId: string): Promise<BoatBuildingProgress> {
    console.log('Getting boat building progress for:', characterId);
    await new Promise(resolve => setTimeout(resolve, 150));
    
    return {
      characterId,
      availablePieces: [],
      buildingProgress: 0,
      maxProgress: 100,
      boatCompleted: false,
      finalBoatStats: {
        seaworthiness: 0,
        speed: 0,
        durability: 0,
        specialFeatures: []
      }
    };
  },

  async addPiece(characterId: string, piece: BoatPiece): Promise<BoatBuildingProgress> {
    console.log('Adding boat piece:', { characterId, piece });
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Mock piece addition
    return {
      characterId,
      availablePieces: [piece],
      buildingProgress: 10,
      maxProgress: 100,
      boatCompleted: false,
      finalBoatStats: { seaworthiness: 0, speed: 0, durability: 0, specialFeatures: [] }
    };
  },

  async startBuilding(characterId: string, blueprintId: string): Promise<BoatBuildingProgress> {
    console.log('Starting boat building:', { characterId, blueprintId });
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Mock building start
    return {
      characterId,
      availablePieces: [],
      buildingProgress: 5,
      maxProgress: 100,
      boatCompleted: false,
      finalBoatStats: { seaworthiness: 0, speed: 0, durability: 0, specialFeatures: [] }
    };
  },

  async completeBoat(characterId: string): Promise<BoatBuildingProgress> {
    console.log('Completing boat for:', characterId);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock boat completion
    return {
      characterId,
      availablePieces: [],
      buildingProgress: 100,
      maxProgress: 100,
      boatCompleted: true,
      completedAt: new Date().toISOString(),
      finalBoatStats: {
        seaworthiness: 85,
        speed: 70,
        durability: 90,
        specialFeatures: ['storm_resistant', 'swift_sailing']
      }
    };
  }
};

// ===== LABYRINTH PROGRESSION SYSTEM =====

export interface LabyrinthChamber {
  id: string;
  name: string;
  description: string;
  chamberType: 'puzzle' | 'combat' | 'story' | 'treasure' | 'aging';
  difficulty: number;
  ageIncrease: number; // Years aged upon completion
  completed: boolean;
  completedAt?: string;
  rewards: {
    experience: number;
    statGrowth: Record<string, number>;
    items: string[];
    knowledge: string[];
  };
  puzzleData?: {
    type: 'riddle' | 'logic' | 'memory' | 'dexterity';
    attempts: number;
    maxAttempts: number;
    hint?: string;
  };
}

export interface LabyrinthProgress {
  characterId: string;
  currentChamber: number;
  chambersCompleted: LabyrinthChamber[];
  totalChambers: number;
  yearsAged: number;
  labyrinthCompleted: boolean;
  completedAt?: string;
  finalAge: number;
  wisdomGained: number;
  secretsUnlocked: string[];
}

export const labyrinthAPI = {
  async getProgress(characterId: string): Promise<LabyrinthProgress> {
    console.log('Getting labyrinth progress for:', characterId);
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return {
      characterId,
      currentChamber: 0,
      chambersCompleted: [],
      totalChambers: 100,
      yearsAged: 0,
      labyrinthCompleted: false,
      finalAge: 15, // Starting age
      wisdomGained: 0,
      secretsUnlocked: []
    };
  },

  async enterChamber(characterId: string, chamberId: string): Promise<LabyrinthChamber> {
    console.log('Entering labyrinth chamber:', { characterId, chamberId });
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const mockChamber: LabyrinthChamber = {
      id: chamberId,
      name: 'Chamber of Echoes',
      description: 'A mysterious chamber where your voice returns changed, carrying whispers of forgotten truths.',
      chamberType: 'puzzle',
      difficulty: 3,
      ageIncrease: 1,
      completed: false,
      rewards: {
        experience: 150,
        statGrowth: { mind: 1, heart: 1 },
        items: ['echo_crystal'],
        knowledge: ['ancient_language_basics']
      },
      puzzleData: {
        type: 'riddle',
        attempts: 0,
        maxAttempts: 3,
        hint: 'Listen not to what is said, but to what is meant'
      }
    };
    
    return mockChamber;
  },

  async completeChamber(characterId: string, chamberId: string, solution?: any): Promise<LabyrinthChamber> {
    console.log('Completing labyrinth chamber:', { characterId, chamberId, solution });
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock chamber completion
    const completedChamber: LabyrinthChamber = {
      id: chamberId,
      name: 'Completed Chamber',
      description: 'This chamber has been conquered',
      chamberType: 'puzzle',
      difficulty: 3,
      ageIncrease: 1,
      completed: true,
      completedAt: new Date().toISOString(),
      rewards: {
        experience: 150,
        statGrowth: { mind: 1 },
        items: [],
        knowledge: []
      }
    };
    
    return completedChamber;
  },

  async ageCharacter(characterId: string, years: number): Promise<{ newAge: number; statChanges: Record<string, number> }> {
    console.log('Aging character in labyrinth:', { characterId, years });
    await new Promise(resolve => setTimeout(resolve, 150));
    
    // Mock aging with stat changes
    return {
      newAge: 16 + years,
      statChanges: {
        body: years > 10 ? -1 : 0,
        mind: Math.floor(years / 2),
        heart: Math.floor(years / 3)
      }
    };
  },

  async unlockSecret(characterId: string, secretId: string): Promise<void> {
    console.log('Unlocking labyrinth secret:', { characterId, secretId });
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Mock secret unlock
  }
};

const specialMechanics = { demonAPI, boatAPI, labyrinthAPI };
export default specialMechanics;