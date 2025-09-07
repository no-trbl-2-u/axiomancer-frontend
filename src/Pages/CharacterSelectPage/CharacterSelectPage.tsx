import React, { useState, useEffect } from 'react';
import { authAPI } from '../../services/authAPI';
import { characterAPI, CharacterResponse } from '../../services/gameAPI';

interface CharacterSelectPageProps {
  onCharacterSelected: (character: CharacterResponse) => void;
  onCreateNewCharacter: () => void;
}

const CharacterSelectPage: React.FC<CharacterSelectPageProps> = ({
  onCharacterSelected,
  onCreateNewCharacter,
}) => {
  const [character, setCharacter] = useState<CharacterResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCharacter = async () => {
      try {
        setIsLoading(true);
        const uid = authAPI.getCurrentUID();
        if (!uid) {
          setError('No user logged in');
          return;
        }

        const characterData = await characterAPI.get(uid);
        setCharacter(characterData);
      } catch (error) {
        console.error('Failed to load character:', error);
        setError(error instanceof Error ? error.message : 'Failed to load character');
      } finally {
        setIsLoading(false);
      }
    };

    loadCharacter();
  }, []);

  const handleSelectCharacter = () => {
    if (character) {
      onCharacterSelected(character);
    }
  };

  const handleDeleteCharacter = async () => {
    if (!character) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${character.name}"? This action cannot be undone.`
    );

    if (confirmed) {
      try {
        await characterAPI.delete(character.id);
        onCreateNewCharacter();
      } catch (error) {
        console.error('Failed to delete character:', error);
        setError('Failed to delete character');
      }
    }
  };

  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingBox}>
          <h2>Loading Character...</h2>
          <div style={styles.spinner}></div>
        </div>
      </div>
    );
  }

  if (error || !character) {
    return (
      <div style={styles.container}>
        <div style={styles.errorBox}>
          <h2>Character Not Found</h2>
          <p>{error || 'No character found for this account'}</p>
          <button style={styles.button} onClick={onCreateNewCharacter}>
            Create New Character
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.selectBox}>
        <div style={styles.title}>
          <h1>AXIOMANCER</h1>
          <p>Select Your Character</p>
        </div>

        <div style={styles.characterCard}>
          <div style={styles.characterInfo}>
            <h2>{character.name}</h2>
            <div style={styles.characterDetails}>
              <p><strong>Level:</strong> {character.level}</p>
              <p><strong>Age:</strong> {character.age}</p>
              <p><strong>Location:</strong> {character.currentLocation}</p>
            </div>

            <div style={styles.stats}>
              <h3>Stats</h3>
              <div style={styles.statGrid}>
                <div style={styles.statItem}>
                  <span>Body:</span>
                  <span>{character.stats.body}</span>
                </div>
                <div style={styles.statItem}>
                  <span>Mind:</span>
                  <span>{character.stats.mind}</span>
                </div>
                <div style={styles.statItem}>
                  <span>Heart:</span>
                  <span>{character.stats.heart}</span>
                </div>
                <div style={styles.statItem}>
                  <span>Health:</span>
                  <span>{character.maxHp}</span>
                </div>
                <div style={styles.statItem}>
                  <span>Mana:</span>
                  <span>{character.maxMp}</span>
                </div>
              </div>
            </div>

            <div style={styles.experience}>
              <p><strong>Experience:</strong> {character.experience} / {character.experienceToNext}</p>
              <div style={styles.xpBar}>
                <div
                  style={{
                    ...styles.xpFill,
                    width: `${(character.experience / character.experienceToNext) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div style={styles.buttonGroup}>
          <button style={styles.primaryButton} onClick={handleSelectCharacter}>
            Enter the World
          </button>

          <button style={styles.secondaryButton} onClick={onCreateNewCharacter}>
            Create New Character
          </button>

          <button style={styles.dangerButton} onClick={handleDeleteCharacter}>
            Delete Character
          </button>
        </div>

        <div style={styles.flavorText}>
          "The paths of logic are many, but wisdom chooses the right one."
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
  },
  loadingBox: {
    backgroundColor: '#1a1a2e',
    padding: '3rem',
    borderRadius: '10px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
    textAlign: 'center' as const,
  },
  errorBox: {
    backgroundColor: '#1a1a2e',
    padding: '3rem',
    borderRadius: '10px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
    textAlign: 'center' as const,
    maxWidth: '400px',
  },
  selectBox: {
    backgroundColor: '#1a1a2e',
    padding: '3rem',
    borderRadius: '10px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
    maxWidth: '500px',
    width: '90%',
    textAlign: 'center' as const,
  },
  title: {
    marginBottom: '2rem',
  },
  characterCard: {
    backgroundColor: '#2a2a3e',
    padding: '2rem',
    borderRadius: '8px',
    marginBottom: '2rem',
    textAlign: 'left' as const,
  },
  characterInfo: {
    marginBottom: '1rem',
  },
  characterDetails: {
    marginBottom: '1.5rem',
  },
  stats: {
    marginBottom: '1.5rem',
  },
  statGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '0.5rem',
    marginTop: '0.5rem',
  },
  statItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.25rem 0.5rem',
    backgroundColor: '#333',
    borderRadius: '3px',
  },
  experience: {
    marginBottom: '1rem',
  },
  xpBar: {
    width: '100%',
    height: '8px',
    backgroundColor: '#333',
    borderRadius: '4px',
    marginTop: '0.5rem',
    overflow: 'hidden',
  },
  xpFill: {
    height: '100%',
    backgroundColor: '#4ecdc4',
    transition: 'width 0.3s ease',
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
    marginBottom: '2rem',
  },
  primaryButton: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    backgroundColor: '#4ecdc4',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  secondaryButton: {
    padding: '0.75rem 1.5rem',
    fontSize: '0.9rem',
    backgroundColor: 'transparent',
    color: '#4ecdc4',
    border: '1px solid #4ecdc4',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  dangerButton: {
    padding: '0.5rem 1rem',
    fontSize: '0.8rem',
    backgroundColor: 'transparent',
    color: '#ff6b6b',
    border: '1px solid #ff6b6b',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
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
  },
  flavorText: {
    fontSize: '0.85rem',
    fontStyle: 'italic' as const,
    opacity: 0.7,
    lineHeight: '1.4',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #333',
    borderTop: '4px solid #4ecdc4',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '1rem auto',
  },
};

export default CharacterSelectPage;