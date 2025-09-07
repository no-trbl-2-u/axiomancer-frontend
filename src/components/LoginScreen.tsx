import React, { useState, useCallback } from 'react';
import { authAPI, AuthAPIError } from '../services/authAPI';
import { gameInitializationAPI, InitializationStep, GameInitializationError } from '../services/gameInitializationAPI';
import LoadingScreen from './LoadingScreen';

interface LoginScreenProps {
  onLoginSuccess: (gameData: any) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initSteps, setInitSteps] = useState<InitializationStep[]>([]);
  const [initProgress, setInitProgress] = useState(0);

  const handleProgressUpdate = useCallback((steps: InitializationStep[]) => {
    setInitSteps(steps);
    const completed = steps.filter(s => s.completed).length;
    const progress = Math.round((completed / steps.length) * 100);
    setInitProgress(progress);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Step 1: Authenticate user
      console.log('Attempting login...');
      const loginResponse = await authAPI.login({ username, password });
      console.log('Login successful:', loginResponse);

      // Step 2: Initialize game data
      setIsLoading(false);
      setIsInitializing(true);

      console.log('Starting game initialization...');
      const gameData = await gameInitializationAPI.initializeGame(handleProgressUpdate);
      console.log('Game initialization complete:', gameData);

      // Step 3: Check if user has a character and redirect accordingly
      setIsInitializing(false);
      const hasCharacter = await authAPI.hasCharacter();
      
      if (hasCharacter) {
        // Redirect to character selection
        onLoginSuccess({ ...gameData, redirectTo: 'character-select' });
      } else {
        // Redirect to character creation
        onLoginSuccess({ ...gameData, redirectTo: 'character-create' });
      }

    } catch (error) {
      setIsLoading(false);
      setIsInitializing(false);

      console.error('Login/initialization error:', error);

      if (error instanceof AuthAPIError) {
        setError(`Login failed: ${error.message}`);
      } else if (error instanceof GameInitializationError) {
        setError(`Game initialization failed: ${error.message} (${error.step})`);
      } else {
        setError(error instanceof Error ? error.message : 'Unknown error occurred');
      }
    }
  };

  const handleRegister = () => {
    // TODO: Implement registration flow
    alert('Registration not yet implemented');
  };

  // Show loading screen during initialization
  if (isInitializing) {
    return (
      <LoadingScreen
        steps={initSteps}
        currentMessage="Loading your world..."
        progress={initProgress}
      />
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        {/* Game Title */}
        <div style={styles.title}>
          <h1>AXIOMANCER</h1>
          <p>Enter the Realm of Logic and Reason</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label htmlFor="username" style={styles.label}>Username:</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
              style={styles.input}
              placeholder="Enter your username"
            />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>Password:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              style={styles.input}
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <div style={styles.error}>
              {error}
            </div>
          )}

          <div style={styles.buttonGroup}>
            <button
              type="submit"
              disabled={isLoading || !username || !password}
              style={styles.button}
            >
              {isLoading ? 'Logging in...' : 'Enter the World'}
            </button>

            <button
              type="button"
              onClick={handleRegister}
              disabled={isLoading}
              style={styles.secondaryButton}
            >
              Create New Character
            </button>
          </div>
        </form>

        {/* Flavor Text */}
        <div style={styles.flavorText}>
          "Every great philosopher began as a student of logic. Your journey into the realm of reason awaits."
        </div>

        {/* Debug Info */}
        {process.env.NODE_ENV === 'development' && (
          <div style={styles.debugInfo}>
            <p><strong>Development Mode</strong></p>
            <p>API URL: {process.env.REACT_APP_API_URL_DEV || 'http://localhost:8080/api'}</p>
            <p>Auth Status: {authAPI.isAuthenticated() ? 'Logged In' : 'Not Logged In'}</p>
          </div>
        )}
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
  loginBox: {
    backgroundColor: '#1a1a2e',
    padding: '3rem',
    borderRadius: '10px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
    maxWidth: '400px',
    width: '90%',
    textAlign: 'center' as const,
  },
  title: {
    marginBottom: '2rem',
  },
  form: {
    marginBottom: '2rem',
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
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
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
  debugInfo: {
    marginTop: '2rem',
    padding: '1rem',
    backgroundColor: '#333',
    borderRadius: '5px',
    fontSize: '0.8rem',
    textAlign: 'left' as const,
    opacity: 0.8,
  },
};

export default LoginScreen;