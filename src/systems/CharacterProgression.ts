// Character Progression System Implementation
// Handles leveling, stat allocation, experience, and basic equipment

export interface Character {
  id: string;
  name: string;
  level: number;
  experience: number;
  experienceToNext: number;
  age: number;
  stats: CharacterStats;
  detailedStats: DetailedStats;
  availableStatPoints: number;
  skillPoints: number;
  currentLocation: string;
  unlockedLocations: string[];
}

export interface CharacterStats {
  body: number;
  mind: number;
  heart: number;
  health: number;
  mana: number;
}

export interface DetailedStats {
  // Body-derived stats
  physicalAttack: number;
  physicalDefense: number;
  accuracy: number;
  speed: number;
  
  // Mind-derived stats
  mentalAttack: number;
  mentalDefense: number;
  evasion: number;
  perception: number;
  
  // Heart-derived stats
  socialAttack: number;
  socialDefense: number;
  ailmentAttack: number;
  ailmentDefense: number;
}

export interface Equipment {
  weapon?: Item;
  armor?: Item;
  accessories: Item[];
}

export interface Item {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'accessory';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  levelRequirement: number;
  statBonuses: Partial<DetailedStats>;
  specialEffects?: string[];
}

export interface StatAllocation {
  body: number;
  mind: number;
  heart: number;
}

// Experience calculation - scaling formula
export function calculateExperienceRequired(level: number): number {
  // Base 100 XP for level 1, increases by 50% each level
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

// Calculate detailed stats from base stats
export function calculateDetailedStats(stats: CharacterStats, age: number = 16): DetailedStats {
  const ageMultiplier = getAgeMultiplier(age);
  
  return {
    // Body-derived stats
    physicalAttack: Math.floor((stats.body * 1.5 + 5) * ageMultiplier.body),
    physicalDefense: Math.floor((stats.body * 1.2 + 3) * ageMultiplier.body),
    accuracy: Math.floor((stats.body * 0.8 + stats.mind * 0.4 + 8) * ageMultiplier.body),
    speed: Math.floor((stats.body * 0.6 + stats.mind * 0.4 + 8) * ageMultiplier.body),
    
    // Mind-derived stats
    mentalAttack: Math.floor((stats.mind * 1.5 + 5) * ageMultiplier.mind),
    mentalDefense: Math.floor((stats.mind * 1.2 + 3) * ageMultiplier.mind),
    evasion: Math.floor((stats.mind * 0.8 + stats.body * 0.2 + 5) * ageMultiplier.mind),
    perception: Math.floor((stats.mind * 1.0 + stats.heart * 0.3 + 6) * ageMultiplier.mind),
    
    // Heart-derived stats
    socialAttack: Math.floor((stats.heart * 1.5 + 5) * ageMultiplier.heart),
    socialDefense: Math.floor((stats.heart * 1.2 + 3) * ageMultiplier.heart),
    ailmentAttack: Math.floor((stats.heart * 0.8 + stats.mind * 0.4 + 4) * ageMultiplier.heart),
    ailmentDefense: Math.floor((stats.heart * 1.0 + stats.mind * 0.2 + 4) * ageMultiplier.heart)
  };
}

// Age affects stats - youth has high body, maturity has high mind/heart
function getAgeMultiplier(age: number): { body: number; mind: number; heart: number } {
  if (age <= 16) {
    // Youth: Strong body, developing mind/heart
    return { body: 1.1, mind: 0.8, heart: 0.7 };
  } else if (age <= 25) {
    // Young adult: Balanced stats
    return { body: 1.0, mind: 1.0, heart: 1.0 };
  } else if (age <= 40) {
    // Adult: Strong mind, mature heart, declining body
    return { body: 0.9, mind: 1.2, heart: 1.1 };
  } else if (age <= 60) {
    // Middle age: Wisdom peak, heart maturity
    return { body: 0.8, mind: 1.3, heart: 1.2 };
  } else {
    // Elder: Physical decline, mental/social wisdom
    return { body: 0.6, mind: 1.4, heart: 1.3 };
  }
}

// Add experience and handle level ups
export function addExperience(character: Character, expGained: number): Character {
  let updatedCharacter = { ...character };
  updatedCharacter.experience += expGained;
  
  // Handle multiple level ups
  while (updatedCharacter.experience >= updatedCharacter.experienceToNext) {
    updatedCharacter = levelUp(updatedCharacter);
  }
  
  return updatedCharacter;
}

// Level up character
export function levelUp(character: Character): Character {
  const updatedCharacter = { ...character };
  
  // Subtract experience used
  updatedCharacter.experience -= updatedCharacter.experienceToNext;
  
  // Increase level
  updatedCharacter.level += 1;
  
  // Calculate new experience requirement
  updatedCharacter.experienceToNext = calculateExperienceRequired(updatedCharacter.level + 1);
  
  // Award stat points and skill points
  updatedCharacter.availableStatPoints += 3; // 3 stat points per level
  updatedCharacter.skillPoints += 1; // 1 skill point per level
  
  // Increase health and mana based on level
  const healthIncrease = 5 + Math.floor(updatedCharacter.stats.body / 2);
  const manaIncrease = 3 + Math.floor(updatedCharacter.stats.mind / 2);
  
  updatedCharacter.stats.health += healthIncrease;
  updatedCharacter.stats.mana += manaIncrease;
  
  // Recalculate detailed stats
  updatedCharacter.detailedStats = calculateDetailedStats(updatedCharacter.stats, updatedCharacter.age);
  
  return updatedCharacter;
}

// Allocate stat points
export function allocateStatPoints(character: Character, allocation: StatAllocation): Character {
  const totalPoints = allocation.body + allocation.mind + allocation.heart;
  
  if (totalPoints > character.availableStatPoints) {
    throw new Error('Insufficient stat points');
  }
  
  const updatedCharacter = { ...character };
  
  // Apply stat increases
  updatedCharacter.stats.body += allocation.body;
  updatedCharacter.stats.mind += allocation.mind;
  updatedCharacter.stats.heart += allocation.heart;
  
  // Reduce available points
  updatedCharacter.availableStatPoints -= totalPoints;
  
  // Recalculate health and mana based on new stats
  const bodyHealthBonus = allocation.body * 5;
  const mindManaBonus = allocation.mind * 3;
  
  updatedCharacter.stats.health += bodyHealthBonus;
  updatedCharacter.stats.mana += mindManaBonus;
  
  // Recalculate all detailed stats
  updatedCharacter.detailedStats = calculateDetailedStats(updatedCharacter.stats, updatedCharacter.age);
  
  return updatedCharacter;
}

// Create a new character with starting stats
export function createCharacter(name: string, portrait: string, age: number = 15): Character {
  // Base stats for new character - starting as child with basic stats
  const baseStats: CharacterStats = {
    body: 8,
    mind: 6,
    heart: 5,
    health: 50, // Base health
    mana: 25    // Base mana
  };
  
  // Apply portrait bonuses (from existing CharacterContext)
  const portraitBonuses = getPortraitBonuses(portrait);
  baseStats.body += portraitBonuses.body;
  baseStats.mind += portraitBonuses.mind;
  baseStats.heart += portraitBonuses.heart;
  
  // Adjust health/mana based on stat bonuses
  baseStats.health += portraitBonuses.body * 5;
  baseStats.mana += portraitBonuses.mind * 3;
  
  const character: Character = {
    id: `char-${Date.now()}`,
    name,
    level: 1,
    experience: 0,
    experienceToNext: calculateExperienceRequired(2),
    age,
    stats: baseStats,
    detailedStats: calculateDetailedStats(baseStats, age),
    availableStatPoints: 0,
    skillPoints: 0,
    currentLocation: 'starting_town',
    unlockedLocations: ['starting_town']
  };
  
  return character;
}

// Get portrait bonuses (simplified from existing system)
function getPortraitBonuses(portrait: string): { body: number; mind: number; heart: number } {
  const bonuses: Record<string, { body: number; mind: number; heart: number }> = {
    'elf': { body: 0, mind: 1, heart: 1 },
    'Drake': { body: 2, mind: 0, heart: 0 },
    'Arc-mage': { body: 0, mind: 2, heart: 0 },
    // Locked portraits with stronger bonuses
    'Air-lord': { body: 0, mind: 2, heart: 2 },
    'Angel': { body: 1, mind: 1, heart: 3 },
    'Arch-demon': { body: 3, mind: 2, heart: 1 },
  };
  
  return bonuses[portrait] || { body: 0, mind: 0, heart: 0 };
}

// Age character (for labyrinth progression)
export function ageCharacter(character: Character, yearsToAdd: number = 1): Character {
  const updatedCharacter = { ...character };
  updatedCharacter.age += yearsToAdd;
  
  // Recalculate detailed stats with new age multipliers
  updatedCharacter.detailedStats = calculateDetailedStats(updatedCharacter.stats, updatedCharacter.age);
  
  return updatedCharacter;
}

// Equipment functions
export function equipItem(character: Character, item: Item, equipment: Equipment): { character: Character; equipment: Equipment } {
  if (character.level < item.levelRequirement) {
    throw new Error('Level requirement not met');
  }
  
  const updatedEquipment = { ...equipment };
  
  // Equip item based on type
  switch (item.type) {
    case 'weapon':
      updatedEquipment.weapon = item;
      break;
    case 'armor':
      updatedEquipment.armor = item;
      break;
    case 'accessory':
      updatedEquipment.accessories = [...equipment.accessories, item];
      break;
  }
  
  // Apply item bonuses to character
  const updatedCharacter = applyEquipmentBonuses(character, updatedEquipment);
  
  return { character: updatedCharacter, equipment: updatedEquipment };
}

// Apply equipment bonuses to character stats
export function applyEquipmentBonuses(character: Character, equipment: Equipment): Character {
  const updatedCharacter = { ...character };
  const equipmentBonuses: Partial<DetailedStats> = {};
  
  // Collect all bonuses from equipped items
  const items = [equipment.weapon, equipment.armor, ...equipment.accessories].filter(Boolean) as Item[];
  
  items.forEach(item => {
    Object.entries(item.statBonuses).forEach(([stat, bonus]) => {
      if (bonus) {
        equipmentBonuses[stat as keyof DetailedStats] = 
          (equipmentBonuses[stat as keyof DetailedStats] || 0) + bonus;
      }
    });
  });
  
  // Apply bonuses to detailed stats
  Object.entries(equipmentBonuses).forEach(([stat, bonus]) => {
    if (bonus) {
      (updatedCharacter.detailedStats as any)[stat] += bonus;
    }
  });
  
  return updatedCharacter;
}

// Calculate set bonuses (for future expansion)
export function calculateSetBonuses(items: Item[]): string[] {
  const setBonuses: string[] = [];
  
  // Count set pieces
  const setPieces: Record<string, number> = {};
  
  items.forEach(item => {
    item.specialEffects?.forEach(effect => {
      if (effect.includes('_set_piece')) {
        const setName = effect.replace('_set_piece', '');
        setPieces[setName] = (setPieces[setName] || 0) + 1;
      }
    });
  });
  
  // Check for set completion bonuses
  Object.entries(setPieces).forEach(([setName, count]) => {
    if (count >= 2) {
      setBonuses.push(`${setName}_set_bonus`);
    }
  });
  
  return setBonuses;
}