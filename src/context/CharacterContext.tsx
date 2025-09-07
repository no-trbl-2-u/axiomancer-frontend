
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authAPI } from '../services/authAPI';
import { characterAPI } from '../services/gameAPI';

export interface CharacterStats {
    body: number;
    mind: number;
    heart: number;
}

export interface DetailedStats {
    // Body stats
    physicalAtk: number;
    physicalDef: number;
    accuracy: number;
    critDamage: number;
    constitution: number;

    // Mind stats  
    mentalAtk: number;
    mentalDef: number;
    evasion: number;
    perception: number;
    reflexSave: number;

    // Heart stats
    charisma: number;
    ailmentAtk: number;
    criticalRate: number;
    willpower: number;
    empathy: number;
    luck: number;
}

export interface Character {
    id: string;
    name: string;
    portrait: string;
    level: number;
    experience: number;
    experienceToNext: number;
    currentHp: number;
    maxHp: number;
    currentMp: number;
    maxMp: number;
    stats: CharacterStats;
    detailedStats: DetailedStats;
    location: string;
    hasCharacter: boolean;
}

interface CharacterContextValue {
    character: Character | null;
    loading: boolean;
    error: string | null;
    hasCharacter: boolean;
    fetchCharacter: () => Promise<void>;
    createCharacter: (name: string, portrait: string) => Promise<void>;
}

const CharacterContext = createContext<CharacterContextValue | undefined>(undefined);

// Available portraits with their unlock status and stat bonuses
const PORTRAIT_DATA = {
    'elf': { unlocked: true, bonuses: { body: 0, mind: 0, heart: 0 } },
    'Drake': { unlocked: true, bonuses: { body: 0, mind: 0, heart: 0 } },
    'Arc-mage': { unlocked: true, bonuses: { body: 0, mind: 0, heart: 0 } },
    'Air-lord': { unlocked: false, bonuses: { body: 0, mind: 1, heart: 1 } },
    'Angel': { unlocked: false, bonuses: { body: 0, mind: 0, heart: 2 } },
    'Arch-demon': { unlocked: false, bonuses: { body: 1, mind: 1, heart: 0 } },
    'Archer': { unlocked: false, bonuses: { body: 1, mind: 1, heart: 0 } },
    'Ashigaru': { unlocked: false, bonuses: { body: 2, mind: 0, heart: 0 } },
    'Biwa-houshi': { unlocked: false, bonuses: { body: 0, mind: 0, heart: 2 } },
    'Black-bishop': { unlocked: false, bonuses: { body: 0, mind: 2, heart: 0 } },
    'Cenobite': { unlocked: false, bonuses: { body: 1, mind: 0, heart: 1 } },
    'Circe': { unlocked: false, bonuses: { body: 0, mind: 2, heart: 0 } },
    'Crescent': { unlocked: false, bonuses: { body: 0, mind: 1, heart: 1 } },
    'Dark-elf': { unlocked: false, bonuses: { body: 0, mind: 1, heart: 1 } },
    'Fairy': { unlocked: false, bonuses: { body: 0, mind: 0, heart: 2 } },
    'Priestess': { unlocked: false, bonuses: { body: 0, mind: 0, heart: 2 } },
    'Scout': { unlocked: false, bonuses: { body: 1, mind: 1, heart: 0 } }
};

export const getPortraitData = () => PORTRAIT_DATA;

// Real API functions using backend
async function getCharacterFromBackend(): Promise<{ hasCharacter: boolean; character?: Character }> {
    try {
        const uid = authAPI.getCurrentUID();
        if (!uid) {
            return { hasCharacter: false };
        }

        // Check if user has character using authAPI
        const hasCharacter = await authAPI.hasCharacter();
        if (!hasCharacter) {
            return { hasCharacter: false };
        }

        // Get character data from backend
        const characterData = await characterAPI.get(uid);

        // Transform backend response to match frontend Character interface
        const character: Character = {
            id: characterData.id,
            name: characterData.name,
            portrait: characterData.portrait,
            level: characterData.level,
            experience: characterData.experience,
            experienceToNext: characterData.experienceToNext,
            currentHp: characterData.currentHp,
            maxHp: characterData.maxHp,
            currentMp: characterData.currentMp,
            maxMp: characterData.maxMp,
            stats: {
                body: characterData.stats.body,
                mind: characterData.stats.mind,
                heart: characterData.stats.heart
            },
            detailedStats: characterData.detailedStats || {
                physicalAtk: 0, physicalDef: 0, accuracy: 0, critDamage: 0, constitution: 0,
                mentalAtk: 0, mentalDef: 0, evasion: 0, perception: 0, reflexSave: 0,
                charisma: 0, ailmentAtk: 0, criticalRate: 0, willpower: 0, empathy: 0, luck: 0
            },
            location: characterData.currentLocation || "Starting Village",
            hasCharacter: true
        };

        return {
            hasCharacter: true,
            character
        };
    } catch (error) {
        console.error('Error fetching character from backend:', error);
        return { hasCharacter: false };
    }
}

async function createCharacterInBackend(name: string, portrait: string): Promise<Character> {
    try {
        const characterData = await characterAPI.create({
            name,
            portrait,
            age: 8
        });

        // Transform backend response to match frontend Character interface
        return {
            id: characterData.id,
            name: characterData.name,
            portrait: characterData.portrait,
            level: characterData.level,
            experience: characterData.experience,
            experienceToNext: characterData.experienceToNext,
            currentHp: characterData.currentHp,
            maxHp: characterData.maxHp,
            currentMp: characterData.currentMp,
            maxMp: characterData.maxMp,
            stats: {
                body: characterData.stats.body,
                mind: characterData.stats.mind,
                heart: characterData.stats.heart
            },
            detailedStats: characterData.detailedStats || {
                physicalAtk: 0, physicalDef: 0, accuracy: 0, critDamage: 0, constitution: 0,
                mentalAtk: 0, mentalDef: 0, evasion: 0, perception: 0, reflexSave: 0,
                charisma: 0, ailmentAtk: 0, criticalRate: 0, willpower: 0, empathy: 0, luck: 0
            },
            location: characterData.currentLocation || "Starting Village",
            hasCharacter: true
        };
    } catch (error) {
        console.error('Error creating character in backend:', error);
        throw error;
    }
}

export function CharacterProvider({ children }: { children: ReactNode }) {
    const [character, setCharacter] = useState<Character | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hasCharacter, setHasCharacter] = useState(false);

    const fetchCharacter = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await getCharacterFromBackend();
            setHasCharacter(response.hasCharacter);
            setCharacter(response.character || null);
        } catch (err) {
            setError('Failed to fetch character data');
            console.error('Error fetching character:', err);
        } finally {
            setLoading(false);
        }
    };

    const createCharacter = async (name: string, portrait: string) => {
        try {
            setLoading(true);
            setError(null);

            const newCharacter = await createCharacterInBackend(name, portrait);
            setCharacter(newCharacter);
            setHasCharacter(true);
        } catch (err) {
            setError('Failed to create character');
            console.error('Error creating character:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCharacter();
    }, []);

    const value: CharacterContextValue = {
        character,
        loading,
        error,
        hasCharacter,
        fetchCharacter,
        createCharacter
    };

    return (
        <CharacterContext.Provider value={value}>
            {children}
        </CharacterContext.Provider>
    );
}

export function useCharacter(): CharacterContextValue {
    const context = useContext(CharacterContext);
    if (!context) {
        throw new Error('useCharacter must be used within a CharacterProvider');
    }
    return context;
}