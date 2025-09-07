// Combat System Implementation
// Based on D20 mechanics: 1d20 + stat vs defense
// Damage: 1d6 normal, 1d4 disadvantage/defended, 1d8 advantage

export type MoveType = 'Body' | 'Mind' | 'Heart';
export type ActionType = 'Attack' | 'SpecialAttack' | 'Defend';
export type AdvantageType = 'advantage' | 'neutral' | 'disadvantage';

export interface CombatAction {
  type: MoveType;
  action: ActionType;
}

export interface CombatantStats {
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  body: number;
  mind: number;
  heart: number;
  // Detailed stats
  physicalAttack: number;
  physicalDefense: number;
  mentalAttack: number;
  mentalDefense: number;
  socialAttack: number;
  socialDefense: number;
  speed: number;
  evasion: number;
  accuracy: number;
  ailmentAttack: number;
  ailmentDefense: number;
}

export interface BuffDebuff {
  id: string;
  type: 'buff' | 'debuff';
  name: string;
  effect: string;
  duration: number;
  statModifiers: Partial<CombatantStats>;
}

export interface CombatResult {
  playerDamage: number;
  enemyDamage: number;
  playerBuffs: BuffDebuff[];
  enemyBuffs: BuffDebuff[];
  agreementPoints: number;
  fallacyChallenge?: FallacyChallenge;
  combatEnded: boolean;
  victor?: 'player' | 'enemy' | 'agreement';
}

export interface FallacyChallenge {
  fallacyName: string;
  description: string;
  options: string[];
  correctAnswer: number;
}

export interface CombatState {
  player: CombatantStats;
  enemy: CombatantStats;
  playerBuffs: BuffDebuff[];
  enemyBuffs: BuffDebuff[];
  agreementPoints: number;
  turnCount: number;
}

// Dice rolling utility
function rollD20(): number {
  return Math.floor(Math.random() * 20) + 1;
}

function rollD4(): number {
  return Math.floor(Math.random() * 4) + 1;
}

function rollD6(): number {
  return Math.floor(Math.random() * 6) + 1;
}

function rollD8(): number {
  return Math.floor(Math.random() * 8) + 1;
}

// Advantage system: Body > Mind > Heart > Body (rock-paper-scissors)
export function calculateAdvantage(playerType: MoveType, enemyType: MoveType): AdvantageType {
  if (playerType === enemyType) return 'neutral';
  
  const advantageMap: Record<MoveType, MoveType> = {
    'Body': 'Mind',
    'Mind': 'Heart', 
    'Heart': 'Body'
  };
  
  if (advantageMap[playerType] === enemyType) {
    return 'advantage';
  } else {
    return 'disadvantage';
  }
}

// Calculate hit chance using D20 system
function calculateHit(attackerAccuracy: number, defenderEvasion: number): boolean {
  const roll = rollD20();
  const totalHit = roll + attackerAccuracy;
  return totalHit > defenderEvasion;
}

// Calculate damage based on advantage and action
function calculateDamage(advantage: AdvantageType, action: ActionType, isDefending: boolean): number {
  let baseDamage = 0;
  
  if (isDefending) {
    // Reduced damage when opponent is defending
    baseDamage = rollD4();
  } else if (advantage === 'advantage') {
    baseDamage = rollD8();
  } else if (advantage === 'disadvantage') {
    baseDamage = rollD4();
  } else {
    baseDamage = rollD6();
  }
  
  // Special attacks do slightly more damage but cost mana
  if (action === 'SpecialAttack') {
    baseDamage += 1;
  }
  
  return Math.max(1, baseDamage); // Minimum 1 damage
}

// Get relevant attack stat based on move type
function getAttackStat(stats: CombatantStats, moveType: MoveType): number {
  switch (moveType) {
    case 'Body': return stats.physicalAttack;
    case 'Mind': return stats.mentalAttack;
    case 'Heart': return stats.socialAttack;
  }
}

// Get relevant defense stat based on move type
// Currently unused but kept for future combat system enhancements
// function getDefenseStat(stats: CombatantStats, moveType: MoveType): number {
//   switch (moveType) {
//     case 'Body': return stats.physicalDefense;
//     case 'Mind': return stats.mentalDefense;
//     case 'Heart': return stats.socialDefense;
//   }
// }

// Apply buffs/debuffs to stats
function applyBuffsToStats(baseStats: CombatantStats, buffs: BuffDebuff[]): CombatantStats {
  const modifiedStats = { ...baseStats };
  
  buffs.forEach(buff => {
    Object.entries(buff.statModifiers).forEach(([stat, value]) => {
      if (value !== undefined) {
        (modifiedStats as any)[stat] = Math.max(1, (modifiedStats as any)[stat] + value);
      }
    });
  });
  
  return modifiedStats;
}

// Create fallacy challenge for defense actions
function createFallacyChallenge(): FallacyChallenge {
  // Starting with Zeno's Paradox as the example
  const fallacies: FallacyChallenge[] = [
    {
      fallacyName: "Zeno's Paradox",
      description: "Your opponent argues: 'To reach your destination, you must first travel half the distance. But to travel half the distance, you must first travel a quarter of the distance, and so on infinitely. Therefore, motion is impossible.' What is the flaw?",
      options: [
        "Motion requires time, not just space",
        "Infinite divisions still sum to a finite distance",
        "The paradox ignores quantum mechanics", 
        "Mathematics cannot describe reality"
      ],
      correctAnswer: 1
    },
    {
      fallacyName: "Ad Hominem Fallacy",
      description: "Your opponent declares: 'Your argument about combat strategy is invalid because you're just a child from a fishing village.' What logical fallacy is this?",
      options: [
        "Attacking the person instead of the argument",
        "Appealing to false authority",
        "Creating a false dichotomy",
        "Using circular reasoning"
      ],
      correctAnswer: 0
    },
    {
      fallacyName: "False Dichotomy",
      description: "Your opponent claims: 'Either you surrender completely, or you are my mortal enemy forever. Choose!' What's wrong with this reasoning?",
      options: [
        "It assumes time is linear",
        "It ignores the possibility of compromise or other options",
        "It relies on emotional manipulation",
        "It contradicts logical consistency"
      ],
      correctAnswer: 1
    }
  ];
  
  return fallacies[Math.floor(Math.random() * fallacies.length)];
}

// Process special attack effects
function processSpecialAttack(attacker: CombatantStats, defender: CombatantStats, moveType: MoveType): BuffDebuff[] {
  const effects: BuffDebuff[] = [];
  
  // Basic special attack effects based on move type
  switch (moveType) {
    case 'Body':
      // Intimidation effect - reduce enemy accuracy
      effects.push({
        id: 'intimidated',
        type: 'debuff',
        name: 'Intimidated',
        effect: 'Reduced accuracy from physical intimidation',
        duration: 3,
        statModifiers: { accuracy: -2 }
      });
      break;
      
    case 'Mind':
      // Poison Mind - mental confusion debuff
      effects.push({
        id: 'poison_mind',
        type: 'debuff',
        name: 'Poisoned Mind',
        effect: 'Mental confusion reduces mental defense',
        duration: 4,
        statModifiers: { mentalDefense: -3, mentalAttack: -1 }
      });
      break;
      
    case 'Heart':
      // Empathic boost - temporary social attack increase
      effects.push({
        id: 'empathic_boost',
        type: 'buff',
        name: 'Empathic Insight',
        effect: 'Increased social effectiveness',
        duration: 2,
        statModifiers: { socialAttack: 3, socialDefense: 1 }
      });
      break;
  }
  
  return effects;
}

// Main combat calculation function
export function calculateCombat(
  playerAction: CombatAction,
  enemyAction: CombatAction,
  playerStats: CombatantStats,
  enemyStats: CombatantStats,
  playerBuffs: BuffDebuff[] = [],
  enemyBuffs: BuffDebuff[] = [],
  agreementPoints: number = 0
): CombatResult {
  
  // Apply buffs to stats
  const effectivePlayerStats = applyBuffsToStats(playerStats, playerBuffs);
  const effectiveEnemyStats = applyBuffsToStats(enemyStats, enemyBuffs);
  
  let result: CombatResult = {
    playerDamage: 0,
    enemyDamage: 0,
    playerBuffs: [],
    enemyBuffs: [],
    agreementPoints,
    combatEnded: false
  };
  
  // Handle both defending - agreement point case
  if (playerAction.action === 'Defend' && enemyAction.action === 'Defend') {
    result.agreementPoints += 1;
    if (result.agreementPoints >= 3) {
      result.combatEnded = true;
      result.victor = 'agreement';
    }
    return result;
  }
  
  // Calculate advantage for player
  const playerAdvantage = calculateAdvantage(playerAction.type, enemyAction.type);
  const enemyAdvantage = calculateAdvantage(enemyAction.type, playerAction.type);
  
  // Handle player action
  if (playerAction.action !== 'Defend') {
    const playerAccuracy = effectivePlayerStats.accuracy + getAttackStat(effectivePlayerStats, playerAction.type);
    const enemyEvasion = effectiveEnemyStats.evasion;
    
    if (calculateHit(playerAccuracy, enemyEvasion)) {
      result.enemyDamage = calculateDamage(playerAdvantage, playerAction.action, enemyAction.action === 'Defend');
      
      // Apply special attack effects
      if (playerAction.action === 'SpecialAttack') {
        result.enemyBuffs = processSpecialAttack(effectivePlayerStats, effectiveEnemyStats, playerAction.type);
      }
    }
  } else {
    // Player is defending - create fallacy challenge
    result.fallacyChallenge = createFallacyChallenge();
  }
  
  // Handle enemy action
  if (enemyAction.action !== 'Defend') {
    const enemyAccuracy = effectiveEnemyStats.accuracy + getAttackStat(effectiveEnemyStats, enemyAction.type);
    const playerEvasion = effectivePlayerStats.evasion;
    
    if (calculateHit(enemyAccuracy, playerEvasion)) {
      result.playerDamage = calculateDamage(enemyAdvantage, enemyAction.action, playerAction.action === 'Defend');
      
      // Apply special attack effects to player
      if (enemyAction.action === 'SpecialAttack') {
        result.playerBuffs = processSpecialAttack(effectiveEnemyStats, effectivePlayerStats, enemyAction.type);
      }
    }
  }
  
  return result;
}

// Apply fallacy defense result
export function applyFallacyDefense(incomingDamage: number, fallacyCorrect: boolean): number {
  if (fallacyCorrect) {
    // Successful fallacy identification greatly reduces damage
    return Math.floor(incomingDamage * 0.25);
  } else {
    // Failed identification - take normal damage
    return incomingDamage;
  }
}

// Process turn-based buff/debuff duration
export function processTurnBuffs(buffs: BuffDebuff[]): BuffDebuff[] {
  return buffs
    .map(buff => ({ ...buff, duration: buff.duration - 1 }))
    .filter(buff => buff.duration > 0);
}

// Calculate turn order based on speed
export function calculateTurnOrder(playerStats: CombatantStats, enemyStats: CombatantStats): 'player' | 'enemy' {
  return playerStats.speed >= enemyStats.speed ? 'player' : 'enemy';
}

// Check if combat should end
export function checkCombatEnd(playerHealth: number, enemyHealth: number, agreementPoints: number): { 
  ended: boolean; 
  victor?: 'player' | 'enemy' | 'agreement' 
} {
  if (agreementPoints >= 3) {
    return { ended: true, victor: 'agreement' };
  }
  
  if (playerHealth <= 0) {
    return { ended: true, victor: 'enemy' };
  }
  
  if (enemyHealth <= 0) {
    return { ended: true, victor: 'player' };
  }
  
  return { ended: false };
}

// Calculate base damage for character
export function calculateBaseDamage(character: CombatantStats, action: CombatAction): number {
  const baseStat = getAttackStat(character, action.type);
  const damage = calculateDamage('neutral', action.action, false);
  
  // Add stat modifier to damage (small bonus from high stats)
  return damage + Math.floor(baseStat / 10);
}