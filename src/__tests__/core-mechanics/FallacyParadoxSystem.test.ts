import { describe, it, expect } from '@jest/globals';
import { 
  FALLACIES,
  getStartingFallacies,
  learnFallacy,
  gainFallacyExperience,
  getRandomFallacyChallenge,
  calculateFallacyDefenseReduction,
  getFallacyForSpecialAttack,
  canLearnFallacy,
  createInitialKnowledge
} from '../../systems/FallacyParadoxSystem';
import type { 
  Fallacy,
  PlayerKnowledge,
  FallacyCombatEffect
} from '../../systems/FallacyParadoxSystem';

describe('Fallacy and Paradox System', () => {
  describe('Fallacy Database and Management', () => {
    it('should contain comprehensive fallacy database', () => {
      expect(Object.keys(FALLACIES).length).toBeGreaterThan(0);
      expect(FALLACIES['ad_hominem']).toBeDefined();
      expect(FALLACIES['straw_man']).toBeDefined();
      expect(FALLACIES['zenos_paradox']).toBeDefined();
    });

    it('should provide starting fallacies for new characters', () => {
      const startingFallacies = getStartingFallacies();
      expect(startingFallacies).toContain('ad_hominem');
      expect(startingFallacies).toContain('straw_man');
      expect(startingFallacies).toContain('zenos_paradox');
    });

    it('should allow learning new fallacies', () => {
      const knowledge = createInitialKnowledge();
      const updatedKnowledge = learnFallacy(knowledge, 'false_dichotomy');
      
      expect(updatedKnowledge.knownFallacies).toContain('false_dichotomy');
      expect(updatedKnowledge.fallacyExperience['false_dichotomy']).toBe(0);
    });

    it('should gain experience with fallacies', () => {
      const knowledge = createInitialKnowledge();
      const updatedKnowledge = gainFallacyExperience(knowledge, 'ad_hominem');
      
      expect(updatedKnowledge.fallacyExperience['ad_hominem']).toBe(1);
    });

    it('should master fallacies after sufficient experience', () => {
      let knowledge = createInitialKnowledge();
      
      // Gain experience 5 times to master the fallacy
      for (let i = 0; i < 5; i++) {
        knowledge = gainFallacyExperience(knowledge, 'ad_hominem');
      }
      
      expect(knowledge.masteredFallacies).toContain('ad_hominem');
    });
  });

  describe('Combat Integration', () => {
    it('should generate random fallacy challenges', () => {
      const knowledge = createInitialKnowledge();
      const challenge = getRandomFallacyChallenge(knowledge, 'medium');
      
      expect(challenge).toBeDefined();
      expect(challenge.name).toBeDefined();
      expect(challenge.question).toBeDefined();
      expect(challenge.options).toHaveLength(4);
      expect(challenge.correctAnswer).toBeGreaterThanOrEqual(0);
      expect(challenge.correctAnswer).toBeLessThan(4);
    });

    it('should calculate defense reduction for correct identification', () => {
      const knowledge = createInitialKnowledge();
      const fallacy = FALLACIES['ad_hominem'];
      
      const correctReduction = calculateFallacyDefenseReduction(fallacy, true, knowledge);
      const incorrectReduction = calculateFallacyDefenseReduction(fallacy, false, knowledge);
      
      expect(correctReduction).toBeLessThan(incorrectReduction);
      expect(correctReduction).toBeLessThanOrEqual(1.0);
      expect(incorrectReduction).toBe(1.0);
    });

    it('should get appropriate fallacies for special attacks', () => {
      const knowledge = createInitialKnowledge();
      
      const mindFallacy = getFallacyForSpecialAttack('Mind', knowledge);
      const heartFallacy = getFallacyForSpecialAttack('Heart', knowledge);
      
      expect(mindFallacy).toBeDefined();
      expect(heartFallacy).toBeDefined();
    });

    it('should check level requirements for learning fallacies', () => {
      const knowledge = createInitialKnowledge();
      
      const canLearnBasic = canLearnFallacy('ad_hominem', 1, knowledge);
      const canLearnComplex = canLearnFallacy('liar_paradox', 1, knowledge);
      
      expect(canLearnBasic).toBe(false); // Already known
      expect(canLearnComplex).toBe(false); // Requires higher level
    });
  });

  describe('Knowledge System', () => {
    it('should create initial knowledge with starting fallacies', () => {
      const knowledge = createInitialKnowledge();
      
      expect(knowledge.knownFallacies.length).toBeGreaterThan(0);
      expect(knowledge.masteredFallacies).toHaveLength(0);
      expect(knowledge.fallacyExperience).toBeDefined();
    });

    it('should track fallacy experience correctly', () => {
      let knowledge = createInitialKnowledge();
      
      knowledge = gainFallacyExperience(knowledge, 'ad_hominem');
      knowledge = gainFallacyExperience(knowledge, 'ad_hominem');
      knowledge = gainFallacyExperience(knowledge, 'straw_man');
      
      expect(knowledge.fallacyExperience['ad_hominem']).toBe(2);
      expect(knowledge.fallacyExperience['straw_man']).toBe(1);
    });
  });
});