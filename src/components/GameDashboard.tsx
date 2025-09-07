import React from 'react';
import { useAuth } from '../context/AuthContext';

const GameDashboard: React.FC = () => {
  const { gameData, logout, isLoggedIn } = useAuth();

  if (!isLoggedIn || !gameData) {
    return <div>Please log in to access the game.</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Axiomancer - Game Dashboard</h1>
        <button onClick={logout} style={styles.logoutButton}>
          Logout
        </button>
      </div>

      <div style={styles.content}>
        <div style={styles.section}>
          <h2>Character Data</h2>
          <pre style={styles.dataDisplay}>
            {JSON.stringify(gameData.character, null, 2)}
          </pre>
        </div>

        <div style={styles.section}>
          <h2>Game State</h2>
          <pre style={styles.dataDisplay}>
            {JSON.stringify(gameData.gameState, null, 2)}
          </pre>
        </div>

        <div style={styles.section}>
          <h2>Inventory</h2>
          <pre style={styles.dataDisplay}>
            {JSON.stringify(gameData.inventory, null, 2)}
          </pre>
        </div>

        <div style={styles.section}>
          <h2>Systems Status</h2>
          <div style={styles.systemsGrid}>
            <div style={styles.systemCard}>
              <h3>Combat</h3>
              <p>Status: {gameData.combat ? 'Loaded' : 'Error'}</p>
            </div>
            <div style={styles.systemCard}>
              <h3>Exploration</h3>
              <p>Status: {gameData.exploration ? 'Loaded' : 'Error'}</p>
            </div>
            <div style={styles.systemCard}>
              <h3>Quests</h3>
              <p>Status: {gameData.quests ? 'Loaded' : 'Error'}</p>
            </div>
            <div style={styles.systemCard}>
              <h3>Story</h3>
              <p>Status: {gameData.story ? 'Loaded' : 'Error'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#1a1a2e',
    color: '#eee',
    padding: '1rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    borderBottom: '1px solid #333',
    paddingBottom: '1rem',
  },
  logoutButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#ff6b6b',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  content: {
    display: 'grid',
    gap: '2rem',
  },
  section: {
    backgroundColor: '#16213e',
    padding: '1.5rem',
    borderRadius: '8px',
    border: '1px solid #333',
  },
  dataDisplay: {
    backgroundColor: '#333',
    padding: '1rem',
    borderRadius: '4px',
    overflow: 'auto',
    maxHeight: '300px',
    fontSize: '0.8rem',
  },
  systemsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
  },
  systemCard: {
    backgroundColor: '#333',
    padding: '1rem',
    borderRadius: '4px',
    textAlign: 'center' as const,
  },
};

export default GameDashboard;