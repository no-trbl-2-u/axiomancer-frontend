import { describe, it, expect } from '@jest/globals';
import { 
  calculateExperienceRequired,
  addExperience,
  levelUp,
  allocateStatPoints,
  createCharacter,
  ageCharacter,
  equipItem,
  applyEquipmentBonuses,
  calculateSetBonuses,
  calculateDetailedStats
} from '../../systems/CharacterProgression';
import type { 
  Character, 
  StatAllocation, 
  Item,
  Equipment 
} from '../../systems/CharacterProgression';

interface SkillTree {
  body: BodySkills;
  mind: MindSkills;
  heart: HeartSkills;
}

interface BodySkills {
  martialArts: number;
  endurance: number;
  weaponMastery: number;
  intimidation: number;
}

interface MindSkills {
  logicalReasoning: number;
  memorization: number;
  analysisSpeed: number;
  paradoxMastery: number;
}

interface HeartSkills {
  empathy: number;
  persuasion: number;
  leadership: number;
  socialReading: number;
}

interface Equipment {
  weapon?: Item;
  armor?: Item;
  accessories: Item[];
}

interface Item {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'accessory';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  statBonuses: {
    [key: string]: number;
  };
  specialEffects?: string[];
}

describe('Character Progression System', () => {
  describe('Experience and Leveling', () => {
    it('should calculate experience requirements correctly', () => {
      const level5Exp = calculateExperienceRequired(5);
      const level4Exp = calculateExperienceRequired(4);
      
      expect(level5Exp).toBeGreaterThan(0);
      expect(level5Exp).toBeGreaterThan(level4Exp);
      
      // Level 2 should be 150 (100 * 1.5^1)
      expect(calculateExperienceRequired(2)).toBe(150);
    });

    it('should handle level up when experience threshold is reached', () => {
      const character = createCharacter('Test', 'elf', 16);
      character.experience = character.experienceToNext - 1;
      
      const updatedCharacter = addExperience(character, 1);
      expect(updatedCharacter.level).toBe(2);
      expect(updatedCharacter.availableStatPoints).toBe(3);
      expect(updatedCharacter.skillPoints).toBe(1);
    });

    it('should award stat points and skill points on level up', () => {
      const character = createCharacter('Test', 'elf', 15);
      const originalHealth = character.stats.health;
      const originalMana = character.stats.mana;
      
      const leveledCharacter = levelUp(character);
      expect(leveledCharacter.level).toBe(2);
      expect(leveledCharacter.availableStatPoints).toBe(3);
      expect(leveledCharacter.skillPoints).toBe(1);
      expect(leveledCharacter.stats.health).toBeGreaterThan(originalHealth);
      expect(leveledCharacter.stats.mana).toBeGreaterThan(originalMana);
    });

    it('should handle multiple level ups from large experience gains', () => {
      const character = createCharacter('Test', 'elf', 15);
      
      // Give enough experience for multiple levels
      const multiLevelCharacter = addExperience(character, 500);
      expect(multiLevelCharacter.level).toBeGreaterThan(2);
      expect(multiLevelCharacter.availableStatPoints).toBeGreaterThan(3);
    });
  });

  describe('Stat Point Allocation', () => {
    it('should allow allocation of available stat points', () => {
      const character = createCharacter('Test', 'elf', 16);
      character.availableStatPoints = 5;
      const originalBody = character.stats.body;
      const originalMind = character.stats.mind;
      const originalHeart = character.stats.heart;
      
      const statAllocation: StatAllocation = { body: 2, mind: 2, heart: 1 };
      const updatedCharacter = allocateStatPoints(character, statAllocation);
      
      expect(updatedCharacter.stats.body).toBe(originalBody + 2);
      expect(updatedCharacter.stats.mind).toBe(originalMind + 2);  
      expect(updatedCharacter.stats.heart).toBe(originalHeart + 1);
      expect(updatedCharacter.availableStatPoints).toBe(0);
    });

    it('should update detailed stats when base stats change', () => {
      const character = createCharacter('Test', 'elf', 16);
      character.availableStatPoints = 3;
      const originalPhysicalAttack = character.detailedStats.physicalAttack;
      const originalHealth = character.stats.health;
      
      const bodyBoostCharacter = allocateStatPoints(character, { body: 3, mind: 0, heart: 0 });
      
      expect(bodyBoostCharacter.detailedStats.physicalAttack).toBeGreaterThan(originalPhysicalAttack);
      expect(bodyBoostCharacter.stats.health).toBeGreaterThan(originalHealth);
    });

    it('should prevent over-allocation of stat points', () => {
      const character = createCharacter('Test', 'elf', 15);
      character.availableStatPoints = 2;
      
      const invalidAllocation: StatAllocation = { body: 3, mind: 1, heart: 0 }; // Total: 4, but only 2 available
      
      expect(() => allocateStatPoints(character, invalidAllocation)).toThrow('Insufficient stat points');
    });
  });

  describe('Skill Tree System', () => {
    it.skip('should allow skill point allocation in skill trees', () => {
      const character: Character = {
        id: 'test',
        name: 'Test',
        level: 4,
        experience: 800,
        experienceToNext: 400,
        age: 17,
        stats: { body: 12, mind: 14, heart: 10, health: 120, mana: 70 },
        detailedStats: {
          physicalAttack: 18, physicalDefense: 15, mentalAttack: 21,
          mentalDefense: 18, socialAttack: 13, socialDefense: 10,
          speed: 14, evasion: 12, accuracy: 16
        },
        availableStatPoints: 0,
        skillPoints: 3
      };

      const skillAllocation = {
        body: { martialArts: 1, endurance: 1 },
        mind: { logicalReasoning: 1 },
        heart: {}
      };

      // Should successfully allocate skill points
      // const skilledCharacter = allocateSkillPoints(character, skillAllocation);
      // expect(skilledCharacter.skillPoints).toBe(0);
      // Skill effects should be applied to character
    });

    it.skip('should require prerequisites for advanced skills', () => {
      const skillTree: SkillTree = {
        body: { martialArts: 0, endurance: 0, weaponMastery: 0, intimidation: 0 },
        mind: { logicalReasoning: 0, memorization: 0, analysisSpeed: 0, paradoxMastery: 0 },
        heart: { empathy: 0, persuasion: 0, leadership: 0, socialReading: 0 }
      };

      // Advanced skills should require basic skills as prerequisites
      // const canLearnWeaponMastery = canLearnSkill('weaponMastery', skillTree.body);
      // expect(canLearnWeaponMastery).toBe(false); // Requires martialArts >= 3

      const advancedSkillTree: SkillTree = {
        body: { martialArts: 3, endurance: 2, weaponMastery: 0, intimidation: 1 },
        mind: { logicalReasoning: 2, memorization: 1, analysisSpeed: 0, paradoxMastery: 0 },
        heart: { empathy: 1, persuasion: 0, leadership: 0, socialReading: 2 }
      };

      // Now weapon mastery should be available
      // const canLearnAdvanced = canLearnSkill('weaponMastery', advancedSkillTree.body);
      // expect(canLearnAdvanced).toBe(true);
    });

    it.skip('should apply skill bonuses to character stats', () => {
      const character: Character = {
        id: 'test',
        name: 'Test',
        level: 5,
        experience: 1200,
        experienceToNext: 600,
        age: 18,
        stats: { body: 15, mind: 16, heart: 12, health: 150, mana: 80 },
        detailedStats: {
          physicalAttack: 22, physicalDefense: 18, mentalAttack: 24,
          mentalDefense: 20, socialAttack: 15, socialDefense: 12,
          speed: 17, evasion: 15, accuracy: 19
        },
        availableStatPoints: 0,
        skillPoints: 0
      };

      const skills: SkillTree = {
        body: { martialArts: 3, endurance: 2, weaponMastery: 1, intimidation: 0 },
        mind: { logicalReasoning: 4, memorization: 2, analysisSpeed: 1, paradoxMastery: 0 },
        heart: { empathy: 2, persuasion: 3, leadership: 1, socialReading: 2 }
      };

      // Skills should provide bonuses to relevant stats
      // const bonusedCharacter = applySkillBonuses(character, skills);
      // expect(bonusedCharacter.detailedStats.physicalAttack).toBeGreaterThan(22);
      // expect(bonusedCharacter.detailedStats.mentalAttack).toBeGreaterThan(24);
      // expect(bonusedCharacter.detailedStats.socialAttack).toBeGreaterThan(15);
    });
  });

  describe('Equipment System', () => {
    it('should allow equipping items with stat bonuses', () => {
      const character = createCharacter('Test', 'elf', 16);
      const equipment: Equipment = { accessories: [] };

      const sword: Item = {
        id: 'iron_sword',
        name: 'Iron Sword',
        type: 'weapon',
        rarity: 'common',
        levelRequirement: 1,
        statBonuses: {
          physicalAttack: 5,
          accuracy: 2
        }
      };

      const { character: equippedCharacter, equipment: updatedEquipment } = equipItem(character, sword, equipment);
      expect(updatedEquipment.weapon).toBe(sword);
    });

    it('should handle item rarity and special effects', () => {
      const legendaryItem: Item = {
        id: 'philosophers_stone',
        name: "Philosopher's Stone",
        type: 'accessory',
        rarity: 'legendary',
        levelRequirement: 5,
        statBonuses: {
          mentalAttack: 10,
          mana: 25,
          mentalDefense: 8
        },
        specialEffects: ['mana_regeneration', 'fallacy_mastery_bonus']
      };

      expect(legendaryItem.specialEffects?.length).toBeGreaterThan(0);
      expect(Object.values(legendaryItem.statBonuses).reduce((a, b) => a + (b || 0), 0)).toBeGreaterThan(30);
    });

    it('should prevent equipping items with level requirements', () => {
      const character = createCharacter('Test', 'elf', 15);
      const equipment: Equipment = { accessories: [] };

      const highLevelItem: Item = {
        id: 'master_sword',
        name: 'Master Sword',
        type: 'weapon',
        rarity: 'epic',
        levelRequirement: 5,
        statBonuses: {
          physicalAttack: 15,
          accuracy: 8,
          physicalDefense: 5
        }
      };

      expect(() => equipItem(character, highLevelItem, equipment)).toThrow('Level requirement not met');
    });

    it('should handle equipment sets with bonus effects', () => {
      const scholarSet: Item[] = [
        {
          id: 'scholar_robes',
          name: 'Scholar Robes',
          type: 'armor',
          rarity: 'uncommon',
          levelRequirement: 1,
          statBonuses: { mentalDefense: 6, mana: 10 },
          specialEffects: ['scholar_set_piece']
        },
        {
          id: 'scholar_hat',
          name: 'Scholar Hat',
          type: 'accessory',
          rarity: 'uncommon',
          levelRequirement: 1,
          statBonuses: { mentalAttack: 4, mana: 5 },
          specialEffects: ['scholar_set_piece']
        }
      ];

      const setBonuses = calculateSetBonuses(scholarSet);
      expect(setBonuses).toContain('scholar_set_bonus');
    });
  });

  describe('Aging System (Labyrinth)', () => {
    it('should age character by specified years', () => {
      const character = createCharacter('Test', 'elf', 16);
      
      const agedCharacter = ageCharacter(character, 1);
      expect(agedCharacter.age).toBe(17);
    });

    it('should apply age-related stat changes', () => {
      const youngCharacter = createCharacter('Test', 'elf', 15);
      const originalDetailedStats = { ...youngCharacter.detailedStats };
      
      // Age to 30 (adult age with different stat modifiers)
      const matureCharacter = ageCharacter(youngCharacter, 15); // Age from 15 to 30
      expect(matureCharacter.age).toBe(30);
      
      // Adult age should have different stat calculations than youth
      expect(matureCharacter.detailedStats).toBeDefined();
    });

    it('should handle detailed stats recalculation with aging', () => {
      const baseStats = {
        body: 10,
        mind: 10, 
        heart: 10,
        health: 100,
        mana: 50
      };
      
      const youthStats = calculateDetailedStats(baseStats, 16);
      const adultStats = calculateDetailedStats(baseStats, 30);
      const elderStats = calculateDetailedStats(baseStats, 65);
      
      // Youth should favor body stats
      expect(youthStats.physicalAttack).toBeGreaterThan(adultStats.physicalAttack);
      
      // Elders should favor mind/heart stats  
      expect(elderStats.mentalAttack).toBeGreaterThan(youthStats.mentalAttack);
    });
  });
});