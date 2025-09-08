// Labyrinth System - Massive labyrinth with aging mechanics, puzzles, and reality-bending rooms
// Implements progressive difficulty, mythical creatures, philosophical challenges, and character transformation

// ===== INTERFACES =====

export interface Labyrinth {
  id: string;
  name: string;
  description: string;
  totalChambers: number;
  currentChamber: number;
  isOpen: boolean;
  lastOpenedDate?: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'nightmare';
  chambers: Chamber[];
  globalEffects: GlobalEffect[];
}

export interface Chamber {
  id: string;
  number: number;
  name: string;
  description: string;
  type: 'puzzle' | 'combat' | 'trial' | 'rest' | 'special';
  difficulty: number; // 1-10, increases with chamber number
  agingEffect: AgingEffect;
  challenge: Challenge;
  rewards: ChamberReward[];
  connections: string[]; // Connected chamber IDs
  completed: boolean;
  attempts: number;
}

export interface AgingEffect {
  yearsAdded: number;
  statChanges: {
    body?: number;
    mind?: number;
    heart?: number;
    wisdom?: number;
  };
  description: string;
  irreversible: boolean;
}

export interface Challenge {
  type: 'logic_puzzle' | 'riddle' | 'combat' | 'moral_choice' | 'skill_test' | 'endurance';
  description: string;
  requirements?: {
    stats?: { [key: string]: number };
    items?: string[];
    knowledge?: string[];
  };
  solutions: Solution[];
  timeLimit?: number;
  attempts: number;
  maxAttempts?: number;
}

export interface Solution {
  id: string;
  description: string;
  requirements?: string[];
  successRate: number;
  rewards: string[];
  consequences?: string[];
}

export interface ChamberReward {
  type: 'item' | 'knowledge' | 'stat' | 'ability' | 'lore';
  value: string | number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  description: string;
}

export interface GlobalEffect {
  type: 'aging_acceleration' | 'wisdom_gain' | 'isolation_stress' | 'ancient_knowledge';
  description: string;
  value: number;
  cumulative: boolean;
}

export interface Character {
  age: number;
  level: number;
  stats: {
    body: number;
    mind: number;
    heart: number;
    wisdom: number;
    experience: number;
  };
  knownFallacies: string[];
  knownParadoxes: string[];
  inventory: string[];
  mentalState: {
    sanity: number;
    determination: number;
    homesickness: number;
  };
  labyrinthProgress: {
    chambersCompleted: number;
    totalTimeSpent: number;
    yearsAged: number;
    knowledgeGained: string[];
  };
}

export interface MythicalCreature {
  id: string;
  name: string;
  description: string;
  type: 'guardian' | 'wanderer' | 'trickster' | 'ancient' | 'corrupted';
  level: number;
  stats: {
    health: number;
    attack: number;
    defense: number;
    intelligence: number;
    wisdom: number;
  };
  abilities: string[];
  weaknesses: string[];
  philosophy?: string[];
  dialogue?: string[];
}

export interface ImpossibleRoom {
  id: string;
  name: string;
  description: string;
  impossibility: 'physics_defying' | 'space_warping' | 'time_distorting' | 'reality_bending';
  visualDescription: string;
  challenges: string[];
  hiddenSecrets: string[];
  psychologicalEffect: string;
}

// ===== LABYRINTH SYSTEM =====

export class LabyrinthSystem {
  private labyrinth: Labyrinth;
  private mythicalCreatures: MythicalCreature[];
  private impossibleRooms: ImpossibleRoom[];
  private character: Character;

  constructor() {
    this.labyrinth = this.createGreatLabyrinth();
    this.mythicalCreatures = this.createMythicalCreatures();
    this.impossibleRooms = this.createImpossibleRooms();
    this.character = this.createInitialCharacter();
  }

  // ===== LABYRINTH CREATION =====

  private createGreatLabyrinth(): Labyrinth {
    return {
      id: 'the_great_labyrinth',
      name: 'The Great Labyrinth',
      description: 'An ancient maze that spans continents, filled with impossible architecture',
      totalChambers: 365, // One year of aging
      currentChamber: 0,
      isOpen: true,
      lastOpenedDate: Date.now(),
      difficulty: 'nightmare',
      chambers: this.generateChambers(),
      globalEffects: [
        {
          type: 'aging_acceleration',
          description: 'Each chamber ages the traveler by one year',
          value: 1,
          cumulative: true
        },
        {
          type: 'wisdom_gain',
          description: 'Ancient knowledge seeps into the mind',
          value: 2,
          cumulative: true
        },
        {
          type: 'isolation_stress',
          description: 'The endless maze wears on the psyche',
          value: -1,
          cumulative: true
        }
      ]
    };
  }

  private generateChambers(): Chamber[] {
    const chambers: Chamber[] = [];
    
    for (let i = 1; i <= 365; i++) {
      chambers.push(this.createChamber(i));
    }
    
    return chambers;
  }

  private createChamber(number: number): Chamber {
    const difficulty = Math.min(Math.floor(number / 36.5) + 1, 10); // Scale 1-10 over 365 chambers
    const types: Array<'puzzle' | 'combat' | 'trial' | 'rest' | 'special'> = ['puzzle', 'combat', 'trial', 'rest', 'special'];
    const type = types[Math.floor(Math.random() * types.length)];

    return {
      id: `chamber_${number.toString().padStart(3, '0')}`,
      number,
      name: this.generateChamberName(number, type),
      description: this.generateChamberDescription(number, type),
      type,
      difficulty,
      agingEffect: this.createAgingEffect(number),
      challenge: this.createChallenge(number, type, difficulty),
      rewards: this.generateRewards(difficulty),
      connections: this.generateConnections(number),
      completed: false,
      attempts: 0
    };
  }

  private generateChamberName(number: number, type: string): string {
    const prefixes = ['The Ancient', 'The Forgotten', 'The Eternal', 'The Hidden', 'The Mysterious'];
    const suffixes = {
      puzzle: ['Riddle Chamber', 'Logic Hall', 'Mind Maze', 'Paradox Room'],
      combat: ['Trial Arena', 'Combat Hall', 'Warrior\'s Test', 'Battle Chamber'],
      trial: ['Testing Grounds', 'Trial Chamber', 'Endurance Hall', 'Judgment Room'],
      rest: ['Sanctuary', 'Rest Chamber', 'Peaceful Hall', 'Recovery Room'],
      special: ['Wonder Chamber', 'Impossible Room', 'Reality Nexus', 'Dimensional Rift']
    };
    
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[type as keyof typeof suffixes][Math.floor(Math.random() * suffixes[type as keyof typeof suffixes].length)];
    
    return `${prefix} ${suffix} #${number}`;
  }

  private generateChamberDescription(number: number, type: string): string {
    const descriptions = {
      puzzle: 'Ancient runes glow faintly on weathered stone walls, forming complex patterns that challenge the mind',
      combat: 'The chamber echoes with the sounds of past battles, weapons and armor scattered across the floor',
      trial: 'This chamber tests not just strength, but character, with obstacles that mirror inner struggles',
      rest: 'A peaceful sanctuary where time seems to slow, offering respite from the labyrinth\'s trials',
      special: 'Reality bends and warps in this impossible space, defying all natural laws'
    };
    
    return descriptions[type as keyof typeof descriptions] || 'A mysterious chamber that defies easy description';
  }

  private createAgingEffect(number: number): AgingEffect {
    const baseStatChange = Math.floor(number / 100); // Increases every 100 chambers
    
    return {
      yearsAdded: 1,
      statChanges: {
        mind: 1 + baseStatChange,
        wisdom: 2 + baseStatChange,
        body: number < 200 ? 0 : -Math.floor((number - 200) / 100) // Body starts declining after chamber 200
      },
      description: 'The weight of time and knowledge settles upon your shoulders',
      irreversible: true
    };
  }

  private createChallenge(number: number, type: string, difficulty: number): Challenge {
    const challengeTypes: Array<Challenge['type']> = ['logic_puzzle', 'riddle', 'combat', 'moral_choice', 'skill_test', 'endurance'];
    const challengeType = type === 'puzzle' ? 'logic_puzzle' : 
                         type === 'combat' ? 'combat' :
                         challengeTypes[Math.floor(Math.random() * challengeTypes.length)];

    const challenges = {
      logic_puzzle: {
        description: 'A complex logical puzzle requiring advanced reasoning',
        solutions: [
          {
            id: 'logical_solution',
            description: 'Solve using pure logic',
            successRate: Math.max(0.1, 1 - (difficulty * 0.1)),
            rewards: ['logical_insight', 'wisdom_increase']
          }
        ]
      },
      riddle: {
        description: 'An ancient riddle that tests wisdom and insight',
        solutions: [
          {
            id: 'correct_answer',
            description: 'Provide the correct answer',
            successRate: Math.max(0.2, 1 - (difficulty * 0.08)),
            rewards: ['ancient_knowledge', 'mind_increase']
          }
        ]
      },
      combat: {
        description: 'Face a powerful opponent in battle',
        solutions: [
          {
            id: 'defeat_opponent',
            description: 'Win through combat',
            successRate: Math.max(0.3, 1 - (difficulty * 0.07)),
            rewards: ['combat_experience', 'body_increase']
          }
        ]
      },
      moral_choice: {
        description: 'A moral dilemma with no clear right answer',
        solutions: [
          {
            id: 'moral_solution',
            description: 'Make a principled choice',
            successRate: 0.8,
            rewards: ['moral_strength', 'heart_increase']
          }
        ]
      },
      skill_test: {
        description: 'A test of specific skills and knowledge',
        solutions: [
          {
            id: 'skill_success',
            description: 'Use your skills effectively',
            successRate: Math.max(0.4, 1 - (difficulty * 0.06)),
            rewards: ['skill_improvement', 'experience_gain']
          }
        ]
      },
      endurance: {
        description: 'A test of physical and mental endurance',
        solutions: [
          {
            id: 'endure',
            description: 'Persevere through the trial',
            successRate: Math.max(0.5, 1 - (difficulty * 0.05)),
            rewards: ['endurance_boost', 'determination_increase']
          }
        ]
      }
    };

    const challenge = challenges[challengeType];

    return {
      type: challengeType,
      description: challenge.description,
      requirements: difficulty > 5 ? { stats: { mind: difficulty * 2 } } : undefined,
      solutions: challenge.solutions,
      timeLimit: challengeType === 'logic_puzzle' ? 1800000 : undefined, // 30 minutes for logic puzzles
      attempts: 0,
      maxAttempts: Math.max(1, 5 - Math.floor(difficulty / 2))
    };
  }

  private generateRewards(difficulty: number): ChamberReward[] {
    const rewards: ChamberReward[] = [];
    const numRewards = Math.min(1 + Math.floor(difficulty / 3), 3);
    
    for (let i = 0; i < numRewards; i++) {
      const types: Array<ChamberReward['type']> = ['item', 'knowledge', 'stat', 'ability', 'lore'];
      const rarities: Array<ChamberReward['rarity']> = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
      
      rewards.push({
        type: types[Math.floor(Math.random() * types.length)],
        value: `reward_${difficulty}_${i}`,
        rarity: rarities[Math.min(Math.floor(difficulty / 2), rarities.length - 1)],
        description: `A reward of ${rarities[Math.min(Math.floor(difficulty / 2), rarities.length - 1)]} quality`
      });
    }
    
    return rewards;
  }

  private generateConnections(number: number): string[] {
    const connections = [`chamber_${(number + 1).toString().padStart(3, '0')}`];
    
    // Add some branching paths
    if (number % 10 === 0 && number < 365) {
      connections.push(`secret_chamber_${number}a`);
    }
    
    return connections;
  }

  // ===== MYTHICAL CREATURES =====

  private createMythicalCreatures(): MythicalCreature[] {
    return [
      {
        id: 'ancient_sphinx',
        name: 'The Eternal Sphinx',
        description: 'A being of ancient wisdom who guards the deeper chambers',
        type: 'guardian',
        level: 15,
        stats: { health: 300, attack: 25, defense: 30, intelligence: 40, wisdom: 50 },
        abilities: ['riddle_challenge', 'wisdom_drain', 'ancient_knowledge'],
        weaknesses: ['logical_fallacies', 'paradox_confusion'],
        philosophy: ['truth_seeking', 'knowledge_testing', 'wisdom_guardianship'],
        dialogue: ['What is the nature of truth?', 'Prove your wisdom, young seeker']
      },
      {
        id: 'maze_minotaur',
        name: 'The Lost Minotaur',
        description: 'A powerful creature forever wandering the endless passages',
        type: 'wanderer',
        level: 12,
        stats: { health: 400, attack: 35, defense: 25, intelligence: 15, wisdom: 20 },
        abilities: ['charge_attack', 'labyrinth_knowledge', 'berserker_rage'],
        weaknesses: ['logic_puzzles', 'peaceful_dialogue'],
        dialogue: ['I have wandered these halls for centuries...', 'Do you seek to escape as I do?']
      },
      {
        id: 'wise_owl_spirit',
        name: 'Athena\'s Messenger',
        description: 'An ethereal owl that speaks in ancient wisdom',
        type: 'ancient',
        level: 20,
        stats: { health: 150, attack: 15, defense: 20, intelligence: 45, wisdom: 60 },
        abilities: ['wisdom_sharing', 'philosophical_debate', 'knowledge_test'],
        weaknesses: ['impatience', 'disrespect_for_knowledge'],
        philosophy: ['socratic_method', 'knowledge_through_questioning', 'wisdom_over_knowledge'],
        dialogue: [
          'What do you truly know, young seeker?',
          'Is it better to know that you know nothing, or to think you know everything?',
          'The unexamined life is not worth living - do you examine yours?'
        ]
      },
      {
        id: 'learning_construct',
        name: 'The Adaptive Guardian',
        description: 'A magical construct that learns from each encounter',
        type: 'guardian',
        level: 10,
        stats: { health: 200, attack: 20, defense: 25, intelligence: 30, wisdom: 25 },
        abilities: ['pattern_recognition', 'counter_strategy', 'adaptive_learning'],
        weaknesses: [],
        philosophy: ['continuous_learning', 'adaptation_through_experience']
      },
      {
        id: 'tormented_demon',
        name: 'Tormented Demon',
        description: 'A demon trapped in eternal suffering, seeking understanding',
        type: 'corrupted',
        level: 18,
        stats: { health: 350, attack: 30, defense: 20, intelligence: 25, wisdom: 15 },
        abilities: ['emotional_manipulation', 'despair_aura', 'rage_incarnate'],
        weaknesses: ['empathy', 'logical_arguments', 'compassion'],
        dialogue: ['Why must I suffer for eternity?', 'Can you understand my pain?']
      }
    ];
  }

  // ===== IMPOSSIBLE ROOMS =====

  private createImpossibleRooms(): ImpossibleRoom[] {
    return [
      {
        id: 'upside_down_tree_room',
        name: 'The Inverted Grove',
        description: 'A vast white chamber where a single enormous tree grows from the ceiling, its roots reaching toward the sky',
        impossibility: 'physics_defying',
        visualDescription: 'Everything is pristine white except for the massive tree suspended above, its leaves rustling despite no wind',
        challenges: ['gravity_puzzle', 'root_climbing', 'leaf_message_decoding'],
        hiddenSecrets: ['tree_spirit_dialogue', 'root_system_map', 'ancient_seed'],
        psychologicalEffect: 'disorientation_and_wonder'
      },
      {
        id: 'infinite_staircase',
        name: 'Penrose Steps',
        description: 'A staircase that continuously ascends yet somehow leads back to itself',
        impossibility: 'space_warping',
        visualDescription: 'Stone steps that seem to climb forever, yet walking them brings you back to where you started',
        challenges: ['spatial_reasoning', 'break_the_loop', 'find_hidden_exit'],
        hiddenSecrets: ['dimensional_key', 'space_manipulation_knowledge'],
        psychologicalEffect: 'frustration_then_enlightenment'
      },
      {
        id: 'mirror_dimension_chamber',
        name: 'The Reflection Paradox',
        description: 'A room where reflections act independently of their sources',
        impossibility: 'reality_bending',
        visualDescription: 'Mirrors line every surface, but the reflections show different scenes, different versions of yourself',
        challenges: ['true_self_identification', 'mirror_navigation', 'reflection_dialogue'],
        hiddenSecrets: ['alternate_timeline_knowledge', 'self_understanding'],
        psychologicalEffect: 'identity_questioning'
      },
      {
        id: 'ship_of_theseus_chamber',
        name: 'The Chamber of Identity',
        description: 'A room that slowly replaces parts of itself - and you - with identical copies',
        impossibility: 'reality_bending',
        visualDescription: 'As you watch, pieces of the room fade and are replaced by identical pieces. You feel the same happening to yourself.',
        challenges: [
          'maintain_identity_while_changing',
          'philosophical_debate_with_copies',
          'choose_original_vs_copy'
        ],
        hiddenSecrets: ['identity_paradox_mastery', 'continuity_of_self_understanding'],
        psychologicalEffect: 'existential_questioning'
      },
      {
        id: 'temporal_loop_chamber',
        name: 'The Eternal Moment',
        description: 'A room where the same moment repeats endlessly until you find the key to break free',
        impossibility: 'time_distorting',
        visualDescription: 'A candle flickers and resets, a drop of water falls and returns, voices echo the same words',
        challenges: [
          'break_temporal_loop',
          'learn_from_repetition',
          'find_the_change_that_matters'
        ],
        hiddenSecrets: ['time_manipulation_basics', 'causality_understanding'],
        psychologicalEffect: 'patience_and_observation_mastery'
      }
    ];
  }

  // ===== CHARACTER CREATION =====

  private createInitialCharacter(): Character {
    return {
      age: 16,
      level: 3,
      stats: {
        body: 12,
        mind: 10,
        heart: 8,
        wisdom: 5,
        experience: 500
      },
      knownFallacies: ['ad_hominem'],
      knownParadoxes: [],
      inventory: ['basic_supplies'],
      mentalState: {
        sanity: 100,
        determination: 80,
        homesickness: 20
      },
      labyrinthProgress: {
        chambersCompleted: 0,
        totalTimeSpent: 0,
        yearsAged: 0,
        knowledgeGained: []
      }
    };
  }

  // ===== UTILITY METHODS =====

  public getLabyrinth(): Labyrinth {
    return this.labyrinth;
  }

  public getMythicalCreatures(): MythicalCreature[] {
    return this.mythicalCreatures;
  }

  public getImpossibleRooms(): ImpossibleRoom[] {
    return this.impossibleRooms;
  }

  public getCharacter(): Character {
    return this.character;
  }

  public attemptChallenge(chamber: Chamber): Chamber {
    chamber.attempts += 1;
    return chamber;
  }

  public completeChallenge(chamber: Chamber): Chamber {
    chamber.completed = true;
    return chamber;
  }

  public applyAgingEffect(character: Character, agingEffect: AgingEffect): Character {
    const newCharacter = { ...character };
    newCharacter.age += agingEffect.yearsAdded;
    
    if (agingEffect.statChanges.body) {
      newCharacter.stats.body += agingEffect.statChanges.body;
    }
    if (agingEffect.statChanges.mind) {
      newCharacter.stats.mind += agingEffect.statChanges.mind;
    }
    if (agingEffect.statChanges.heart) {
      newCharacter.stats.heart += agingEffect.statChanges.heart;
    }
    
    newCharacter.labyrinthProgress.yearsAged += agingEffect.yearsAdded;
    
    return newCharacter;
  }

  public calculateAgingEffects(character: Character): AgingEffect {
    if (character.age <= 20) {
      return {
        yearsAdded: 1,
        statChanges: { mind: 3, heart: 1, wisdom: 1 },
        description: 'Youth learns quickly',
        irreversible: true
      };
    } else if (character.age <= 30) {
      return {
        yearsAdded: 1,
        statChanges: { mind: 2, heart: 2, wisdom: 2 },
        description: 'Young adulthood brings balance',
        irreversible: true
      };
    } else if (character.age <= 45) {
      return {
        yearsAdded: 1,
        statChanges: { mind: 1, heart: 3, wisdom: 3 },
        description: 'Maturity brings wisdom',
        irreversible: true
      };
    } else if (character.age <= 60) {
      return {
        yearsAdded: 1,
        statChanges: { body: -1, heart: 2, wisdom: 4 },
        description: 'Age brings wisdom but physical decline',
        irreversible: true
      };
    } else {
      return {
        yearsAdded: 1,
        statChanges: { body: -2, mind: -1, heart: 1, wisdom: 5 },
        description: 'Great age brings great wisdom',
        irreversible: true
      };
    }
  }

  public getAgeCategory(age: number): string {
    if (age <= 20) return '15-20';
    if (age <= 30) return '21-30';
    if (age <= 45) return '31-45';
    if (age <= 60) return '46-60';
    return '60+';
  }

  public applyLearning(creature: MythicalCreature, encounterHistory: any[]): MythicalCreature {
    const modifiedCreature = { ...creature };
    
    // Add counter-abilities based on successful player strategies
    const successfulStrategies = encounterHistory.filter(e => e.success).map(e => e.strategy);
    
    for (const strategy of successfulStrategies) {
      const counterAbility = `${strategy}_resistance`;
      if (!modifiedCreature.abilities.includes(counterAbility)) {
        modifiedCreature.abilities.push(counterAbility);
      }
    }
    
    return modifiedCreature;
  }

  // ===== LABYRINTH COMPLETION TRACKING =====

  public calculateCompletionProgress(): any {
    const completedChambers = this.character.labyrinthProgress.chambersCompleted;
    const totalChambers = this.labyrinth.totalChambers;
    
    return {
      totalChambers,
      completedChambers,
      currentDifficulty: Math.min(Math.floor(completedChambers / 36.5) + 1, 10),
      yearsAged: this.character.labyrinthProgress.yearsAged,
      knowledgeGained: this.character.labyrinthProgress.knowledgeGained.length,
      creaturesEncountered: Math.floor(completedChambers / 10),
      impossibleRoomsSolved: Math.floor(completedChambers / 30),
      completionPercentage: totalChambers > 0 ? Number(((completedChambers / totalChambers) * 100).toFixed(1)) : 0
    };
  }

  public getExitPaths(): any[] {
    return [
      {
        id: 'main_exit',
        name: 'The Grand Gates',
        description: 'The traditional exit leading directly to the empire\'s heart',
        requirements: ['complete_all_chambers'],
        rewards: ['full_labyrinth_mastery', 'emperor_recognition'],
        difficulty: 'standard'
      },
      {
        id: 'secret_passage',
        name: 'The Forgotten Way',
        description: 'An ancient passage known only to the wisest',
        requirements: ['wisdom_50', 'secret_knowledge', 'impossible_rooms_mastered'],
        rewards: ['hidden_empire_entrance', 'ancient_allies'],
        difficulty: 'expert'
      },
      {
        id: 'emergency_exit',
        name: 'The Desperate Escape',
        description: 'A dangerous shortcut for those who cannot complete the full journey',
        requirements: ['health_below_20', 'sanity_below_30'],
        rewards: ['survival', 'incomplete_transformation'],
        difficulty: 'survival'
      }
    ];
  }

  public transformCharacter(completionLevel: 'partial' | 'full'): Character {
    const transformedCharacter = { ...this.character };
    
    if (completionLevel === 'full') {
      // Full completion transformation
      transformedCharacter.age = 41; // 16 + 25 years
      transformedCharacter.level = 25;
      transformedCharacter.stats = {
        body: 18,
        mind: 40,
        heart: 35,
        wisdom: 60,
        experience: 15000
      };
      transformedCharacter.knownFallacies = [
        'ad_hominem', 'straw_man', 'false_dilemma', 'appeal_to_authority',
        'slippery_slope', 'circular_reasoning', 'red_herring'
      ];
      transformedCharacter.knownParadoxes = [
        'liar_paradox', 'ship_of_theseus', 'sorites_paradox', 'russell_paradox'
      ];
      transformedCharacter.inventory = ['ancient_artifacts', 'philosophical_insights', 'reality_manipulator'];
      transformedCharacter.mentalState = {
        sanity: 90,
        determination: 100,
        homesickness: 5
      };
      transformedCharacter.labyrinthProgress = {
        chambersCompleted: 365,
        totalTimeSpent: 365,
        yearsAged: 25,
        knowledgeGained: ['ancient_wisdom', 'reality_manipulation', 'creature_diplomacy', 'impossible_geometry']
      };
    } else {
      // Partial completion transformation
      transformedCharacter.age = 31; // 16 + 15 years
      transformedCharacter.level = 18;
      transformedCharacter.stats = {
        body: 15,
        mind: 28,
        heart: 22,
        wisdom: 35,
        experience: 8000
      };
      transformedCharacter.knownFallacies = ['ad_hominem', 'straw_man', 'false_dilemma'];
      transformedCharacter.knownParadoxes = ['liar_paradox', 'ship_of_theseus'];
      transformedCharacter.mentalState = {
        sanity: 85,
        determination: 85,
        homesickness: 15
      };
      transformedCharacter.labyrinthProgress = {
        chambersCompleted: 200,
        totalTimeSpent: 200,
        yearsAged: 15,
        knowledgeGained: ['ancient_wisdom', 'basic_reality_understanding']
      };
    }
    
    return transformedCharacter;
  }

  public unlockEmpireAccess(character: Character): any {
    const isFullCompletion = character.labyrinthProgress.chambersCompleted >= 365;
    
    return {
      status: 'completed',
      finalAge: character.age,
      wisdom: character.stats.wisdom,
      knowledgeGained: character.labyrinthProgress.knowledgeGained,
      achievements: [
        'labyrinth_master',
        'creature_diplomat',
        'impossible_room_solver',
        ...(isFullCompletion ? ['reality_transcendent'] : [])
      ],
      empireAccess: {
        granted: true,
        reputation: isFullCompletion ? 'legendary_traveler' : 'experienced_wanderer',
        specialPrivileges: [
          'council_recognition',
          isFullCompletion ? 'advanced_citizen_status' : 'citizen_status',
          ...(character.stats.wisdom >= 50 ? ['advisor_candidacy'] : [])
        ],
        questsUnlocked: [
          'empire_integration',
          isFullCompletion ? 'advisor_preparation' : 'citizen_orientation',
          'reality_studies'
        ]
      }
    };
  }
}

// ===== EXPORT DEFAULT =====

export default LabyrinthSystem;