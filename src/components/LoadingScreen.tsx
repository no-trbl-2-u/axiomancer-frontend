import React from 'react';
import { InitializationStep } from '../services/gameInitializationAPI';

interface LoadingScreenProps {
  steps: InitializationStep[];
  currentMessage?: string;
  progress: number; // 0-100
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  steps, 
  currentMessage = 'Initializing Axiomancer...', 
  progress 
}) => {
  const completedSteps = steps.filter(step => step.completed).length;
  const currentStep = steps.find(step => !step.completed && !step.error);
  const errorStep = steps.find(step => step.error);

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* Game Logo/Title */}
        <div style={styles.title}>
          <h1>AXIOMANCER</h1>
          <p>A Philosophical Journey</p>
        </div>

        {/* Main Loading Message */}
        <div style={styles.mainMessage}>
          {errorStep ? (
            <p style={styles.errorText}>
              Error: {errorStep.error}
            </p>
          ) : (
            <p>{currentStep?.description || currentMessage}</p>
          )}
        </div>

        {/* Progress Bar */}
        <div style={styles.progressContainer}>
          <div 
            style={{
              ...styles.progressBar,
              width: `${progress}%`
            }}
          />
        </div>

        {/* Progress Text */}
        <div style={styles.progressText}>
          {completedSteps} / {steps.length} systems loaded
        </div>

        {/* Step Details */}
        <div style={styles.stepsContainer}>
          {steps.map((step, index) => (
            <div 
              key={step.name} 
              style={{
                ...styles.stepItem,
                ...(step.completed ? styles.stepCompleted : {}),
                ...(step.error ? styles.stepError : {}),
                ...(step === currentStep ? styles.stepCurrent : {})
              }}
            >
              <div style={styles.stepIcon}>
                {step.completed ? '✓' : step.error ? '✗' : '⋯'}
              </div>
              <div style={styles.stepText}>
                <span style={styles.stepName}>{step.name}</span>
                {step.error && (
                  <span style={styles.stepErrorText}>: {step.error}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Loading Animation */}
        <div style={styles.loadingAnimation}>
          <div style={styles.spinner}></div>
        </div>

        {/* Flavor Text */}
        <div style={styles.flavorText}>
          "In the realm of logic and reason, every journey begins with a single premise..."
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
    backgroundColor: '#1a1a2e',
    color: '#eee',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Arial, sans-serif',
    zIndex: 9999,
  },
  content: {
    textAlign: 'center' as const,
    maxWidth: '600px',
    padding: '2rem',
  },
  title: {
    marginBottom: '2rem',
  },
  mainMessage: {
    fontSize: '1.2rem',
    marginBottom: '2rem',
    minHeight: '1.5rem',
  },
  errorText: {
    color: '#ff6b6b',
  },
  progressContainer: {
    width: '100%',
    height: '8px',
    backgroundColor: '#333',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '1rem',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4ecdc4',
    transition: 'width 0.3s ease',
    borderRadius: '4px',
  },
  progressText: {
    fontSize: '0.9rem',
    marginBottom: '2rem',
    opacity: 0.8,
  },
  stepsContainer: {
    textAlign: 'left' as const,
    marginBottom: '2rem',
    maxHeight: '200px',
    overflowY: 'auto' as const,
  },
  stepItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '0.5rem',
    fontSize: '0.9rem',
    opacity: 0.6,
  },
  stepCompleted: {
    opacity: 1,
    color: '#4ecdc4',
  },
  stepError: {
    opacity: 1,
    color: '#ff6b6b',
  },
  stepCurrent: {
    opacity: 1,
    color: '#fff',
    fontWeight: 'bold' as const,
  },
  stepIcon: {
    width: '20px',
    marginRight: '0.5rem',
    textAlign: 'center' as const,
  },
  stepText: {
    flex: 1,
  },
  stepName: {
    textTransform: 'capitalize' as const,
  },
  stepErrorText: {
    fontSize: '0.8rem',
    opacity: 0.8,
  },
  loadingAnimation: {
    marginBottom: '2rem',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #333',
    borderTop: '4px solid #4ecdc4',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto',
  },
  flavorText: {
    fontSize: '0.9rem',
    fontStyle: 'italic' as const,
    opacity: 0.7,
    maxWidth: '400px',
    margin: '0 auto',
  },
};

// Add CSS animation for spinner
const spinnerStyle = document.createElement('style');
spinnerStyle.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(spinnerStyle);

export default LoadingScreen;