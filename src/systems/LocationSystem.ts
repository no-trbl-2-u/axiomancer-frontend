// Location System Implementation
// Starting with basic town and forest locations

export interface Location {
  id: string;
  name: string;
  description: string;
  type: 'town' | 'wilderness' | 'dungeon' | 'labyrinth' | 'castle';
  coordinates: { x: number; y: number };
  connections: string[];
  requirements?: LocationRequirements;
  properties: LocationProperties;
  encounters: EncounterTable;
  resources?: string[];
}

export interface LocationRequirements {
  level?: number;
  questComplete?: string;
  item?: string;
  age?: number;
}

export interface LocationProperties {
  canRest: boolean;
  hasShops: boolean;
  dangerLevel: number;
  weatherAffected: boolean;
}

export interface EncounterTable {
  combat: EncounterEntry[];
  events: EncounterEntry[];
  npcs: EncounterEntry[];
}

export interface EncounterEntry {
  id: string;
  probability: number;
  conditions?: string[];
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  weather?: WeatherType;
}

export type WeatherType = 'clear' | 'rain' | 'storm' | 'fog' | 'snow';

export interface Weather {
  current: WeatherType;
  visibility: number; // 0-100
  temperature: number;
  effects: WeatherEffect[];
}

export interface WeatherEffect {
  type: 'movement' | 'combat' | 'visibility' | 'health';
  modifier: number;
  description: string;
}

export interface FastTravelNode {
  locationId: string;
  unlocked: boolean;
  cost?: number;
  requirements?: string[];
}

export interface CharacterLocation {
  currentLocation: string;
  unlockedLocations: string[];
  fastTravelNodes: FastTravelNode[];
  movementSpeed: number;
  stealthLevel: number;
}

// Define the starting locations
export const LOCATIONS: Record<string, Location> = {
  starting_town: {
    id: 'starting_town',
    name: "Seafarer's Haven",
    description: "A humble fishing village nestled between river and sea. Salt-stained wooden docks extend into dark waters, while weathered fishermen mend nets that have seen too many storms. The air carries the scent of brine and decay. Your childhood home feels smaller now, its innocence a thin veil over the harsh realities that await beyond its borders.",
    type: 'town',
    coordinates: { x: 0, y: 0 },
    connections: ['northern_forest'],
    properties: {
      canRest: true,
      hasShops: true,
      dangerLevel: 0,
      weatherAffected: false
    },
    encounters: {
      combat: [],
      events: [
        { id: 'village_gossip', probability: 0.3 },
        { id: 'merchant_arrival', probability: 0.1, timeOfDay: 'afternoon' },
        { id: 'fishing_boat_returns', probability: 0.4, timeOfDay: 'evening' }
      ],
      npcs: [
        { id: 'village_elder', probability: 0.8 },
        { id: 'fisherman', probability: 0.6, timeOfDay: 'morning' },
        { id: 'merchant', probability: 0.3 },
        { id: 'tavern_keeper', probability: 0.9 }
      ]
    },
    resources: ['fish', 'seaweed', 'driftwood']
  },

  northern_forest: {
    id: 'northern_forest',
    name: "Whispering Woods",
    description: "Ancient trees stretch endlessly before you, their gnarled branches creating a canopy so thick that daylight becomes a scarce commodity. The forest floor is soft with decades of fallen leaves, and strange sounds echo from the depths - both alluring and ominous. Shadows move where no wind blows, and the very air seems thick with forgotten secrets and lurking dangers.",
    type: 'wilderness',
    coordinates: { x: 0, y: 1 },
    connections: ['starting_town'],
    properties: {
      canRest: true,
      hasShops: false,
      dangerLevel: 3,
      weatherAffected: true
    },
    encounters: {
      combat: [
        { id: 'forest_spirit', probability: 0.4 },
        { id: 'wild_animal', probability: 0.3 },
        { id: 'bandit_scout', probability: 0.2, timeOfDay: 'evening' }
      ],
      events: [
        { id: 'ancient_ruin', probability: 0.2 },
        { id: 'mysterious_clearing', probability: 0.15 },
        { id: 'lost_traveler', probability: 0.1 },
        { id: 'find_shelter', probability: 0.8, weather: 'rain' }
      ],
      npcs: [
        { id: 'hermit_philosopher', probability: 0.1 },
        { id: 'traveling_merchant', probability: 0.05 },
        { id: 'legendary_elk', probability: 0.02, conditions: ['first_forest_visit'] }
      ]
    },
    resources: ['herbs', 'mushrooms', 'wood', 'berries']
  }
};

// Movement and travel functions
export function canMoveToLocation(character: CharacterLocation, destinationId: string): boolean {
  const currentLocation = LOCATIONS[character.currentLocation];
  if (!currentLocation) return false;
  
  // Check if destination is connected
  if (!currentLocation.connections.includes(destinationId)) return false;
  
  // Check if location is unlocked
  if (!character.unlockedLocations.includes(destinationId)) return false;
  
  // Check location requirements
  const destination = LOCATIONS[destinationId];
  if (destination?.requirements) {
    // For now, just return true - requirements checking can be expanded later
    return true;
  }
  
  return true;
}

export function moveToLocation(character: CharacterLocation, destinationId: string): CharacterLocation {
  if (!canMoveToLocation(character, destinationId)) {
    throw new Error('Location not reachable');
  }
  
  return {
    ...character,
    currentLocation: destinationId
  };
}

export function calculateTravelTime(
  origin: { x: number; y: number },
  destination: { x: number; y: number },
  movementSpeed: number
): number {
  const distance = Math.sqrt(
    Math.pow(destination.x - origin.x, 2) + Math.pow(destination.y - origin.y, 2)
  );
  
  return distance / movementSpeed;
}

// Location discovery and unlocking
export function unlockLocation(character: CharacterLocation, locationId: string): CharacterLocation {
  if (character.unlockedLocations.includes(locationId)) {
    return character; // Already unlocked
  }
  
  return {
    ...character,
    unlockedLocations: [...character.unlockedLocations, locationId]
  };
}

export function processExploration(
  character: CharacterLocation,
  explorationResult: { newLocationFound: boolean; locationId?: string }
): CharacterLocation {
  if (explorationResult.newLocationFound && explorationResult.locationId) {
    return unlockLocation(character, explorationResult.locationId);
  }
  
  return character;
}

// Weather system
export function generateWeather(location: Location, season: 'spring' | 'summer' | 'autumn' | 'winter'): Weather {
  if (!location.properties.weatherAffected) {
    return {
      current: 'clear',
      visibility: 100,
      temperature: 20,
      effects: []
    };
  }
  
  const weatherTypes: WeatherType[] = ['clear', 'rain', 'fog'];
  if (season === 'winter') {
    weatherTypes.push('snow', 'storm');
  }
  if (season === 'summer' || season === 'autumn') {
    weatherTypes.push('storm');
  }
  
  const currentWeather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
  const weather: Weather = {
    current: currentWeather,
    visibility: getWeatherVisibility(currentWeather),
    temperature: getWeatherTemperature(currentWeather, season),
    effects: getWeatherEffects(currentWeather)
  };
  
  return weather;
}

function getWeatherVisibility(weather: WeatherType): number {
  switch (weather) {
    case 'clear': return 100;
    case 'rain': return 70;
    case 'fog': return 30;
    case 'storm': return 25;
    case 'snow': return 60;
    default: return 100;
  }
}

function getWeatherTemperature(weather: WeatherType, season: string): number {
  const baseTemp = season === 'winter' ? 5 : season === 'summer' ? 25 : 15;
  
  switch (weather) {
    case 'storm': return baseTemp - 5;
    case 'snow': return Math.min(0, baseTemp - 10);
    case 'rain': return baseTemp - 3;
    default: return baseTemp;
  }
}

function getWeatherEffects(weather: WeatherType): WeatherEffect[] {
  const effects: WeatherEffect[] = [];
  
  switch (weather) {
    case 'storm':
      effects.push(
        { type: 'movement', modifier: -0.5, description: 'Reduced movement speed' },
        { type: 'combat', modifier: -0.3, description: 'Reduced accuracy' },
        { type: 'visibility', modifier: -0.7, description: 'Poor visibility' }
      );
      break;
    case 'rain':
      effects.push(
        { type: 'movement', modifier: -0.2, description: 'Slippery terrain' },
        { type: 'visibility', modifier: -0.3, description: 'Reduced visibility' }
      );
      break;
    case 'fog':
      effects.push(
        { type: 'visibility', modifier: -0.7, description: 'Heavy fog limits sight' },
        { type: 'combat', modifier: -0.4, description: 'Hard to target enemies' }
      );
      break;
    case 'snow':
      effects.push(
        { type: 'movement', modifier: -0.4, description: 'Deep snow slows travel' },
        { type: 'health', modifier: -0.1, description: 'Cold weather drains vitality' }
      );
      break;
  }
  
  return effects;
}

// Encounter system
export function getAvailableEncounters(location: Location, weather: Weather, timeOfDay: string): EncounterTable {
  const filterEncounters = (encounters: EncounterEntry[]): EncounterEntry[] => {
    return encounters.filter(encounter => {
      // Check time of day
      if (encounter.timeOfDay && encounter.timeOfDay !== timeOfDay) {
        return false;
      }
      
      // Check weather
      if (encounter.weather && encounter.weather !== weather.current) {
        return false;
      }
      
      return true;
    });
  };
  
  return {
    combat: filterEncounters(location.encounters.combat),
    events: filterEncounters(location.encounters.events),
    npcs: filterEncounters(location.encounters.npcs)
  };
}

export function triggerRandomEncounter(encounters: EncounterEntry[]): EncounterEntry | null {
  if (encounters.length === 0) return null;
  
  const roll = Math.random();
  
  for (const encounter of encounters) {
    if (roll < encounter.probability) {
      return encounter;
    }
  }
  
  return null;
}

// Resource gathering
export function gatherResources(location: Location, character: CharacterLocation): { itemsFound: { id: string; quantity: number }[]; success: boolean } {
  if (!location.resources || location.resources.length === 0) {
    return { itemsFound: [], success: false };
  }
  
  const itemsFound: { id: string; quantity: number }[] = [];
  const gatheringSkill = Math.floor(character.stealthLevel / 2) + 5; // Base gathering ability
  
  location.resources.forEach(resource => {
    const roll = Math.random() * 100;
    const successChance = Math.min(80, gatheringSkill + 20);
    
    if (roll < successChance) {
      const quantity = Math.floor(Math.random() * 3) + 1;
      itemsFound.push({ id: resource, quantity });
    }
  });
  
  return { itemsFound, success: itemsFound.length > 0 };
}

// Rest mechanics
export function restAtLocation(
  character: { health: number; maxHealth: number; mana: number; maxMana: number; fatigue: number },
  location: Location
): { health: number; maxHealth: number; mana: number; maxMana: number; fatigue: number } {
  
  if (!location.properties.canRest) {
    throw new Error('Cannot rest at this location');
  }
  
  const restEffectiveness = location.properties.dangerLevel === 0 ? 1.0 : 0.6;
  const healthRestore = Math.floor((character.maxHealth - character.health) * restEffectiveness);
  const manaRestore = Math.floor((character.maxMana - character.mana) * restEffectiveness);
  const fatigueReduction = Math.floor(character.fatigue * (0.7 * restEffectiveness));
  
  return {
    ...character,
    health: Math.min(character.maxHealth, character.health + healthRestore),
    mana: Math.min(character.maxMana, character.mana + manaRestore),
    fatigue: Math.max(0, character.fatigue - fatigueReduction)
  };
}

// Fast travel system
export function unlockFastTravel(character: CharacterLocation, node: FastTravelNode): CharacterLocation {
  const existingNode = character.fastTravelNodes.find(n => n.locationId === node.locationId);
  
  if (existingNode) {
    // Update existing node
    existingNode.unlocked = true;
    return character;
  }
  
  // Add new node
  return {
    ...character,
    fastTravelNodes: [...character.fastTravelNodes, { ...node, unlocked: true }]
  };
}

export function fastTravel(
  character: CharacterLocation,
  destinationId: string,
  options?: { combatActive?: boolean }
): CharacterLocation {
  
  if (options?.combatActive) {
    throw new Error('Fast travel not available');
  }
  
  const node = character.fastTravelNodes.find(n => n.locationId === destinationId);
  
  if (!node || !node.unlocked) {
    throw new Error('Fast travel node not available');
  }
  
  return {
    ...character,
    currentLocation: destinationId
  };
}

// Location event processing
export function processLocationEvents(
  location: Location,
  character: CharacterLocation,
  visitHistory: Record<string, boolean>
): EncounterEntry[] {
  
  const triggeredEvents: EncounterEntry[] = [];
  
  location.encounters.events.forEach(event => {
    let canTrigger = true;
    
    // Check conditions
    if (event.conditions) {
      event.conditions.forEach(condition => {
        if (condition === 'first_visit' && !visitHistory.first_visit) {
          canTrigger = false;
        }
      });
    }
    
    // Roll for event
    if (canTrigger && Math.random() < event.probability) {
      triggeredEvents.push(event);
    }
  });
  
  return triggeredEvents;
}

// Validate location connections (for testing)
export function validateLocationConnections(locations: Location[]): boolean {
  for (const location of locations) {
    for (const connectionId of location.connections) {
      const connectedLocation = locations.find(loc => loc.id === connectionId);
      
      if (!connectedLocation) {
        return false; // Connection points to non-existent location
      }
      
      if (!connectedLocation.connections.includes(location.id)) {
        return false; // Connection is not bidirectional
      }
    }
  }
  
  return true;
}