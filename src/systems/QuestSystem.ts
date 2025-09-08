// Quest System Implementation
// Manages quests, objectives, and quest chains throughout the game

export interface QuestRequirements {
  level?: number;
  stats?: { [key: string]: number };
  items?: string[];
  completedQuests?: string[];
  reputation?: { [faction: string]: number };
  moralAlignment?: {
    good?: number;
    evil?: number;
    lawful?: number;
    chaotic?: number;
  };
}

export interface QuestObjective {
  id: string;
  description: string;
  type: 'kill' | 'collect' | 'deliver' | 'talk' | 'explore' | 'survive' | 'solve';
  target?: string;
  quantity?: number;
  currentProgress: number;
  completed: boolean;
  optional: boolean;
  hidden: boolean; // Not shown to player initially
}

export interface QuestReward {
  type: 'experience' | 'gold' | 'item' | 'reputation' | 'stat' | 'skill' | 'unlock' | 'discount';
  value: number | string;
  quantity?: number;
}

export interface QuestConsequence {
  type: 'reputation' | 'relationship' | 'unlock' | 'lock' | 'stat' | 'story';
  value: number | string;
  target?: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'main' | 'side' | 'faction' | 'personal' | 'chain';
  status: 'available' | 'active' | 'completed' | 'failed' | 'abandoned';
  priority: 'low' | 'medium' | 'high' | 'critical';
  giver?: string; // NPC ID
  location?: string;
  requirements?: QuestRequirements;
  objectives: QuestObjective[];
  rewards: QuestReward[];
  consequences?: QuestConsequence[];
  timeLimit?: number; // milliseconds
  chainQuests?: string[]; // Follow-up quest IDs
}

export interface Character {
  level: number;
  stats: { [key: string]: number };
  inventory: string[];
  activeQuests: string[];
  completedQuests: string[];
  failedQuests: string[];
  reputation: { [faction: string]: number };
  moralAlignment: {
    good: number;
    evil: number;
    lawful: number;
    chaotic: number;
  };
  experience: number;
  gold: number;
}

export interface QuestChain {
  id: string;
  name: string;
  description: string;
  quests: string[]; // Quest IDs in order
  currentQuestIndex: number;
  rewards: QuestReward[]; // Chain completion rewards
  completed: boolean;
}

export interface Faction {
  id: string;
  name: string;
  description: string;
  quests: string[]; // Available faction quests
  conflictsWith?: string[]; // Faction IDs that conflict with this one
  benefits: { [reputationLevel: number]: QuestReward[] };
}

export class QuestSystem {
  private quests: Map<string, Quest> = new Map();
  private questChains: Map<string, QuestChain> = new Map();
  private factions: Map<string, Faction> = new Map();
  private availableQuests: Set<string> = new Set();
  private timedQuests: Map<string, number> = new Map();

  constructor() {
    this.initializeQuests();
    this.initializeFactions();
  }

  private initializeQuests(): void {
    // Initialize sample quests
    const sampleQuest: Quest = {
      id: 'boat_materials',
      title: 'Gather Boat Materials',
      description: 'Collect the materials needed to build a boat',
      type: 'main',
      status: 'available',
      priority: 'critical',
      giver: 'village_elder',
      location: 'starting-town',
      objectives: [
        {
          id: 'collect_wood',
          description: 'Collect 10 pieces of driftwood',
          type: 'collect',
          target: 'driftwood',
          quantity: 10,
          currentProgress: 0,
          completed: false,
          optional: false,
          hidden: false
        },
        {
          id: 'collect_cloth',
          description: 'Find sailcloth from the old ship',
          type: 'collect',
          target: 'sailcloth',
          quantity: 1,
          currentProgress: 0,
          completed: false,
          optional: false,
          hidden: false
        }
      ],
      rewards: [
        { type: 'experience', value: 100 },
        { type: 'unlock', value: 'sea_travel' }
      ]
    };

    this.quests.set(sampleQuest.id, sampleQuest);
    this.availableQuests.add(sampleQuest.id);
  }

  private initializeFactions(): void {
    // Initialize sample factions
    const mysticsFaction: Faction = {
      id: 'mystics_guild',
      name: 'Mystics Guild',
      description: 'A secretive organization of magic users',
      quests: ['learn_ancient_magic', 'retrieve_artifacts'],
      conflictsWith: ['templars_order'],
      benefits: {
        25: [{ type: 'skill', value: 'basic_magic' }],
        50: [{ type: 'item', value: 'mystic_robes' }],
        75: [{ type: 'unlock', value: 'advanced_spells' }]
      }
    };

    const philosophersFaction: Faction = {
      id: 'philosophers_guild',
      name: 'Guild of Philosophers',
      description: 'Seekers of truth and wisdom',
      quests: ['philosophy_initiation', 'logic_mastery', 'truth_seeker'],
      conflictsWith: ['warriors_guild'],
      benefits: {
        25: [{ type: 'discount', value: 0.1 }],
        50: [{ type: 'skill', value: 'advanced_reasoning' }]
      }
    };

    this.factions.set(mysticsFaction.id, mysticsFaction);
    this.factions.set(philosophersFaction.id, philosophersFaction);
  }

  public createQuest(questData: Partial<Quest>): Quest {
    const quest: Quest = {
      id: questData.id || this.generateQuestId(),
      title: questData.title || 'Untitled Quest',
      description: questData.description || '',
      type: questData.type || 'side',
      status: 'available',
      priority: questData.priority || 'medium',
      giver: questData.giver,
      location: questData.location,
      requirements: questData.requirements,
      objectives: questData.objectives || [],
      rewards: questData.rewards || [],
      consequences: questData.consequences,
      timeLimit: questData.timeLimit,
      chainQuests: questData.chainQuests
    };

    this.quests.set(quest.id, quest);
    this.availableQuests.add(quest.id);
    return quest;
  }

  private generateQuestId(): string {
    return `quest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  public getAvailableQuests(character: Character): Quest[] {
    const available: Quest[] = [];

    for (const questId of Array.from(this.availableQuests)) {
      const quest = this.quests.get(questId);
      if (quest && this.validateQuestRequirements(quest, character)) {
        available.push(quest);
      }
    }

    return available.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  private validateQuestRequirements(quest: Quest, character: Character): boolean {
    if (!quest.requirements) {
      return true;
    }

    const req = quest.requirements;

    // Check level requirement
    if (req.level && character.level < req.level) {
      return false;
    }

    // Check stat requirements
    if (req.stats) {
      for (const [stat, requiredValue] of Object.entries(req.stats)) {
        if (character.stats[stat] < requiredValue) {
          return false;
        }
      }
    }

    // Check item requirements
    if (req.items) {
      for (const item of req.items) {
        if (!character.inventory.includes(item)) {
          return false;
        }
      }
    }

    // Check completed quest requirements
    if (req.completedQuests) {
      for (const questId of req.completedQuests) {
        if (!character.completedQuests.includes(questId)) {
          return false;
        }
      }
    }

    // Check reputation requirements
    if (req.reputation) {
      for (const [faction, requiredRep] of Object.entries(req.reputation)) {
        if ((character.reputation[faction] || 0) < requiredRep) {
          return false;
        }
      }
    }

    // Check moral alignment requirements
    if (req.moralAlignment) {
      for (const [alignment, requiredValue] of Object.entries(req.moralAlignment)) {
        if (character.moralAlignment[alignment as keyof typeof character.moralAlignment] < requiredValue) {
          return false;
        }
      }
    }

    return true;
  }

  public acceptQuest(questId: string, character: Character): boolean {
    const quest = this.quests.get(questId);
    if (!quest || quest.status !== 'available' || !this.validateQuestRequirements(quest, character)) {
      return false;
    }

    quest.status = 'active';
    character.activeQuests.push(questId);
    this.availableQuests.delete(questId);

    // Start timer for timed quests
    if (quest.timeLimit) {
      this.timedQuests.set(questId, Date.now() + quest.timeLimit);
    }

    return true;
  }

  public updateQuestProgress(questId: string, objectiveId: string, progress: number): void {
    const quest = this.quests.get(questId);
    if (!quest || quest.status !== 'active') {
      return;
    }

    const objective = quest.objectives.find(obj => obj.id === objectiveId);
    if (!objective) {
      return;
    }

    objective.currentProgress = Math.min(objective.quantity || 1, objective.currentProgress + progress);

    if (objective.currentProgress >= (objective.quantity || 1)) {
      objective.completed = true;
    }

    // Check if quest is complete
    this.checkQuestCompletion(questId);
  }

  private checkQuestCompletion(questId: string): void {
    const quest = this.quests.get(questId);
    if (!quest) return;

    const requiredObjectives = quest.objectives.filter(obj => !obj.optional);
    const completedRequired = requiredObjectives.filter(obj => obj.completed);

    if (completedRequired.length === requiredObjectives.length) {
      this.completeQuest(questId);
    }
  }

  public completeQuest(questId: string): { rewards: QuestReward[], chainQuests: Quest[] } {
    const quest = this.quests.get(questId);
    if (!quest || quest.status !== 'active') {
      return { rewards: [], chainQuests: [] };
    }

    quest.status = 'completed';
    this.timedQuests.delete(questId);

    // Check for quest chains
    const chainQuests: Quest[] = [];
    if (quest.chainQuests) {
      for (const chainQuestId of quest.chainQuests) {
        const chainQuest = this.quests.get(chainQuestId);
        if (chainQuest) {
          chainQuest.status = 'available';
          this.availableQuests.add(chainQuestId);
          chainQuests.push(chainQuest);
        }
      }
    }

    return { rewards: quest.rewards, chainQuests };
  }

  public handleQuestFailure(questId: string): QuestConsequence[] {
    const quest = this.quests.get(questId);
    if (!quest) {
      return [];
    }

    quest.status = 'failed';
    this.timedQuests.delete(questId);

    return quest.consequences || [];
  }

  public createQuestChain(chainData: Partial<QuestChain>): QuestChain {
    const chain: QuestChain = {
      id: chainData.id || this.generateQuestId(),
      name: chainData.name || 'Unnamed Chain',
      description: chainData.description || '',
      quests: chainData.quests || [],
      currentQuestIndex: 0,
      rewards: chainData.rewards || [],
      completed: false
    };

    this.questChains.set(chain.id, chain);
    return chain;
  }

  public progressQuestChain(chainId: string): Quest | null {
    const chain = this.questChains.get(chainId);
    if (!chain || chain.completed) {
      return null;
    }

    chain.currentQuestIndex++;

    if (chain.currentQuestIndex >= chain.quests.length) {
      chain.completed = true;
      return null;
    }

    const nextQuestId = chain.quests[chain.currentQuestIndex];
    const nextQuest = this.quests.get(nextQuestId);

    if (nextQuest) {
      nextQuest.status = 'available';
      this.availableQuests.add(nextQuestId);
    }

    return nextQuest || null;
  }

  public getFactionQuests(factionId: string, character: Character): Quest[] {
    const faction = this.factions.get(factionId);
    if (!faction) {
      return [];
    }

    return faction.quests
      .map(questId => this.quests.get(questId))
      .filter((quest): quest is Quest => quest !== undefined && this.validateQuestRequirements(quest, character));
  }

  public checkFactionConflicts(factionId: string, character: Character): string[] {
    const faction = this.factions.get(factionId);
    if (!faction || !faction.conflictsWith) {
      return [];
    }

    const conflicts: string[] = [];
    for (const conflictFactionId of faction.conflictsWith) {
      const reputation = character.reputation[conflictFactionId] || 0;
      if (reputation > 0) {
        conflicts.push(conflictFactionId);
      }
    }

    return conflicts;
  }

  public applyFactionBenefits(factionId: string, reputation: number): QuestReward[] {
    const faction = this.factions.get(factionId);
    if (!faction) {
      return [];
    }

    const benefits: QuestReward[] = [];
    for (const [level, rewards] of Object.entries(faction.benefits)) {
      if (reputation >= parseInt(level)) {
        benefits.push(...rewards);
      }
    }

    return benefits;
  }

  public generateDynamicQuest(worldState: any, character: Character): Quest | null {
    // Generate dynamic quests based on current world state
    const dynamicQuestTypes = [
      'merchant_escort',
      'monster_hunt',
      'resource_gathering',
      'exploration_survey'
    ];

    const questType = dynamicQuestTypes[Math.floor(Math.random() * dynamicQuestTypes.length)];

    switch (questType) {
      case 'monster_hunt':
        return this.createQuest({
          title: 'Monster Hunt',
          description: 'A dangerous creature has been spotted nearby',
          type: 'side',
          priority: 'medium',
          objectives: [
            {
              id: 'hunt_monster',
              description: 'Defeat the creature',
              type: 'kill',
              target: 'forest_beast',
              quantity: 1,
              currentProgress: 0,
              completed: false,
              optional: false,
              hidden: false
            }
          ],
          rewards: [
            { type: 'experience', value: 50 + character.level * 10 },
            { type: 'gold', value: 25 + character.level * 5 }
          ],
          timeLimit: 24 * 60 * 60 * 1000 // 24 hours
        });

      default:
        return null;
    }
  }

  public getQuestHistory(character: Character): { completed: Quest[], failed: Quest[] } {
    const completed = character.completedQuests
      .map(id => this.quests.get(id))
      .filter((quest): quest is Quest => quest !== undefined);

    const failed = character.failedQuests
      .map(id => this.quests.get(id))
      .filter((quest): quest is Quest => quest !== undefined);

    return { completed, failed };
  }

  public checkTimedQuests(): string[] {
    const expiredQuests: string[] = [];
    const now = Date.now();

    for (const [questId, expireTime] of Array.from(this.timedQuests.entries())) {
      if (now >= expireTime) {
        this.handleQuestFailure(questId);
        expiredQuests.push(questId);
      }
    }

    return expiredQuests;
  }

  public getActiveQuests(character: Character): Quest[] {
    return character.activeQuests
      .map(id => this.quests.get(id))
      .filter((quest): quest is Quest => quest !== undefined && quest.status === 'active');
  }
}

// Export singleton instance
export const questSystem = new QuestSystem();