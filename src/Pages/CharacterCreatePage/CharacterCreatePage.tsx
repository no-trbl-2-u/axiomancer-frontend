import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { characterAPI, CreateCharacterRequest } from '../../services/gameAPI';

interface CharacterCreatePageProps {
  onCharacterCreated: (character: any) => void;
}

const ALL_PORTRAITS = [
  { 
    id: 'scout', 
    name: 'Scout', 
    description: 'Swift and perceptive, masters of observation and evasion.',
    portraitImage: '/images/portraits/Scout.png',
    unlocked: true
  },
  { 
    id: 'archer', 
    name: 'Archer', 
    description: 'Precise and deadly, masters of ranged combat.',
    portraitImage: '/images/portraits/Archer.jpg',
    unlocked: true
  },
  { 
    id: 'arc-mage', 
    name: 'Arc Mage', 
    description: 'Wielders of arcane power and mystical knowledge.',
    portraitImage: '/images/portraits/Arc-mage.jpg',
    unlocked: true
  },
  { 
    id: 'priestess', 
    name: 'Priestess', 
    description: 'Divine healers and spiritual guides.',
    portraitImage: '/images/portraits/Priestess.jpg',
    unlocked: true
  },
  { 
    id: 'air-lord', 
    name: 'Air Lord', 
    description: 'Master of the winds and sky.',
    portraitImage: '/images/portraits/Air-lord.jpg',
    unlocked: false
  },
  { 
    id: 'angel', 
    name: 'Angel', 
    description: 'Divine messenger of light and justice.',
    portraitImage: '/images/portraits/Angel.jpg',
    unlocked: false
  },
  { 
    id: 'arch-demon', 
    name: 'Arch Demon', 
    description: 'Dark overlord of infernal powers.',
    portraitImage: '/images/portraits/Arch-demon.jpg',
    unlocked: false
  },
  { 
    id: 'ashigaru', 
    name: 'Ashigaru', 
    description: 'Disciplined foot soldier of ancient traditions.',
    portraitImage: '/images/portraits/Ashigaru.jpg',
    unlocked: false
  },
  { 
    id: 'biwa-houshi', 
    name: 'Biwa Houshi', 
    description: 'Wandering monk and storyteller.',
    portraitImage: '/images/portraits/Biwa-houshi.jpg',
    unlocked: false
  },
  { 
    id: 'black-bishop', 
    name: 'Black Bishop', 
    description: 'Dark cleric of forbidden knowledge.',
    portraitImage: '/images/portraits/Black-bishop.jpg',
    unlocked: false
  },
  { 
    id: 'cenobite', 
    name: 'Cenobite', 
    description: 'Ascetic seeker of spiritual perfection.',
    portraitImage: '/images/portraits/Cenobite.jpg',
    unlocked: false
  },
  { 
    id: 'circe', 
    name: 'Circe', 
    description: 'Sorceress of transformation and enchantment.',
    portraitImage: '/images/portraits/Circe.jpg',
    unlocked: false
  },
  { 
    id: 'crescent', 
    name: 'Crescent', 
    description: 'Guardian of lunar mysteries.',
    portraitImage: '/images/portraits/Crescent.jpg',
    unlocked: false
  },
  { 
    id: 'dark-elf', 
    name: 'Dark Elf', 
    description: 'Shadow-dwelling master of stealth.',
    portraitImage: '/images/portraits/Dark-elf.jpg',
    unlocked: false
  },
  { 
    id: 'drake', 
    name: 'Drake', 
    description: 'Young dragon of fierce intelligence.',
    portraitImage: '/images/portraits/Drake.jpg',
    unlocked: false
  },
  { 
    id: 'fairy', 
    name: 'Fairy', 
    description: 'Mystical being of nature and magic.',
    portraitImage: '/images/portraits/Fairy.jpg',
    unlocked: false
  }
];

const CharacterCreatePage: React.FC<CharacterCreatePageProps> = ({ onCharacterCreated }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [name, setName] = useState('');
  const [selectedClass, setSelectedClass] = useState('scout');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentPortrait = () => {
    return ALL_PORTRAITS.find(portrait => portrait.id === selectedClass) || ALL_PORTRAITS[0];
  };

  const handlePortraitSelect = (portraitId: string) => {
    const portrait = ALL_PORTRAITS.find(p => p.id === portraitId);
    if (portrait && portrait.unlocked) {
      setSelectedClass(portraitId);
    }
  };

  const handleCreateCharacter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Character name is required');
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const characterData: CreateCharacterRequest = {
        name: name.trim(),
        portrait: selectedClass,
        age: 8, // Starting age for childhood phase
      };

      const character = await characterAPI.create(characterData);
      onCharacterCreated(character);
    } catch (error) {
      console.error('Character creation failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to create character');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCancel = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      // Force redirect even if logout fails
      navigate('/login');
    }
  };

  const currentPortrait = getCurrentPortrait();

  return (
    <div style={styles.container}>
      <div style={styles.createBox}>
        <div style={styles.title}>
          <h1>AXIOMANCER</h1>
          <p>Create Your Character</p>
        </div>

        <form onSubmit={handleCreateCharacter} style={styles.form}>
          {/* Portrait Section */}
          <div style={styles.portraitSection}>
            <div style={styles.portrait}>
              <img 
                src={currentPortrait.portraitImage} 
                alt={`${currentPortrait.name} portrait`}
                style={styles.portraitImage}
                onError={(e) => {
                  console.error(`Failed to load portrait: ${currentPortrait.portraitImage}`);
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <h3>{currentPortrait.name}</h3>
              <p style={styles.classDescription}>{currentPortrait.description}</p>
            </div>
          </div>

          {/* Portrait Selection */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              Choose Your Portrait:
            </label>
            <div style={styles.portraitScrollContainer}>
              <div style={styles.portraitGrid}>
                {ALL_PORTRAITS.map((portrait) => (
                  <button
                    key={portrait.id}
                    type="button"
                    onClick={() => handlePortraitSelect(portrait.id)}
                    style={{
                      ...styles.portraitButton,
                      ...(selectedClass === portrait.id ? styles.portraitButtonSelected : {}),
                      ...(portrait.unlocked ? {} : styles.portraitButtonLocked),
                    }}
                    disabled={isCreating || !portrait.unlocked}
                    title={portrait.unlocked ? portrait.name : `${portrait.name} (Locked)`}
                  >
                    <img 
                      src={portrait.portraitImage} 
                      alt={`${portrait.name} portrait`}
                      style={{
                        ...styles.portraitButtonImage,
                        ...(portrait.unlocked ? {} : styles.portraitImageLocked),
                      }}
                    />
                    <div style={styles.portraitButtonName}>{portrait.name}</div>
                    {!portrait.unlocked && (
                      <div style={styles.lockOverlay}>🔒</div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Character Name */}
          <div style={styles.inputGroup}>
            <label htmlFor="name" style={styles.label}>
              Character Name:
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isCreating}
              style={styles.input}
              placeholder="Enter your character's name"
              maxLength={30}
            />
          </div>

          {error && (
            <div style={styles.error}>
              {error}
            </div>
          )}

          <div style={styles.buttonContainer}>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isCreating}
              style={styles.cancelButton}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating || !name.trim()}
              style={styles.button}
            >
              {isCreating ? 'Creating Character...' : 'Begin Your Journey'}
            </button>
          </div>
        </form>

        <div style={styles.flavorText}>
          "The path of wisdom begins with a single step into the unknown."
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#16213e',
    color: '#eee',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Arial, sans-serif',
    overflowY: 'auto' as const,
  },
  createBox: {
    backgroundColor: '#1a1a2e',
    padding: '3rem',
    borderRadius: '10px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
    maxWidth: '600px',
    width: '90%',
    textAlign: 'center' as const,
    margin: '2rem 0',
  },
  title: {
    marginBottom: '2rem',
  },
  form: {
    marginBottom: '2rem',
  },
  portraitSection: {
    marginBottom: '2rem',
    padding: '2rem',
    backgroundColor: '#2a2a3e',
    borderRadius: '8px',
  },
  portrait: {
    textAlign: 'center' as const,
  },
  portraitImage: {
    width: '150px',
    height: '150px',
    borderRadius: '10px',
    marginBottom: '1rem',
    objectFit: 'cover' as const,
    border: '2px solid #4ecdc4',
    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
  },
  classDescription: {
    fontSize: '0.9rem',
    opacity: 0.8,
    marginTop: '0.5rem',
    lineHeight: '1.4',
  },
  inputGroup: {
    marginBottom: '1.5rem',
    textAlign: 'left' as const,
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontSize: '0.9rem',
    color: '#ccc',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    fontSize: '1rem',
    backgroundColor: '#333',
    border: '1px solid #555',
    borderRadius: '5px',
    color: '#eee',
    boxSizing: 'border-box' as const,
  },
  portraitScrollContainer: {
    marginTop: '0.5rem',
    overflowX: 'auto' as const,
    overflowY: 'hidden' as const,
    padding: '0.5rem 0',
    borderRadius: '5px',
    backgroundColor: '#2a2a3e',
  },
  portraitGrid: {
    display: 'flex',
    gap: '1rem',
    paddingBottom: '0.5rem',
    minWidth: 'max-content',
  },
  portraitButton: {
    position: 'relative' as const,
    padding: '0.75rem',
    backgroundColor: '#333',
    border: '2px solid #555',
    borderRadius: '8px',
    color: '#eee',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    fontSize: '0.8rem',
    minWidth: '80px',
    maxWidth: '100px',
  },
  portraitButtonSelected: {
    backgroundColor: '#4ecdc4',
    borderColor: '#4ecdc4',
    color: '#fff',
    transform: 'scale(1.05)',
  },
  portraitButtonLocked: {
    backgroundColor: '#222',
    borderColor: '#444',
    cursor: 'not-allowed',
  },
  portraitButtonImage: {
    width: '60px',
    height: '60px',
    borderRadius: '5px',
    marginBottom: '0.5rem',
    objectFit: 'cover' as const,
  },
  portraitImageLocked: {
    filter: 'grayscale(100%) brightness(0.5)',
  },
  portraitButtonName: {
    textAlign: 'center' as const,
    fontSize: '0.7rem',
    lineHeight: '1.2',
    wordWrap: 'break-word' as const,
    maxWidth: '100%',
  },
  lockOverlay: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '1.5rem',
    zIndex: 1,
  },
  buttonContainer: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
  },
  button: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    backgroundColor: '#4ecdc4',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    flex: 1,
  },
  cancelButton: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    backgroundColor: '#666',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    flex: 1,
  },
  error: {
    backgroundColor: '#ff6b6b',
    color: '#fff',
    padding: '0.75rem',
    borderRadius: '5px',
    marginBottom: '1rem',
    fontSize: '0.9rem',
  },
  flavorText: {
    fontSize: '0.85rem',
    fontStyle: 'italic' as const,
    opacity: 0.7,
    lineHeight: '1.4',
    marginTop: '1rem',
  },
};

export default CharacterCreatePage;