// Random Encounter System Implementation
// Handles dynamic encounters throughout the game world

export interface EncounterCondition {
  type: 'location' | 'time' | 'weather' | 'character_state' | 'random';
  value: any;
  operator?: 'equals' | 'greater' | 'less' | 'contains';
}

export interface EncounterEffect {
  type: 'health' | 'mana' | 'experience' | 'item' | 'gold' | 'reputation' | 'quest' | 'stat';
  value: number | string;
  target?: string;
}

export interface EncounterOutcome {
  id: string;
  description: string;
  probability: number;
  requirements?: string[];
  effects: EncounterEffect[];
}

export interface Encounter {
  id: string;
  type: 'combat' | 'dialogue' | 'event' | 'treasure' | 'trap';
  name: string;
  description: string;
  probability: number;
  conditions?: EncounterCondition[];
  outcomes: EncounterOutcome[];
  requirements?: {
    level?: number;
    stats?: { [key: string]: number };
    items?: string[];
    quests?: string[];
  };
}

export interface Character {
  level: number;
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  stats: { [key: string]: number };
  inventory: string[];
  activeQuests: string[];
  completedQuests: string[];
  reputation: { [faction: string]: number };
  moralAlignment: {
    good: number;
    evil: number;
    lawful: number;
    chaotic: number;
  };
}

export interface DialogueOption {
  text: string;
  nextNodeId?: string;
  requirements?: string[];
  effects?: EncounterEffect[];
  moralAlignment?: {
    good?: number;
    evil?: number;
    lawful?: number;
    chaotic?: number;
  };
}

export interface DialogueNode {
  id: string;
  speaker: string;
  text: string;
  options: DialogueOption[];
  conditions?: string[];
}

export interface NPC {
  id: string;
  name: string;
  description: string;
  personality: string[];
  faction?: string;
  questGiver: boolean;
  merchant: boolean;
  dialogue: DialogueNode[];
  relationship: number; // -100 to 100
}

export interface Enemy {
  id: string;
  name: string;
  level: number;
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  stats: { [key: string]: number };
  abilities: string[];
  loot: { itemId: string; probability: number }[];
  experience: number;
}

export interface EncounterContext {
  location: string;
  time: 'day' | 'night' | 'dawn' | 'dusk';
  weather?: string;
  character: Character;
  recentEncounters: string[];
}

export class RandomEncounterSystem {
  private encounterHistory: Map<string, number> = new Map();
  private encounterCooldowns: Map<string, number> = new Map();
  private locationEncounters: Map<string, Encounter[]> = new Map();

  constructor() {
    this.initializeEncounters();
  }

  private initializeEncounters(): void {
    // Initialize location-specific encounter tables
    const forestEncounters: Encounter[] = [
      {
        id: 'wolf_pack',
        type: 'combat',
        name: 'Wolf Pack',
        description: 'A pack of hungry wolves blocks your path',
        probability: 0.3,
        outcomes: [
          {
            id: 'victory',
            description: 'You defeat the wolves',
            probability: 0.7,
            effects: [
              { type: 'experience', value: 50 },
              { type: 'item', value: 'wolf_pelt' }
            ]
          }
        ]
      },
      {
        id: 'mysterious_shrine',
        type: 'event',
        name: 'Mysterious Shrine',
        description: 'You discover an ancient shrine',
        probability: 0.1,
        outcomes: [
          {
            id: 'pray',
            description: 'You pray at the shrine',
            probability: 1.0,
            effects: [
              { type: 'stat', value: 1, target: 'heart' }
            ]
          }
        ]
      }
    ];

    this.locationEncounters.set('enchanted_forest', forestEncounters);
    this.locationEncounters.set('forest-north', forestEncounters);
  }

  public generateRandomEncounter(location: string, context: EncounterContext): Encounter | null {
    const locationEncounters = this.locationEncounters.get(location);
    if (!locationEncounters) {
      return null;
    }

    // Filter encounters based on conditions and requirements
    const validEncounters = locationEncounters.filter(encounter => 
      this.meetsRequirements(encounter, context) && 
      this.meetsConditions(encounter, context) &&
      !this.isOnCooldown(encounter.id)
    );

    if (validEncounters.length === 0) {
      return null;
    }

    // Select encounter based on probability
    const totalProbability = validEncounters.reduce((sum, e) => sum + e.probability, 0);
    let random = Math.random() * totalProbability;

    for (const encounter of validEncounters) {
      random -= encounter.probability;
      if (random <= 0) {
        this.recordEncounter(encounter.id);
        return encounter;
      }
    }

    return null;
  }

  private meetsRequirements(encounter: Encounter, context: EncounterContext): boolean {
    if (!encounter.requirements) {
      return true;
    }

    const { requirements } = encounter;
    const { character } = context;

    // Check level requirement
    if (requirements.level && character.level < requirements.level) {
      return false;
    }

    // Check stat requirements
    if (requirements.stats) {
      for (const [stat, requiredValue] of Object.entries(requirements.stats)) {
        if (!character.stats[stat] || character.stats[stat] < requiredValue) {
          return false;
        }
      }
    }

    // Check item requirements
    if (requirements.items) {
      for (const item of requirements.items) {
        if (!character.inventory.includes(item)) {
          return false;
        }
      }
    }

    // Check quest requirements
    if (requirements.quests) {
      for (const quest of requirements.quests) {
        if (!character.activeQuests.includes(quest) && !character.completedQuests.includes(quest)) {
          return false;
        }
      }
    }

    return true;
  }

  private meetsConditions(encounter: Encounter, context: EncounterContext): boolean {
    if (!encounter.conditions) {
      return true;
    }

    return encounter.conditions.every(condition => {
      switch (condition.type) {
        case 'location':
          return this.checkCondition(context.location, condition.value, condition.operator || 'equals');
        case 'time':
          return this.checkCondition(context.time, condition.value, condition.operator || 'equals');
        case 'weather':
          return this.checkCondition(context.weather, condition.value, condition.operator || 'equals');
        case 'character_state':
          return this.checkCharacterStateCondition(context.character, condition);
        case 'random':
          return Math.random() < condition.value;
        default:
          return true;
      }
    });
  }

  private checkCondition(actualValue: any, expectedValue: any, operator: string): boolean {
    switch (operator) {
      case 'equals':
        return actualValue === expectedValue;
      case 'greater':
        return actualValue > expectedValue;
      case 'less':
        return actualValue < expectedValue;
      case 'contains':
        return Array.isArray(actualValue) ? actualValue.includes(expectedValue) : false;
      default:
        return true;
    }
  }

  private checkCharacterStateCondition(character: Character, condition: EncounterCondition): boolean {
    // Handle character state conditions like health, mana, stats, etc.
    if (typeof condition.value === 'object' && condition.value.stat) {
      const statValue = character.stats[condition.value.stat];
      return this.checkCondition(statValue, condition.value.value, condition.operator || 'equals');
    }
    return true;
  }

  private recordEncounter(encounterId: string): void {
    const now = Date.now();
    this.encounterHistory.set(encounterId, now);
    // Set cooldown to prevent immediate repetition (5 minutes)
    this.encounterCooldowns.set(encounterId, now + 5 * 60 * 1000);
  }

  private isOnCooldown(encounterId: string): boolean {
    const cooldownTime = this.encounterCooldowns.get(encounterId);
    if (!cooldownTime) {
      return false;
    }
    return Date.now() < cooldownTime;
  }

  public initiateCombatEncounter(encounter: Encounter, context: EncounterContext): Enemy[] {
    // Generate enemies based on encounter and scale with character level
    const baseLevel = context.character.level;
    const enemies: Enemy[] = [];

    // Create enemies based on encounter type
    if (encounter.id === 'wolf_pack') {
      const numWolves = Math.max(1, Math.floor(baseLevel / 2) + 1);
      for (let i = 0; i < numWolves; i++) {
        enemies.push({
          id: `wolf_${i}`,
          name: 'Wolf',
          level: Math.max(1, baseLevel + Math.floor(Math.random() * 3) - 1),
          health: 30 + baseLevel * 5,
          maxHealth: 30 + baseLevel * 5,
          mana: 0,
          maxMana: 0,
          stats: {
            body: 8 + baseLevel,
            mind: 6 + Math.floor(baseLevel / 2),
            heart: 4 + Math.floor(baseLevel / 3)
          },
          abilities: ['bite', 'howl'],
          loot: [
            { itemId: 'wolf_pelt', probability: 0.7 },
            { itemId: 'wolf_fang', probability: 0.3 }
          ],
          experience: 25 + baseLevel * 5
        });
      }
    }

    return enemies;
  }

  public presentDialogueTree(encounter: Encounter, npc: NPC): DialogueNode {
    // Return the first dialogue node for the NPC
    return npc.dialogue[0];
  }

  public processDialogueChoice(
    choice: DialogueOption,
    character: Character,
    npc: NPC
  ): { character: Character; npc: NPC; effects: EncounterEffect[] } {
    const updatedCharacter = { ...character };
    const updatedNPC = { ...npc };
    const effects: EncounterEffect[] = [];

    // Apply choice effects
    if (choice.effects) {
      for (const effect of choice.effects) {
        effects.push(effect);
        this.applyEncounterEffect(effect, updatedCharacter);
      }
    }

    // Update moral alignment
    if (choice.moralAlignment) {
      for (const [alignment, value] of Object.entries(choice.moralAlignment)) {
        if (value !== undefined) {
          updatedCharacter.moralAlignment[alignment as keyof typeof updatedCharacter.moralAlignment] += value;
        }
      }
    }

    // Update NPC relationship based on choice
    const relationshipChange = this.calculateRelationshipChange(choice, npc);
    updatedNPC.relationship = Math.max(-100, Math.min(100, updatedNPC.relationship + relationshipChange));

    return { character: updatedCharacter, npc: updatedNPC, effects };
  }

  private calculateRelationshipChange(choice: DialogueOption, npc: NPC): number {
    // Calculate relationship change based on choice and NPC personality
    let change = 0;

    if (choice.moralAlignment) {
      // NPCs react differently to moral choices based on their personality
      if (npc.personality.includes('lawful') && choice.moralAlignment.lawful) {
        change += choice.moralAlignment.lawful * 2;
      }
      if (npc.personality.includes('chaotic') && choice.moralAlignment.chaotic) {
        change += choice.moralAlignment.chaotic * 2;
      }
      if (npc.personality.includes('good') && choice.moralAlignment.good) {
        change += choice.moralAlignment.good * 2;
      }
      if (npc.personality.includes('evil') && choice.moralAlignment.evil) {
        change += choice.moralAlignment.evil * 2;
      }
    }

    return Math.floor(change);
  }

  public triggerEnvironmentalEvent(location: string, context: EncounterContext): Encounter | null {
    // Generate location-specific environmental events
    const environmentalEvents: { [key: string]: Encounter[] } = {
      'forest': [
        {
          id: 'falling_tree',
          type: 'trap',
          name: 'Falling Tree',
          description: 'A large tree begins to fall toward you!',
          probability: 0.05,
          outcomes: [
            {
              id: 'dodge_success',
              description: 'You successfully dodge the falling tree',
              probability: 0.8,
              effects: [{ type: 'experience', value: 10 }]
            },
            {
              id: 'dodge_fail',
              description: 'The tree clips you as it falls',
              probability: 0.2,
              effects: [{ type: 'health', value: -10 }]
            }
          ]
        }
      ]
    };

    const events = environmentalEvents[location] || [];
    if (events.length === 0) return null;

    const randomEvent = events[Math.floor(Math.random() * events.length)];
    if (Math.random() < randomEvent.probability) {
      return randomEvent;
    }

    return null;
  }

  public applyEncounterEffect(effect: EncounterEffect, character: Character): void {
    switch (effect.type) {
      case 'health':
        character.health = Math.max(0, Math.min(character.maxHealth, character.health + Number(effect.value)));
        break;
      case 'mana':
        character.mana = Math.max(0, Math.min(character.maxMana, character.mana + Number(effect.value)));
        break;
      case 'experience':
        // Experience handling would be delegated to character progression system
        break;
      case 'item':
        if (!character.inventory.includes(String(effect.value))) {
          character.inventory.push(String(effect.value));
        }
        break;
      case 'stat':
        if (effect.target && character.stats[effect.target] !== undefined) {
          character.stats[effect.target] += Number(effect.value);
        }
        break;
      case 'reputation':
        if (effect.target && character.reputation[effect.target] !== undefined) {
          character.reputation[effect.target] += Number(effect.value);
        }
        break;
    }
  }

  public getEncounterHistory(): Map<string, number> {
    return new Map(this.encounterHistory);
  }

  public clearEncounterCooldown(encounterId: string): void {
    this.encounterCooldowns.delete(encounterId);
  }

  public addLocationEncounters(location: string, encounters: Encounter[]): void {
    this.locationEncounters.set(location, encounters);
  }
}

// Export singleton instance
export const randomEncounterSystem = new RandomEncounterSystem();