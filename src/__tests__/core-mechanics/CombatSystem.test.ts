import { describe, it, expect } from '@jest/globals';
import { 
  calculateCombat, 
  calculateAdvantage, 
  applyFallacyDefense, 
  processTurnBuffs, 
  calculateTurnOrder,
  checkCombatEnd,
  calculateBaseDamage
} from '../../systems/CombatSystem';
import type { 
  CombatAction, 
  CombatResult, 
  CombatantStats, 
  BuffDebuff, 
  AdvantageType 
} from '../../systems/CombatSystem';

describe('Combat System Implementation', () => {
  // Mock stats for testing
  const mockPlayerStats: CombatantStats = {
    health: 100,
    maxHealth: 100,
    mana: 50,
    maxMana: 50,
    body: 15,
    mind: 12,
    heart: 10,
    physicalAttack: 18,
    physicalDefense: 15,
    mentalAttack: 15,
    mentalDefense: 12,
    socialAttack: 13,
    socialDefense: 10,
    speed: 12,
    evasion: 8,
    accuracy: 14,
    ailmentAttack: 8,
    ailmentDefense: 9
  };

  const mockEnemyStats: CombatantStats = {
    health: 80,
    maxHealth: 80,
    mana: 40,
    maxMana: 40,
    body: 12,
    mind: 10,
    heart: 8,
    physicalAttack: 15,
    physicalDefense: 12,
    mentalAttack: 12,
    mentalDefense: 10,
    socialAttack: 10,
    socialDefense: 8,
    speed: 10,
    evasion: 6,
    accuracy: 12,
    ailmentAttack: 6,
    ailmentDefense: 7
  };

  describe('Advantage System', () => {
    it('should implement Body > Mind advantage correctly', () => {
      const advantage = calculateAdvantage('Body', 'Mind');
      expect(advantage).toBe('advantage');
    });

    it('should implement Mind > Heart advantage correctly', () => {
      const advantage = calculateAdvantage('Mind', 'Heart');
      expect(advantage).toBe('advantage');
    });

    it('should implement Heart > Body advantage correctly', () => {
      const advantage = calculateAdvantage('Heart', 'Body');
      expect(advantage).toBe('advantage');
    });

    it('should handle equal matchups correctly', () => {
      expect(calculateAdvantage('Body', 'Body')).toBe('neutral');
      expect(calculateAdvantage('Mind', 'Mind')).toBe('neutral');
      expect(calculateAdvantage('Heart', 'Heart')).toBe('neutral');
    });

    it('should handle disadvantage correctly', () => {
      expect(calculateAdvantage('Mind', 'Body')).toBe('disadvantage');
      expect(calculateAdvantage('Heart', 'Mind')).toBe('disadvantage');
      expect(calculateAdvantage('Body', 'Heart')).toBe('disadvantage');
    });
  });

  describe('Damage Calculation', () => {
    it('should calculate damage based on character stats', () => {
      const action: CombatAction = { type: 'Body', action: 'Attack' };
      const damage = calculateBaseDamage(mockPlayerStats, action);
      
      expect(damage).toBeGreaterThan(0);
      expect(damage).toBeLessThan(20); // Reasonable damage range
    });

    it('should handle combat calculation with different actions', () => {
      const playerAction: CombatAction = { type: 'Body', action: 'Attack' };
      const enemyAction: CombatAction = { type: 'Mind', action: 'Attack' };
      
      const result = calculateCombat(
        playerAction, 
        enemyAction, 
        mockPlayerStats, 
        mockEnemyStats
      );
      
      expect(result).toBeDefined();
      expect(result.playerDamage).toBeGreaterThanOrEqual(0);
      expect(result.enemyDamage).toBeGreaterThanOrEqual(0);
    });

    it('should handle special attack damage and effects', () => {
      const playerAction: CombatAction = { type: 'Mind', action: 'SpecialAttack' };
      const enemyAction: CombatAction = { type: 'Body', action: 'Attack' };
      
      const result = calculateCombat(
        playerAction, 
        enemyAction, 
        mockPlayerStats, 
        mockEnemyStats
      );
      
      expect(result).toBeDefined();
      // Special attacks may apply buffs/debuffs
      expect(result.enemyBuffs).toBeDefined();
    });
  });

  describe('Fallacy Mini-Game', () => {
    it('should trigger fallacy mini-game when player defends', () => {
      const playerAction: CombatAction = { type: 'Mind', action: 'Defend' };
      const enemyAction: CombatAction = { type: 'Body', action: 'Attack' };
      
      const result = calculateCombat(
        playerAction, 
        enemyAction, 
        mockPlayerStats, 
        mockEnemyStats
      );
      
      expect(result.fallacyChallenge).toBeDefined();
      expect(result.fallacyChallenge?.fallacyName).toBeDefined();
      expect(result.fallacyChallenge?.options).toHaveLength(4);
    });

    it('should reduce damage when fallacy is correctly identified', () => {
      const fallacyIdentified = true;
      const incomingDamage = 20;
      
      const finalDamage = applyFallacyDefense(incomingDamage, fallacyIdentified);
      expect(finalDamage).toBeLessThan(incomingDamage * 0.5);
      expect(finalDamage).toBe(5); // 25% of original damage
    });

    it('should apply full damage when fallacy identification fails', () => {
      const fallacyIdentified = false;
      const incomingDamage = 20;
      
      const finalDamage = applyFallacyDefense(incomingDamage, fallacyIdentified);
      expect(finalDamage).toBe(incomingDamage);
    });
  });

  describe('Agreement Points System', () => {
    it('should award agreement points when both players defend', () => {
      const playerAction: CombatAction = { type: 'Mind', action: 'Defend' };
      const enemyAction: CombatAction = { type: 'Heart', action: 'Defend' };
      
      const result = calculateCombat(
        playerAction, 
        enemyAction, 
        mockPlayerStats, 
        mockEnemyStats,
        [],
        [],
        0
      );
      
      expect(result.agreementPoints).toBe(1);
      expect(result.playerDamage).toBe(0);
      expect(result.enemyDamage).toBe(0);
    });

    it('should end combat peacefully at 3 agreement points', () => {
      const playerHealth = 50;
      const enemyHealth = 40;
      const agreementPoints = 3;
      
      const combatEnd = checkCombatEnd(playerHealth, enemyHealth, agreementPoints);
      expect(combatEnd.ended).toBe(true);
      expect(combatEnd.victor).toBe('agreement');
    });
  });

  describe('Buff and Debuff System', () => {
    it('should reduce buff/debuff duration each turn', () => {
      const buffs: BuffDebuff[] = [
        {
          id: 'strength',
          type: 'buff',
          name: 'Strength',
          effect: 'Increased physical power',
          duration: 2,
          statModifiers: { physicalAttack: 3 }
        },
        {
          id: 'weakness',
          type: 'debuff',
          name: 'Weakness',
          effect: 'Reduced physical power',
          duration: 1,
          statModifiers: { physicalAttack: -2 }
        }
      ];
      
      const updatedBuffs = processTurnBuffs(buffs);
      expect(updatedBuffs).toHaveLength(1); // One should have expired
      expect(updatedBuffs[0].duration).toBe(1);
      expect(updatedBuffs[0].id).toBe('strength');
    });

    it('should remove expired buffs/debuffs', () => {
      const buffs: BuffDebuff[] = [
        {
          id: 'expired',
          type: 'buff',
          name: 'Expired Buff',
          effect: 'This should be removed',
          duration: 0,
          statModifiers: { speed: 2 }
        },
        {
          id: 'active',
          type: 'buff', 
          name: 'Active Buff',
          effect: 'This should remain',
          duration: 1,
          statModifiers: { physicalAttack: 3 }
        }
      ];
      
      const activeBuffs = processTurnBuffs(buffs);
      expect(activeBuffs).toHaveLength(0); // Both should be processed and expired one removed
    });
  });

  describe('Combat State Management', () => {
    it('should track turn order based on speed stats', () => {
      const playerStats = { ...mockPlayerStats, speed: 12 };
      const enemyStats = { ...mockEnemyStats, speed: 8 };
      
      const turnOrder = calculateTurnOrder(playerStats, enemyStats);
      expect(turnOrder).toBe('player');
    });

    it('should handle equal speeds', () => {
      const playerStats = { ...mockPlayerStats, speed: 10 };
      const enemyStats = { ...mockEnemyStats, speed: 10 };
      
      const turnOrder = calculateTurnOrder(playerStats, enemyStats);
      expect(turnOrder).toBe('player'); // Player wins ties
    });

    it('should end combat when player reaches 0 HP', () => {
      const playerHealth = 0;
      const enemyHealth = 50;
      const agreementPoints = 1;
      
      const combatEnd = checkCombatEnd(playerHealth, enemyHealth, agreementPoints);
      expect(combatEnd.ended).toBe(true);
      expect(combatEnd.victor).toBe('enemy');
    });

    it('should end combat when enemy reaches 0 HP', () => {
      const playerHealth = 30;
      const enemyHealth = 0;
      const agreementPoints = 1;
      
      const combatEnd = checkCombatEnd(playerHealth, enemyHealth, agreementPoints);
      expect(combatEnd.ended).toBe(true);
      expect(combatEnd.victor).toBe('player');
    });

    it('should continue combat when both have health', () => {
      const playerHealth = 50;
      const enemyHealth = 40;
      const agreementPoints = 1;
      
      const combatEnd = checkCombatEnd(playerHealth, enemyHealth, agreementPoints);
      expect(combatEnd.ended).toBe(false);
    });
  });
});