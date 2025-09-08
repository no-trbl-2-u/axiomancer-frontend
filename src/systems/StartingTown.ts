// Starting Town System - A humble seafaring village implementation
// Implements family-focused gameplay, boat building, local economy, and emotional departure

// ===== INTERFACES =====

interface DialogueTree {
  [key: string]: any; // Simplified for basic implementation
}

interface Item {
  id: string;
  name: string;
  description: string;
  value: number;
  type: string;
}

export interface Town {
  id: string;
  name: string;
  description: string;
  population: number;
  economy: 'poor' | 'modest' | 'prosperous' | 'wealthy';
  atmosphere: string[];
  npcs: NPC[];
  buildings: Building[];
  events: TownEvent[];
  seasons: SeasonalChange[];
}

export interface NPC {
  id: string;
  name: string;
  role: string;
  personality: string[];
  relationship: number; // -100 to 100
  family?: string[]; // Related NPC IDs
  schedule: NPCSchedule[];
  quests: string[];
  dialogue: DialogueTree;
  services?: Service[];
}

export interface NPCSchedule {
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  location: string;
  activity: string;
  availability: boolean;
}

export interface Building {
  id: string;
  name: string;
  type: 'home' | 'shop' | 'tavern' | 'dock' | 'workshop' | 'temple' | 'storage';
  owner?: string; // NPC ID
  services: Service[];
  items?: Item[];
  description: string;
  interiorDescription?: string;
}

export interface Service {
  type: 'trade' | 'rest' | 'repair' | 'information' | 'transport' | 'training';
  cost: number;
  requirements?: string[];
  availability: string[];
}

export interface TownEvent {
  id: string;
  name: string;
  description: string;
  type: 'seasonal' | 'random' | 'quest_triggered' | 'reputation_based';
  probability: number;
  conditions?: EventCondition[];
  effects: EventEffect[];
  duration: number; // in game days
}

export interface EventCondition {
  type: 'season' | 'reputation' | 'quest_status' | 'time' | 'weather';
  value: any;
  operator: 'equals' | 'greater' | 'less';
}

export interface EventEffect {
  type: 'npc_mood' | 'prices' | 'availability' | 'new_dialogue' | 'unlock_area';
  target: string;
  value: any;
  temporary: boolean;
}

export interface SeasonalChange {
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  effects: {
    weather: string[];
    activities: string[];
    availability: { [npcId: string]: boolean };
    prices: { [itemType: string]: number };
    events: string[];
  };
}

export interface BoatBuildingProject {
  id: string;
  name: string;
  description: string;
  requiredMaterials: MaterialRequirement[];
  currentProgress: { [materialId: string]: number };
  completed: boolean;
  stages: BuildingStage[];
  currentStage: number;
}

export interface MaterialRequirement {
  materialId: string;
  name: string;
  quantity: number;
  sources: string[]; // Where to find this material
  quality: 'poor' | 'average' | 'good' | 'excellent';
}

export interface BuildingStage {
  id: string;
  name: string;
  description: string;
  requiredMaterials: string[];
  skillCheck?: {
    skill: string;
    difficulty: number;
  };
  helper?: string; // NPC who can assist
}

export interface FamilyRelationship {
  npcId: string;
  relationship: 'parent' | 'sibling' | 'grandparent' | 'cousin' | 'friend';
  closeness: number; // 0-100
  sharedMemories: string[];
  currentStatus: 'alive' | 'missing' | 'on_pilgrimage' | 'deceased';
}

// ===== STARTING TOWN SYSTEM =====

export class StartingTownSystem {
  private town: Town;
  private playerFamily: FamilyRelationship[];
  private boatProject: BoatBuildingProject;
  private currentSeason: 'spring' | 'summer' | 'autumn' | 'winter';
  private playerReputation: { overall: number; specific: { [key: string]: number } };

  constructor() {
    this.currentSeason = 'spring';
    this.playerReputation = {
      overall: 75,
      specific: {
        fishermen: 80,
        merchants: 60,
        elders: 90
      }
    };

    this.town = this.createStartingTown();
    this.playerFamily = this.createPlayerFamily();
    this.boatProject = this.createBoatProject();
  }

  // ===== TOWN CREATION =====

  private createStartingTown(): Town {
    return {
      id: 'seafarers_haven',
      name: 'Seafarer\'s Haven',
      description: 'A humble fishing village where family bonds run deep',
      population: 150,
      economy: 'modest',
      atmosphere: ['peaceful', 'family_oriented', 'hardworking', 'traditional'],
      npcs: this.createTownNPCs(),
      buildings: this.createTownBuildings(),
      events: this.createTownEvents(),
      seasons: this.createSeasonalChanges()
    };
  }

  private createTownNPCs(): NPC[] {
    return [
      {
        id: 'village_elder',
        name: 'Elder Maren',
        role: 'Village Leader',
        personality: ['wise', 'caring', 'traditional'],
        relationship: 75,
        schedule: [
          { timeOfDay: 'morning', location: 'elder_house', activity: 'meditation', availability: true },
          { timeOfDay: 'afternoon', location: 'town_center', activity: 'village_affairs', availability: true },
          { timeOfDay: 'evening', location: 'elder_house', activity: 'reading', availability: true },
          { timeOfDay: 'night', location: 'elder_house', activity: 'sleeping', availability: false }
        ],
        quests: ['boat_building_guidance'],
        dialogue: {},
        services: [{ type: 'information', cost: 0, availability: ['always'] }]
      },
      {
        id: 'old_captain_salt',
        name: 'Captain Salt',
        role: 'Master Fisherman',
        personality: ['gruff', 'experienced', 'loyal'],
        relationship: 60,
        schedule: [
          { timeOfDay: 'morning', location: 'fishing_dock', activity: 'preparing_nets', availability: true },
          { timeOfDay: 'afternoon', location: 'sea', activity: 'fishing', availability: false },
          { timeOfDay: 'evening', location: 'tavern', activity: 'storytelling', availability: true },
          { timeOfDay: 'night', location: 'home', activity: 'sleeping', availability: false }
        ],
        quests: ['teach_navigation', 'share_sea_wisdom'],
        dialogue: {},
        services: [
          { type: 'training', cost: 25, requirements: ['friendly_relationship'], availability: ['evening'] }
        ]
      },
      {
        id: 'fisherman_tom',
        name: 'Tom the Fisher',
        role: 'Local Fisherman',
        personality: ['honest', 'hardworking'],
        relationship: 45,
        schedule: [
          { timeOfDay: 'morning', location: 'fishing_dock', activity: 'preparing_boats', availability: true },
          { timeOfDay: 'afternoon', location: 'sea', activity: 'fishing', availability: false },
          { timeOfDay: 'evening', location: 'home', activity: 'family_time', availability: true },
          { timeOfDay: 'night', location: 'home', activity: 'sleeping', availability: false }
        ],
        quests: [],
        dialogue: {},
        services: [{ type: 'trade', cost: 0, availability: ['morning', 'evening'] }]
      },
      {
        id: 'tavern_keeper_brom',
        name: 'Brom',
        role: 'Tavern Keeper',
        personality: ['jovial', 'talkative', 'welcoming'],
        relationship: 55,
        schedule: [
          { timeOfDay: 'morning', location: 'tavern', activity: 'cleaning', availability: true },
          { timeOfDay: 'afternoon', location: 'tavern', activity: 'serving', availability: true },
          { timeOfDay: 'evening', location: 'tavern', activity: 'serving', availability: true },
          { timeOfDay: 'night', location: 'tavern', activity: 'closing', availability: true }
        ],
        quests: [],
        dialogue: {},
        services: [
          { type: 'rest', cost: 5, availability: ['always'] },
          { type: 'information', cost: 2, availability: ['evening', 'night'] }
        ]
      },
      {
        id: 'master_carpenter',
        name: 'Master Aldric',
        role: 'Village Carpenter',
        personality: ['skilled', 'patient', 'perfectionist'],
        relationship: 70,
        schedule: [
          { timeOfDay: 'morning', location: 'workshop', activity: 'woodworking', availability: true },
          { timeOfDay: 'afternoon', location: 'workshop', activity: 'boat_repairs', availability: true },
          { timeOfDay: 'evening', location: 'home', activity: 'family_time', availability: false },
          { timeOfDay: 'night', location: 'home', activity: 'sleeping', availability: false }
        ],
        quests: ['boat_construction_help'],
        dialogue: {},
        services: [
          { type: 'repair', cost: 20, availability: ['morning', 'afternoon'] },
          { type: 'training', cost: 30, requirements: ['craft_materials'], availability: ['afternoon'] }
        ]
      },
      {
        id: 'grandmother_sage',
        name: 'Grandmother Sage',
        role: 'Village Wise Woman',
        personality: ['wise', 'nurturing', 'mystical'],
        relationship: 85,
        family: ['player'],
        schedule: [
          { timeOfDay: 'morning', location: 'herb_garden', activity: 'gardening', availability: true },
          { timeOfDay: 'afternoon', location: 'home', activity: 'storytelling', availability: true },
          { timeOfDay: 'evening', location: 'home', activity: 'blessing_preparation', availability: true },
          { timeOfDay: 'night', location: 'home', activity: 'sleeping', availability: false }
        ],
        quests: ['family_blessing', 'ancient_wisdom'],
        dialogue: {},
        services: [{ type: 'information', cost: 0, availability: ['always'] }]
      }
    ];
  }

  private createTownBuildings(): Building[] {
    return [
      {
        id: 'fishing_dock',
        name: 'The Old Pier',
        type: 'dock',
        owner: 'town_collective',
        description: 'Weather-beaten wooden planks extend into the harbor',
        interiorDescription: 'Nets, ropes, and fishing equipment are stored here',
        services: [
          { type: 'transport', cost: 10, availability: ['day'] },
          { type: 'trade', cost: 0, availability: ['always'] }
        ],
        items: [
          { id: 'fishing_net', name: 'Fishing Net', description: 'A well-worn net', value: 15, type: 'tool' },
          { id: 'rope', name: 'Strong Rope', description: 'Durable hemp rope', value: 8, type: 'material' },
          { id: 'bait', name: 'Fish Bait', description: 'Fresh bait for fishing', value: 2, type: 'consumable' }
        ]
      },
      {
        id: 'village_tavern',
        name: 'The Anchor\'s Rest',
        type: 'tavern',
        owner: 'tavern_keeper_brom',
        description: 'Warm light spills from small windows, inviting weary travelers',
        interiorDescription: 'A cozy common room with a crackling fireplace and worn wooden tables',
        services: [
          { type: 'rest', cost: 5, availability: ['always'] },
          { type: 'information', cost: 2, availability: ['evening', 'night'] }
        ]
      },
      {
        id: 'carpenter_workshop',
        name: 'Aldric\'s Workshop',
        type: 'workshop',
        owner: 'master_carpenter',
        description: 'The sound of hammering and sawing echoes from within',
        interiorDescription: 'Wood shavings cover the floor, tools line the walls',
        services: [
          { type: 'repair', cost: 20, availability: ['morning', 'afternoon'] },
          { type: 'training', cost: 30, availability: ['afternoon'] }
        ],
        items: [
          { id: 'wood_planks', name: 'Wood Planks', description: 'Quality wooden planks', value: 12, type: 'material' },
          { id: 'iron_nails', name: 'Iron Nails', description: 'Strong iron nails', value: 5, type: 'material' }
        ]
      },
      {
        id: 'grandmother_house',
        name: 'Grandmother\'s Cottage',
        type: 'home',
        owner: 'grandmother_sage',
        description: 'A cozy cottage surrounded by herb gardens',
        interiorDescription: 'Dried herbs hang from the ceiling, warm fireplace crackles',
        services: [{ type: 'information', cost: 0, availability: ['always'] }]
      }
    ];
  }

  private createTownEvents(): TownEvent[] {
    return [
      {
        id: 'storm_warning',
        name: 'Storm Warning',
        description: 'Dark clouds gather on the horizon as fishermen secure their boats',
        type: 'seasonal',
        probability: 0.3,
        conditions: [
          { type: 'season', value: 'autumn', operator: 'equals' },
          { type: 'weather', value: 'stormy', operator: 'equals' }
        ],
        effects: [
          { type: 'availability', target: 'fishing_dock', value: false, temporary: true },
          { type: 'npc_mood', target: 'all_fishermen', value: 'worried', temporary: true }
        ],
        duration: 2
      },
      {
        id: 'merchant_arrival',
        name: 'Traveling Merchant',
        description: 'A merchant\'s cart rolls into town with exotic goods',
        type: 'random',
        probability: 0.15,
        effects: [
          { type: 'new_dialogue', target: 'traveling_merchant', value: 'trade_options', temporary: false },
          { type: 'availability', target: 'rare_goods', value: true, temporary: true }
        ],
        duration: 3
      },
      {
        id: 'hero_celebration',
        name: 'Hero\'s Welcome',
        description: 'The town celebrates your heroic deeds',
        type: 'reputation_based',
        probability: 1.0,
        conditions: [
          { type: 'reputation', value: 80, operator: 'greater' }
        ],
        effects: [
          { type: 'prices', target: 'all_shops', value: 0.8, temporary: true },
          { type: 'new_dialogue', target: 'all_npcs', value: 'grateful_thanks', temporary: false }
        ],
        duration: 5
      }
    ];
  }

  private createSeasonalChanges(): SeasonalChange[] {
    return [
      {
        season: 'spring',
        effects: {
          weather: ['mild', 'rainy'],
          activities: ['planting', 'boat_repairs'],
          availability: { fishermen: true, merchants: true },
          prices: { fish: 2, repairs: 15 },
          events: ['spring_festival']
        }
      },
      {
        season: 'summer',
        effects: {
          weather: ['sunny', 'calm'],
          activities: ['fishing', 'trading'],
          availability: { fishermen: true, merchants: true },
          prices: { fish: 3, repairs: 10 },
          events: ['summer_fair']
        }
      },
      {
        season: 'autumn',
        effects: {
          weather: ['windy', 'stormy'],
          activities: ['preparation', 'storage'],
          availability: { fishermen: false, merchants: true },
          prices: { fish: 2, repairs: 12 },
          events: ['storm_warning', 'harvest_gathering']
        }
      },
      {
        season: 'winter',
        effects: {
          weather: ['cold', 'harsh'],
          activities: ['indoor_work', 'storytelling'],
          availability: { fishermen: false, merchants: false },
          prices: { fish: 4, repairs: 20 },
          events: ['winter_tales', 'supply_shortage']
        }
      }
    ];
  }

  // ===== FAMILY RELATIONSHIPS =====

  private createPlayerFamily(): FamilyRelationship[] {
    return [
      {
        npcId: 'mother_lyra',
        relationship: 'parent',
        closeness: 95,
        sharedMemories: ['bedtime_stories', 'fishing_lessons', 'last_goodbye'],
        currentStatus: 'on_pilgrimage'
      },
      {
        npcId: 'father_erik',
        relationship: 'parent',
        closeness: 90,
        sharedMemories: ['boat_repairs', 'navigation_lessons', 'family_traditions'],
        currentStatus: 'on_pilgrimage'
      },
      {
        npcId: 'grandmother_sage',
        relationship: 'grandparent',
        closeness: 85,
        sharedMemories: ['old_tales', 'herb_gathering', 'wisdom_sharing'],
        currentStatus: 'alive'
      }
    ];
  }

  // ===== BOAT BUILDING SYSTEM =====

  private createBoatProject(): BoatBuildingProject {
    return {
      id: 'player_boat',
      name: 'Journey\'s Beginning',
      description: 'A sturdy vessel to carry you across the treacherous seas',
      requiredMaterials: [
        {
          materialId: 'sturdy_wood',
          name: 'Sturdy Wood Planks',
          quantity: 20,
          sources: ['northern_forest', 'old_shipwreck', 'carpenter_shop'],
          quality: 'good'
        },
        {
          materialId: 'sailcloth',
          name: 'Strong Sailcloth',
          quantity: 1,
          sources: ['merchant_trader', 'abandoned_ship'],
          quality: 'excellent'
        },
        {
          materialId: 'iron_nails',
          name: 'Iron Nails',
          quantity: 100,
          sources: ['blacksmith', 'old_buildings'],
          quality: 'average'
        }
      ],
      currentProgress: {
        sturdy_wood: 0,
        sailcloth: 0,
        iron_nails: 0
      },
      completed: false,
      stages: [
        {
          id: 'hull_construction',
          name: 'Hull Construction',
          description: 'Build the main body of the boat',
          requiredMaterials: ['sturdy_wood', 'iron_nails'],
          skillCheck: { skill: 'craftsmanship', difficulty: 8 },
          helper: 'master_carpenter'
        },
        {
          id: 'sail_attachment',
          name: 'Sail Installation',
          description: 'Attach the sail and rigging',
          requiredMaterials: ['sailcloth'],
          skillCheck: { skill: 'craftsmanship', difficulty: 6 },
          helper: 'old_captain_salt'
        },
        {
          id: 'final_assembly',
          name: 'Final Assembly',
          description: 'Complete the final touches',
          requiredMaterials: ['iron_nails'],
          skillCheck: { skill: 'craftsmanship', difficulty: 10 }
        }
      ],
      currentStage: 0
    };
  }

  // ===== UTILITY METHODS =====

  public getTown(): Town {
    return this.town;
  }

  public getPlayerFamily(): FamilyRelationship[] {
    return this.playerFamily;
  }

  public getBoatProject(): BoatBuildingProject {
    return this.boatProject;
  }

  public getNPCLocation(npc: NPC, timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night'): string {
    const scheduleEntry = npc.schedule.find(s => s.timeOfDay === timeOfDay);
    return scheduleEntry ? scheduleEntry.location : 'unknown';
  }

  public addMaterial(materialId: string, quantity: number): BoatBuildingProject {
    if (this.boatProject.currentProgress[materialId] !== undefined) {
      this.boatProject.currentProgress[materialId] += quantity;
    }
    return this.boatProject;
  }

  public calculateBoatProgress(): number {
    let totalRequired = 0;
    let totalCurrent = 0;

    for (const material of this.boatProject.requiredMaterials) {
      totalRequired += material.quantity;
      totalCurrent += this.boatProject.currentProgress[material.materialId] || 0;
    }

    return totalRequired > 0 ? Math.round((totalCurrent / totalRequired) * 100) : 0;
  }

  public canBarterWithNPC(npc: NPC, tradeOffer: any): boolean {
    return npc.relationship >= (tradeOffer.reputationRequired || 0);
  }

  public getSeasonalPrice(item: string, season: string, seasonalPrices: any): number {
    return seasonalPrices[item] && seasonalPrices[item][season] 
      ? seasonalPrices[item][season] 
      : 0;
  }

  public checkReputationEvent(event: TownEvent, reputation: number): boolean {
    const reputationCondition = event.conditions?.find(c => c.type === 'reputation');
    if (!reputationCondition) return false;
    
    switch (reputationCondition.operator) {
      case 'greater':
        return reputation > reputationCondition.value;
      case 'less':
        return reputation < reputationCondition.value;
      case 'equals':
        return reputation === reputationCondition.value;
      default:
        return false;
    }
  }

  public attemptConstruction(stage: BuildingStage, playerSkills: any, helperBonus: number = 0): any {
    const totalSkill = (playerSkills[stage.skillCheck?.skill || 'craftsmanship'] || 0) + helperBonus;
    const requiredDifficulty = stage.skillCheck?.difficulty || 5;
    
    return {
      success: totalSkill >= requiredDifficulty,
      skillCheck: totalSkill
    };
  }
}

// ===== EXPORT DEFAULT =====

export default StartingTownSystem;