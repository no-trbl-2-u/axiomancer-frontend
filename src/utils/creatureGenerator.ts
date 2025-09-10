export interface CreatureStats {
  body: number;
  mind: number;
  heart: number;
  maxHp: number;
  currentHp: number;
}

export interface Creature {
  name: string;
  image: string;
  stats: CreatureStats;
  moveType: 'body' | 'mind' | 'heart';
}

// List of creature names based on the files in public/images/creatures/
const CREATURE_NAMES = [
  'Abortive',
  'Abyss Worm Green',
  'Abyss Worm Purple', 
  'Ahimsa',
  'Air Elemental Lord',
  'Air Giant',
  'Alioch',
  'Ananta',
  'Angel',
  'Annihilator',
  'Apocalypse',
  'Arachne',
  'Arc Bishop',
  'Arc Demon',
  'Arc Dragon',
  'Arc Elf',
  'Arc Giant',
  'Arc Mage',
  'Arc Ogre',
  'Arc Vampire',
  'Archangel',
  'Archduke',
  'Archfiend',
  'Argus',
  'Astaroth',
  'Astral',
  'Avatar',
  'Baal',
  'Banshee',
  'Basilisk',
  'Beelzebub',
  'Behemoth',
  'Beleth',
  'Berith',
  'Black Dragon',
  'Black Knight',
  'Black Wizard',
  'Blue Dragon',
  'Bone Dragon',
  'Bone Knight',
  'Bull Demon',
  'Cerberus',
  'Cherub',
  'Chimera',
  'Cyclops',
  'Dark Angel',
  'Dark Elf',
  'Dark Knight',
  'Death',
  'Demon',
  'Demon Lord',
  'Devil',
  'Doppelganger',
  'Drake',
  'Dullahan',
  'Earth Elemental Lord',
  'Earth Giant',
  'Elf',
  'Fallen Angel',
  'Fenrir',
  'Fire Dragon',
  'Fire Elemental Lord',
  'Fire Giant',
  'Frost Giant',
  'Gargoyle',
  'Ghost',
  'Ghoul',
  'Giant',
  'Goblin King',
  'Golden Dragon',
  'Golem',
  'Gorgon',
  'Greater Demon',
  'Green Dragon',
  'Griffin',
  'Grim Reaper',
  'Harpy',
  'Hell Hound',
  'Hydra',
  'Ice Dragon',
  'Ifrit',
  'Incubus',
  'Iron Golem',
  'Jabberwocky',
  'Kraken',
  'Lich',
  'Lich King',
  'Lightning Dragon',
  'Lucifer',
  'Malphas',
  'Manticore',
  'Medusa',
  'Minotaur',
  'Nightmare',
  'Ogre',
  'Oni',
  'Phoenix',
  'Rakshasa',
  'Red Dragon',
  'Salamander',
  'Seraph',
  'Shadow',
  'Silver Dragon',
  'Skeleton King',
  'Sphinx',
  'Storm Giant',
  'Succubus',
  'Tiamat',
  'Titan',
  'Troll',
  'Undead Dragon',
  'Unicorn',
  'Valkyrie',
  'Vampire',
  'Vampire Lord',
  'Water Elemental Lord',
  'Water Giant',
  'White Dragon',
  'Wyvern',
  'Zombie'
];

const MOVE_TYPES: ('body' | 'mind' | 'heart')[] = ['body', 'mind', 'heart'];

export function generateRandomCreature(playerStats: { body: number; mind: number; heart: number }): Creature {
  // Select random creature name and image
  const randomName = CREATURE_NAMES[Math.floor(Math.random() * CREATURE_NAMES.length)];
  const imagePath = `/images/creatures/Identified Monster Ver.21/${randomName}.jpg`;
  
  // Generate stats that are slightly weaker than player (playerStat - 1, minimum 1)
  const creatureStats: CreatureStats = {
    body: Math.max(1, playerStats.body - 1),
    mind: Math.max(1, playerStats.mind - 1),
    heart: Math.max(1, playerStats.heart - 1),
    maxHp: Math.max(10, (playerStats.body - 1) * 5 + 20),
    currentHp: 0 // Will be set to maxHp below
  };
  
  creatureStats.currentHp = creatureStats.maxHp;
  
  // Select random move type preference
  const randomMoveType = MOVE_TYPES[Math.floor(Math.random() * MOVE_TYPES.length)];
  
  return {
    name: randomName.replace(/_/g, ' '), // Clean up underscores in name
    image: imagePath,
    stats: creatureStats,
    moveType: randomMoveType
  };
}

// Helper function to get creature advantage tooltip text
export function getAdvantageText(playerMove: 'body' | 'mind' | 'heart', enemyMove: 'body' | 'mind' | 'heart'): string {
  if (
    (playerMove === 'body' && enemyMove === 'mind') ||
    (playerMove === 'mind' && enemyMove === 'heart') ||
    (playerMove === 'heart' && enemyMove === 'body')
  ) {
    return 'ADVANTAGE: Your move is effective!';
  } else if (
    (playerMove === 'mind' && enemyMove === 'body') ||
    (playerMove === 'heart' && enemyMove === 'mind') ||
    (playerMove === 'body' && enemyMove === 'heart')
  ) {
    return 'DISADVANTAGE: Your move is weak!';
  }
  return 'NEUTRAL: Equal effectiveness.';
}

// Combat damage calculation
export function calculateDamage(
  attackerStat: number, 
  defenderStat: number, 
  advantage: 'advantage' | 'neutral' | 'disadvantage'
): number {
  let baseDamage = Math.max(1, attackerStat - defenderStat + Math.floor(Math.random() * 6)); // 1-6 random variance
  
  switch (advantage) {
    case 'advantage':
      baseDamage = Math.floor(baseDamage * 1.5);
      break;
    case 'disadvantage':
      baseDamage = Math.floor(baseDamage * 0.5);
      break;
    case 'neutral':
    default:
      // No modifier
      break;
  }
  
  return Math.max(1, baseDamage); // Minimum 1 damage
}