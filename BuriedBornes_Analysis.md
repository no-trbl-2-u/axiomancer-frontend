# BuriedBornes Analysis: Missing Features for Axiomancer

## Overview
After researching BuriedBornes thoroughly, this document analyzes what features and mechanics from this acclaimed hardcore roguelike RPG could enhance Axiomancer. BuriedBornes is particularly relevant as it shares similar themes of philosophical depth, complex character building, and strategic turn-based combat.

## Core BuriedBornes Features Missing from Axiomancer

### 1. Skill Runes System ⭐⭐⭐⭐⭐
**Priority: Critical**

**BuriedBornes Implementation**:
- Up to 5 skill runes can be attached to each skill
- Runes modify skill effects (damage, targeting, conditions)
- "Rune linking" creates powerful synergistic effects
- Special runes like "Confusion" swap skill targets

**Recommended for Axiomancer**:
```typescript
interface SkillRune {
  id: string;
  name: string;
  type: 'enhancement' | 'modifier' | 'condition';
  effect: {
    damageMultiplier?: number;
    targetChange?: 'self' | 'enemy' | 'all';
    triggerCondition?: string;
    statusEffect?: string;
  };
}

interface EnhancedSkill {
  baseSkill: Skill;
  attachedRunes: SkillRune[];
  combinedEffect: SkillEffect;
}
```

### 2. Equipment Absorption & Eternal Properties ⭐⭐⭐⭐
**Priority: High**

**BuriedBornes Implementation**:
- Equipment can absorb unique effects from other equipment
- "Eternal Dark" type abilities create permanent modifications
- Empty slots can be filled with absorbed abilities

**Recommended for Axiomancer**:
```typescript
interface AbsorbableEquipment extends Item {
  absorbedEffects: string[];
  emptySlots: number;
  eternalProperties?: EternalProperty[];
}

interface EternalProperty {
  id: string;
  description: string;
  effect: StatModifier;
  transferable: boolean;
}
```

### 3. Laboratory/Research System ⭐⭐⭐⭐
**Priority: High**

**BuriedBornes Implementation**:
- Customize characters with up to 5 lab parts
- Each part can be ranked up to level 5
- Different part combinations for each race/job setup
- Persistent progression between adventures

**Recommended for Axiomancer**:
```typescript
interface LabPart {
  id: string;
  name: string;
  category: 'body' | 'mind' | 'heart';
  rank: number;
  maxRank: number;
  bonuses: StatModifier;
  unlockRequirements: string[];
}

interface Laboratory {
  characterId: string;
  activeParts: LabPart[];
  availableParts: LabPart[];
  maxSlots: number;
}
```

### 4. Auto-Use/Auto-Activate Skills ⭐⭐⭐
**Priority: Medium**

**BuriedBornes Implementation**:
- Skills automatically trigger when conditions are met
- "Auto Use" for immediate activation
- "Auto Activate" for conditional triggers

**Recommended for Axiomancer**:
```typescript
interface AutoSkill {
  skillId: string;
  autoTrigger: {
    condition: 'on_damage' | 'health_below' | 'enemy_action' | 'turn_start';
    threshold?: number;
    probability: number;
  };
  remainingUses?: number;
}
```

### 5. Burst Mode/Resource Management ⭐⭐⭐
**Priority: Medium**

**BuriedBornes Implementation**:
- Characters have "Brave" points (max 3)
- Skills can consume Brave for powerful burst effects
- Resource management adds strategic depth

**Recommended for Axiomancer**:
```typescript
interface BurstSystem {
  currentBrave: number;
  maxBrave: number;
  burstSkills: BurstSkill[];
}

interface BurstSkill {
  baseSkillId: string;
  braveCost: number;
  enhancedEffects: SkillEffect;
}
```

### 6. Permadeath with Consequences ⭐⭐⭐⭐
**Priority: High**

**BuriedBornes Implementation**:
- Dead heroes become "Roaming Dead" enemies
- Lost equipment and progress has narrative weight
- Creates emotional investment in character survival

**Recommended for Axiomancer**:
```typescript
interface DeadCharacter {
  originalId: string;
  name: string;
  level: number;
  causeOfDeath: string;
  equipment: Item[];
  becomeEnemy: boolean;
  memorialData: CharacterMemorial;
}
```

### 7. Monster Capture/Taming System ⭐⭐⭐
**Priority: Medium**

**BuriedBornes Implementation**:
- "Jail" system to capture monsters
- Combine captured monsters to create custom allies
- Injury system prevents overuse

**Recommended for Axiomancer**:
```typescript
interface CapturedEntity {
  originalEnemyId: string;
  currentHealth: number;
  maxHealth: number;
  loyalty: number;
  combinableWith: string[];
  skills: Skill[];
}
```

### 8. Dynamic Dungeon Generation ⭐⭐⭐⭐⭐
**Priority: Critical**

**BuriedBornes Implementation**:
- 19 different dungeon types with unique rules
- Dynamic structure changes
- Specialized dungeons (jail monsters, equipment melting, etc.)
- Room-by-room choice system

**Recommended for Axiomancer**:
```typescript
interface DynamicDungeon {
  id: string;
  theme: string;
  specialRules: DungeonRule[];
  roomCount: number;
  currentRoom: number;
  roomTypes: ('combat' | 'event' | 'treasure' | 'boss')[];
  difficulty: number;
}

interface DungeonRule {
  name: string;
  description: string;
  effect: 'reduce_xp' | 'equipment_decay' | 'enemy_buffs' | 'permadeath';
  magnitude: number;
}
```

### 9. PvP Arena System ⭐⭐
**Priority: Low**

**BuriedBornes Implementation**:
- Accessible after defeating Ancient King in labyrinth
- Player vs player philosophical combat
- Seasonal rankings and rewards

### 10. Quality Tiers & Crafting ⭐⭐⭐
**Priority: Medium**

**BuriedBornes Implementation**:
- Quality levels: Common → High → Master → Demon-Forged → Legendary
- Each tier has significant stat differences
- Crafting/upgrading system for improvement

## Implementation Recommendations for Axiomancer

### Phase 1: Core Missing Systems (2-3 weeks)
1. **Skill Runes System** - Enhance fallacy/paradox mechanics
2. **Laboratory System** - Persistent character customization
3. **Dynamic Dungeon Generation** - Replace static locations

### Phase 2: Combat Enhancements (1-2 weeks)
1. **Equipment Absorption** - Deeper item progression
2. **Auto-Trigger Skills** - Strategic automation
3. **Burst Mode System** - Resource-based powerful attacks

### Phase 3: Advanced Features (2-3 weeks)
1. **Permadeath Consequences** - Emotional stakes
2. **Monster Capture** - Enemy interaction system
3. **Quality Tiers** - Item progression depth

## Unique Adaptations for Axiomancer's Philosophy Theme

### Philosophical Skill Trees
Instead of traditional stats (STR/DEX/INT), use philosophical schools:
- **Rationalism** (Mind-based, logic and reason)
- **Empiricism** (Body-based, experience and observation)  
- **Existentialism** (Heart-based, meaning and emotion)
- **Stoicism** (Balance-based, acceptance and control)
- **Nihilism** (Chaos-based, destruction and void)

### Fallacy Rune System
Adapt skill runes to philosophical fallacies:
```typescript
interface FallacyRune {
  fallacyType: 'ad_hominem' | 'straw_man' | 'false_dichotomy';
  runeEffect: 'invert_logic' | 'redirect_argument' | 'multiply_confusion';
  philosophicalSchool: string;
  masteryLevel: number;
}
```

### Ethical Choice Dungeons
Dynamic dungeons based on ethical dilemmas:
- **Trolley Problem Dungeon** - Utilitarian choices affect layout
- **Ring of Gyges Labyrinth** - Invisibility and moral consequences
- **Ship of Theseus Tower** - Identity puzzles change structure

## Conclusion

BuriedBornes offers valuable inspiration for enhancing Axiomancer's depth and replayability. The most critical missing features are:

1. **Skill Runes System** - Would perfectly complement the fallacy mechanics
2. **Dynamic Dungeon Generation** - Essential for replayability  
3. **Laboratory System** - Provides persistent progression
4. **Equipment Absorption** - Adds item progression depth

These systems would transform Axiomancer from a linear RPG into a deep, replayable philosophical adventure that honors both the BuriedBornes gameplay loop and the unique philosophical combat theme.