// Quest and Achievement System API
// Based on Backend_Roadmap.md requirements

export interface QuestObjective {
  id: string;
  description: string;
  completed: boolean;
  progress: number;
  maxProgress: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'main' | 'side' | 'daily' | 'hidden';
  status: 'available' | 'active' | 'completed' | 'failed' | 'locked';
  objectives: QuestObjective[];
  rewards: {
    experience: number;
    items: string[];
    gold?: number;
    unlocks?: string[];
  };
  prerequisites?: string[];
  timeLimit?: number;
  location?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'combat' | 'exploration' | 'story' | 'social' | 'collection' | 'hidden';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
  rewards?: {
    experience: number;
    title?: string;
    items?: string[];
  };
}

export interface QuestProgress {
  characterId: string;
  activeQuests: Quest[];
  completedQuests: string[];
  availableQuests: string[];
  failedQuests: string[];
  achievements: Achievement[];
  totalAchievementPoints: number;
}

export interface UpdateQuestRequest {
  characterId: string;
  questId: string;
  action: 'start' | 'complete' | 'fail' | 'update_objective';
  objectiveId?: string;
  progress?: number;
}

// Quest API implementation
export const questAPI = {
  async getProgress(characterId: string): Promise<QuestProgress> {
    console.log('Getting quest progress for:', characterId);
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Mock starting quests
    const mockQuests: Quest[] = [
      {
        id: 'childhood_beginning',
        title: 'The Journey Begins',
        description: 'Take your first steps into the wider world beyond your fishing village.',
        type: 'main',
        status: 'active',
        objectives: [
          {
            id: 'explore_village',
            description: 'Explore the starting village',
            completed: false,
            progress: 0,
            maxProgress: 1
          },
          {
            id: 'talk_to_elder',
            description: 'Speak with the village elder',
            completed: false,
            progress: 0,
            maxProgress: 1
          }
        ],
        rewards: {
          experience: 100,
          items: ['basic_fishing_rod']
        },
        location: 'starting_town'
      },
      {
        id: 'first_combat',
        title: 'Trial by Combat',
        description: 'Face your first opponent and learn the ways of philosophical warfare.',
        type: 'main',
        status: 'locked',
        objectives: [
          {
            id: 'win_first_battle',
            description: 'Win your first combat encounter',
            completed: false,
            progress: 0,
            maxProgress: 1
          },
          {
            id: 'identify_fallacy',
            description: 'Successfully identify a logical fallacy',
            completed: false,
            progress: 0,
            maxProgress: 1
          }
        ],
        rewards: {
          experience: 200,
          items: ['novice_wisdom_tome'],
          unlocks: ['northern_forest']
        },
        prerequisites: ['childhood_beginning']
      }
    ];

    const mockAchievements: Achievement[] = [
      {
        id: 'first_steps',
        title: 'First Steps',
        description: 'Create your first character',
        category: 'story',
        rarity: 'common',
        unlocked: false,
        progress: 0,
        maxProgress: 1,
        rewards: {
          experience: 50
        }
      },
      {
        id: 'fallacy_novice',
        title: 'Fallacy Novice',
        description: 'Successfully identify 10 logical fallacies',
        category: 'combat',
        rarity: 'uncommon',
        unlocked: false,
        progress: 0,
        maxProgress: 10,
        rewards: {
          experience: 300,
          title: 'Logic Student'
        }
      },
      {
        id: 'paradox_master',
        title: 'Paradox Master',
        description: 'Master all philosophical paradoxes',
        category: 'combat',
        rarity: 'legendary',
        unlocked: false,
        progress: 0,
        maxProgress: 5,
        rewards: {
          experience: 1000,
          title: 'Philosopher',
          items: ['paradox_crown']
        }
      },
      {
        id: 'peaceful_resolution',
        title: 'Diplomat',
        description: 'Resolve 5 conflicts through agreement rather than combat',
        category: 'social',
        rarity: 'rare',
        unlocked: false,
        progress: 0,
        maxProgress: 5,
        rewards: {
          experience: 500,
          title: 'Peacekeeper'
        }
      }
    ];
    
    return {
      characterId,
      activeQuests: mockQuests.filter(q => q.status === 'active'),
      completedQuests: [],
      availableQuests: mockQuests.filter(q => q.status === 'available').map(q => q.id),
      failedQuests: [],
      achievements: mockAchievements,
      totalAchievementPoints: 0
    };
  },

  async updateQuest(data: UpdateQuestRequest): Promise<Quest> {
    console.log('Updating quest:', data);
    await new Promise(resolve => setTimeout(resolve, 150));
    
    // Mock quest update - would update backend
    const mockQuest: Quest = {
      id: data.questId,
      title: 'Updated Quest',
      description: 'Quest has been updated',
      type: 'main',
      status: 'active',
      objectives: [],
      rewards: { experience: 0, items: [] }
    };
    
    return mockQuest;
  },

  async unlockAchievement(characterId: string, achievementId: string): Promise<Achievement> {
    console.log('Unlocking achievement:', { characterId, achievementId });
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Mock achievement unlock
    const mockAchievement: Achievement = {
      id: achievementId,
      title: 'Achievement Unlocked!',
      description: 'You did something noteworthy',
      category: 'story',
      rarity: 'common',
      unlocked: true,
      unlockedAt: new Date().toISOString(),
      progress: 1,
      maxProgress: 1,
      rewards: { experience: 100 }
    };
    
    return mockAchievement;
  },

  async getAvailableQuests(characterId: string, locationId?: string): Promise<Quest[]> {
    console.log('Getting available quests:', { characterId, locationId });
    await new Promise(resolve => setTimeout(resolve, 150));
    
    // Mock available quests based on location and progress
    return [];
  },

  async checkQuestTriggers(characterId: string, event: {
    type: 'location_visit' | 'combat_win' | 'item_acquired' | 'npc_interaction';
    data: Record<string, any>;
  }): Promise<Quest[]> {
    console.log('Checking quest triggers:', { characterId, event });
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Mock quest trigger checking - would evaluate quest conditions
    return [];
  }
};

// Story and milestone tracking
export interface StoryMilestone {
  id: string;
  title: string;
  description: string;
  chapter: string;
  unlocked: boolean;
  unlockedAt?: string;
  consequences?: string[];
}

export interface StoryChoice {
  id: string;
  description: string;
  consequences: string[];
  moralWeight: { law: number; chaos: number; good: number; evil: number };
}

export interface StoryEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  choices: StoryChoice[];
  requirements?: string[];
}

export interface StoryProgress {
  characterId: string;
  currentChapter: string;
  unlockedMilestones: StoryMilestone[];
  choicesMade: Record<string, string>; // eventId -> choiceId
  endingPath: string[];
  moralAlignment: { law: number; chaos: number; good: number; evil: number };
}

export const storyAPI = {
  async getProgress(characterId: string): Promise<StoryProgress> {
    console.log('Getting story progress for:', characterId);
    await new Promise(resolve => setTimeout(resolve, 150));
    
    return {
      characterId,
      currentChapter: 'childhood',
      unlockedMilestones: [{
        id: 'birth',
        title: 'The Beginning',
        description: 'You were born in a small fishing village.',
        chapter: 'childhood',
        unlocked: true,
        unlockedAt: new Date().toISOString()
      }],
      choicesMade: {},
      endingPath: [],
      moralAlignment: { law: 0, chaos: 0, good: 0, evil: 0 }
    };
  },

  async makeChoice(characterId: string, eventId: string, choiceId: string): Promise<StoryChoice> {
    console.log('Making story choice:', { characterId, eventId, choiceId });
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Mock choice recording
    const mockChoice: StoryChoice = {
      id: choiceId,
      description: 'You chose the moral path',
      consequences: ['gained_reputation'],
      moralWeight: { law: 1, chaos: 0, good: 1, evil: 0 }
    };
    
    return mockChoice;
  },

  async getAvailableEvents(characterId: string, locationId: string): Promise<StoryEvent[]> {
    console.log('Getting story events for location:', { characterId, locationId });
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Mock story events based on location and progress
    return [];
  },

  async unlockMilestone(characterId: string, milestoneId: string): Promise<StoryMilestone> {
    console.log('Unlocking story milestone:', { characterId, milestoneId });
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const mockMilestone: StoryMilestone = {
      id: milestoneId,
      title: 'Milestone Reached',
      description: 'You have reached an important point in your journey',
      chapter: 'childhood',
      unlocked: true,
      unlockedAt: new Date().toISOString()
    };
    
    return mockMilestone;
  }
};

export default { questAPI, storyAPI };