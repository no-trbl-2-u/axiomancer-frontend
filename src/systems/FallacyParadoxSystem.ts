// Fallacy and Paradox System Implementation
// Famous philosophical fallacies and paradoxes for combat special attacks and defense

export interface Fallacy {
  id: string;
  name: string;
  type: 'fallacy' | 'paradox';
  category: 'logical' | 'rhetorical' | 'philosophical';
  description: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  combatEffect: FallacyCombatEffect;
}

export interface FallacyCombatEffect {
  damage: number;
  duration: number;
  statEffects: {
    [key: string]: number;
  };
  specialEffect?: string;
}

export interface PlayerKnowledge {
  knownFallacies: string[];
  masteredFallacies: string[];
  fallacyExperience: Record<string, number>; // How many times successfully identified
}

// Comprehensive fallacy database
export const FALLACIES: Record<string, Fallacy> = {
  // Classic Paradoxes (Mind-based special attacks)
  zenos_paradox: {
    id: 'zenos_paradox',
    name: "Zeno's Paradox of Motion",
    type: 'paradox',
    category: 'philosophical',
    description: "The famous paradox questioning the possibility of motion itself.",
    question: "Your opponent argues: 'To reach me, you must first travel half the distance. But to travel half, you must first travel a quarter, and so on infinitely. Therefore, you can never reach me.' What resolves this paradox?",
    options: [
      "Motion requires time, not just space",
      "Infinite divisions can still sum to a finite distance",
      "The paradox ignores quantum mechanics",
      "Mathematics cannot describe reality"
    ],
    correctAnswer: 1,
    explanation: "While there are infinite subdivisions, they form a convergent series that sums to the finite distance.",
    combatEffect: {
      damage: 8,
      duration: 3,
      statEffects: {
        mentalDefense: -4,
        evasion: -2
      },
      specialEffect: "temporal_confusion"
    }
  },

  ship_of_theseus: {
    id: 'ship_of_theseus',
    name: "Ship of Theseus",
    type: 'paradox',
    category: 'philosophical',
    description: "A paradox of identity: when all parts are replaced, is it still the same entity?",
    question: "Your opponent challenges: 'If I replace every part of your being through this battle - every thought, every belief - are you still you?' What is the core issue?",
    options: [
      "Identity is defined by physical continuity",
      "Identity persists through psychological continuity", 
      "The question assumes identity must be binary",
      "Identity is an illusion created by memory"
    ],
    correctAnswer: 2,
    explanation: "The paradox assumes identity is either/or, but identity may be more complex and gradual.",
    combatEffect: {
      damage: 6,
      duration: 4,
      statEffects: {
        socialDefense: -3,
        ailmentDefense: -2
      },
      specialEffect: "identity_crisis"
    }
  },

  // Logical Fallacies (General special attacks)
  ad_hominem: {
    id: 'ad_hominem',
    name: "Ad Hominem Attack",
    type: 'fallacy',
    category: 'rhetorical',
    description: "Attacking the person making the argument rather than the argument itself.",
    question: "Your opponent sneers: 'Your combat strategy is worthless because you're nothing but a naive child from a backwater village.' What logical error is this?",
    options: [
      "Attacking the person instead of addressing the argument",
      "Appealing to false authority",
      "Creating a false dichotomy",
      "Using circular reasoning"
    ],
    correctAnswer: 0,
    explanation: "Ad hominem attacks the character of the person rather than addressing their actual argument or position.",
    combatEffect: {
      damage: 5,
      duration: 2,
      statEffects: {
        socialAttack: -2,
        accuracy: -1
      }
    }
  },

  straw_man: {
    id: 'straw_man',
    name: "Straw Man Fallacy",
    type: 'fallacy',
    category: 'rhetorical',
    description: "Misrepresenting an opponent's argument to make it easier to attack.",
    question: "When you suggest a defensive strategy, your opponent responds: 'So you want to just hide and never fight back at all?' What fallacy is this?",
    options: [
      "False dichotomy - only two options presented",
      "Straw man - misrepresenting your actual position",
      "Slippery slope - assuming extreme consequences",
      "Appeal to emotion instead of logic"
    ],
    correctAnswer: 1,
    explanation: "The opponent has distorted your defensive strategy into complete pacifism, making it easier to attack.",
    combatEffect: {
      damage: 4,
      duration: 3,
      statEffects: {
        mentalAttack: -3,
        accuracy: -2
      }
    }
  },

  false_dichotomy: {
    id: 'false_dichotomy',
    name: "False Dichotomy",
    type: 'fallacy',
    category: 'logical',
    description: "Presenting only two options when more exist.",
    question: "Your opponent declares: 'Either you surrender completely and accept defeat, or you are my mortal enemy who must be destroyed!' What's the logical flaw?",
    options: [
      "It assumes time is linear and unchanging",
      "It ignores the possibility of compromise or alternative solutions",
      "It relies purely on emotional manipulation",
      "It contradicts the principle of logical consistency"
    ],
    correctAnswer: 1,
    explanation: "False dichotomy artificially limits choices to two extremes when many other options likely exist.",
    combatEffect: {
      damage: 6,
      duration: 2,
      statEffects: {
        mentalDefense: -2,
        socialDefense: -2
      }
    }
  },

  // Advanced Paradoxes
  liar_paradox: {
    id: 'liar_paradox',
    name: "The Liar's Paradox",
    type: 'paradox',
    category: 'logical',
    description: "The self-referential paradox of a statement that asserts its own falsehood.",
    question: "Your opponent states: 'This very statement I am making right now is false.' If true, it's false. If false, it's true. How do you resolve this?",
    options: [
      "The statement is neither true nor false",
      "The statement changes truth values rapidly",
      "Self-referential statements cannot have truth values",
      "The paradox proves language is inadequate"
    ],
    correctAnswer: 2,
    explanation: "Self-referential statements that assert their own truth values create logical inconsistencies that may be outside normal truth evaluation.",
    combatEffect: {
      damage: 10,
      duration: 5,
      statEffects: {
        mentalAttack: -4,
        mentalDefense: -4,
        accuracy: -3
      },
      specialEffect: "logical_recursion"
    }
  },

  achilles_tortoise: {
    id: 'achilles_tortoise',
    name: "Achilles and the Tortoise",
    type: 'paradox',
    category: 'philosophical',
    description: "Zeno's paradox about the impossibility of overtaking in a race.",
    question: "Your opponent argues: 'You can never catch me in battle. By the time you reach where I was, I will have moved further, and this continues infinitely.' What's the resolution?",
    options: [
      "Speed differences ensure eventual overtaking",
      "The argument ignores acceleration",
      "Infinite steps can occur in finite time",
      "Space-time is quantized, not infinitely divisible"
    ],
    correctAnswer: 2,
    explanation: "While there are infinite steps, they take progressively less time and sum to a finite duration.",
    combatEffect: {
      damage: 7,
      duration: 3,
      statEffects: {
        speed: -3,
        evasion: -2
      },
      specialEffect: "pursuit_confusion"
    }
  },

  // Heart-based fallacies (Social/Emotional)
  appeal_to_emotion: {
    id: 'appeal_to_emotion',
    name: "Appeal to Emotion",
    type: 'fallacy',
    category: 'rhetorical',
    description: "Using emotional manipulation instead of logical reasoning.",
    question: "Your opponent pleads: 'Think of all the innocent people who will suffer if you defeat me! How can you live with that guilt?' What fallacy is this?",
    options: [
      "Appeal to consequences - assuming specific outcomes",
      "Appeal to emotion - manipulating feelings over facts",
      "False cause - assuming you're responsible for others' actions",
      "Appeal to pity - seeking sympathy to avoid consequences"
    ],
    correctAnswer: 1,
    explanation: "While consequences matter, this appeal bypasses logical evaluation by targeting emotions.",
    combatEffect: {
      damage: 5,
      duration: 4,
      statEffects: {
        socialAttack: -2,
        ailmentDefense: -3
      }
    }
  },

  bandwagon: {
    id: 'bandwagon',
    name: "Bandwagon Fallacy",
    type: 'fallacy',
    category: 'rhetorical', 
    description: "Arguing something is correct because many people believe it.",
    question: "Your opponent claims: 'Everyone in the empire knows that your fighting style is inferior. Surely all these people can't be wrong!' What's the logical error?",
    options: [
      "Popular opinion doesn't determine truth or effectiveness",
      "The claim lacks specific evidence about numbers",
      "It assumes the empire's people are combat experts",
      "It ignores the possibility of mass deception"
    ],
    correctAnswer: 0,
    explanation: "Truth and effectiveness are not determined by popularity - many people can share incorrect beliefs.",
    combatEffect: {
      damage: 4,
      duration: 2,
      statEffects: {
        socialDefense: -3,
        ailmentDefense: -1
      }
    }
  }
};

// Starting fallacies for new characters
export function getStartingFallacies(): string[] {
  return ['ad_hominem', 'straw_man', 'zenos_paradox'];
}

// Learn new fallacy through experience or teaching
export function learnFallacy(knowledge: PlayerKnowledge, fallacyId: string): PlayerKnowledge {
  if (knowledge.knownFallacies.includes(fallacyId)) {
    return knowledge; // Already known
  }
  
  return {
    ...knowledge,
    knownFallacies: [...knowledge.knownFallacies, fallacyId],
    fallacyExperience: { ...knowledge.fallacyExperience, [fallacyId]: 0 }
  };
}

// Gain experience with a fallacy through successful identification
export function gainFallacyExperience(knowledge: PlayerKnowledge, fallacyId: string): PlayerKnowledge {
  const currentExp = knowledge.fallacyExperience[fallacyId] || 0;
  const newExp = currentExp + 1;
  
  const updatedKnowledge = {
    ...knowledge,
    fallacyExperience: { ...knowledge.fallacyExperience, [fallacyId]: newExp }
  };
  
  // Master fallacy after 5 successful identifications
  if (newExp >= 5 && !knowledge.masteredFallacies.includes(fallacyId)) {
    updatedKnowledge.masteredFallacies = [...knowledge.masteredFallacies, fallacyId];
  }
  
  return updatedKnowledge;
}

// Get random fallacy for combat challenge
export function getRandomFallacyChallenge(knowledge: PlayerKnowledge, difficultySetting: 'easy' | 'medium' | 'hard' = 'medium'): Fallacy {
  const availableFallacies = Object.values(FALLACIES);
  
  // Filter by difficulty
  let filteredFallacies = availableFallacies;
  
  if (difficultySetting === 'easy') {
    filteredFallacies = availableFallacies.filter(f => f.type === 'fallacy');
  } else if (difficultySetting === 'hard') {
    filteredFallacies = availableFallacies.filter(f => f.type === 'paradox');
  }
  
  return filteredFallacies[Math.floor(Math.random() * filteredFallacies.length)];
}

// Calculate damage reduction from successful fallacy identification
export function calculateFallacyDefenseReduction(fallacy: Fallacy, isCorrect: boolean, knowledge: PlayerKnowledge): number {
  if (!isCorrect) {
    return 1.0; // No reduction for incorrect identification
  }
  
  const experience = knowledge.fallacyExperience[fallacy.id] || 0;
  const isMastered = knowledge.masteredFallacies.includes(fallacy.id);
  
  // Base reduction for correct identification
  let reduction = 0.5;
  
  // Bonus reduction for experience
  reduction -= Math.min(0.2, experience * 0.04); // Up to 20% additional reduction
  
  // Bonus for mastered fallacies
  if (isMastered) {
    reduction -= 0.15; // Additional 15% reduction for mastery
  }
  
  // Minimum 10% damage taken, maximum 90% reduction
  return Math.max(0.1, reduction);
}

// Get fallacy suitable for special attack based on character stats/type
export function getFallacyForSpecialAttack(characterType: 'Body' | 'Mind' | 'Heart', knowledge: PlayerKnowledge): Fallacy | null {
  const knownFallacies = knowledge.knownFallacies
    .map(id => FALLACIES[id])
    .filter(f => f !== undefined);
  
  if (knownFallacies.length === 0) {
    return null;
  }
  
  // Filter by character type preference
  let suitableFallacies = knownFallacies;
  
  if (characterType === 'Mind') {
    // Mind users prefer paradoxes and logical fallacies
    suitableFallacies = knownFallacies.filter(f => 
      f.type === 'paradox' || f.category === 'logical'
    );
  } else if (characterType === 'Heart') {
    // Heart users prefer rhetorical fallacies
    suitableFallacies = knownFallacies.filter(f => 
      f.category === 'rhetorical'
    );
  }
  
  if (suitableFallacies.length === 0) {
    suitableFallacies = knownFallacies; // Fall back to any known fallacy
  }
  
  return suitableFallacies[Math.floor(Math.random() * suitableFallacies.length)];
}

// Check if player can learn a specific fallacy (requirements)
export function canLearnFallacy(fallacyId: string, characterLevel: number, knowledge: PlayerKnowledge): boolean {
  const fallacy = FALLACIES[fallacyId];
  if (!fallacy) return false;
  
  // Already known
  if (knowledge.knownFallacies.includes(fallacyId)) return false;
  
  // Basic requirements based on fallacy complexity
  const complexFallacies = ['liar_paradox', 'achilles_tortoise'];
  
  if (complexFallacies.includes(fallacyId) && characterLevel < 5) {
    return false; // Need higher level for complex paradoxes
  }
  
  return true;
}

// Create initial knowledge for new character
export function createInitialKnowledge(): PlayerKnowledge {
  const starting = getStartingFallacies();
  const experience: Record<string, number> = {};
  
  starting.forEach(fallacyId => {
    experience[fallacyId] = 0;
  });
  
  return {
    knownFallacies: starting,
    masteredFallacies: [],
    fallacyExperience: experience
  };
}