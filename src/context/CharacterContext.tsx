import { createContext, useContext, useState, useEffect, ReactNode } from "react";

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

// Mock API functions
async function mockGetCharacter(): Promise<{ hasCharacter: boolean; character?: Character }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Mock: 50% chance of having a character for demo purposes
    const hasCharacter = Math.random() > 0.5;

    if (!hasCharacter) {
        return { hasCharacter: false };
    }

    // Mock existing character
    return {
        hasCharacter: true,
        character: {
            id: "mock-char-1",
            name: "Aria the Brave",
            portrait: "elf",
            level: 12,
            experience: 2847,
            experienceToNext: 3200,
            currentHp: 85,
            maxHp: 120,
            currentMp: 45,
            maxMp: 60,
            stats: {
                body: 18,
                mind: 14,
                heart: 16
            },
            detailedStats: {
                physicalAtk: 32,
                physicalDef: 24,
                accuracy: 87,
                critDamage: 150,
                constitution: 22,
                mentalAtk: 28,
                mentalDef: 18,
                evasion: 12,
                perception: 16,
                reflexSave: 14,
                charisma: 19,
                ailmentAtk: 8,
                criticalRate: 12,
                willpower: 20,
                empathy: 17,
                luck: 15
            },
            location: "Whispering Woods",
            hasCharacter: true
        }
    };
}

async function mockCreateCharacter(name: string, portrait: string): Promise<Character> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const portraitData = PORTRAIT_DATA[portrait as keyof typeof PORTRAIT_DATA];
    const bonuses = portraitData?.bonuses || { body: 0, mind: 0, heart: 0 };

    // Create new character with stat bonuses
    return {
        id: `char-${Date.now()}`,
        name,
        portrait,
        level: 1,
        experience: 0,
        experienceToNext: 100,
        currentHp: 20 + bonuses.body * 5,
        maxHp: 20 + bonuses.body * 5,
        currentMp: 10 + bonuses.mind * 3,
        maxMp: 10 + bonuses.mind * 3,
        stats: {
            body: bonuses.body,
            mind: bonuses.mind,
            heart: bonuses.heart
        },
        detailedStats: {
            physicalAtk: 5 + bonuses.body * 2,
            physicalDef: 3 + bonuses.body,
            accuracy: 50 + bonuses.body * 5,
            critDamage: 100 + bonuses.body * 10,
            constitution: 10 + bonuses.body * 2,
            mentalAtk: 5 + bonuses.mind * 2,
            mentalDef: 3 + bonuses.mind,
            evasion: 5 + bonuses.mind * 2,
            perception: 10 + bonuses.mind * 2,
            reflexSave: 8 + bonuses.mind,
            charisma: 5 + bonuses.heart * 2,
            ailmentAtk: 2 + bonuses.heart,
            criticalRate: 5 + bonuses.heart * 2,
            willpower: 10 + bonuses.heart * 2,
            empathy: 8 + bonuses.heart,
            luck: 10 + bonuses.heart
        },
        location: "Starting Village",
        hasCharacter: true
    };
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

            const response = await mockGetCharacter();
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

            const newCharacter = await mockCreateCharacter(name, portrait);
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