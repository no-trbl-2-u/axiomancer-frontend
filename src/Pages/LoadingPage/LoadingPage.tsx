import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const pulsate = keyframes`
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
`;

const flickerAnimation = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
  75% { opacity: 0.9; }
`;

const LoadingContainer = styled.div`
  height: 100vh;
  background: linear-gradient(135deg, #1a0a0a 0%, #2d1b1b 50%, #1a0a0a 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 50% 50%, rgba(139, 69, 19, 0.1) 0%, transparent 50%);
    animation: ${pulsate} 4s ease-in-out infinite;
  }
`;

const LoadingContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  z-index: 2;
  animation: ${fadeIn} 1s ease-in-out;
`;

const GameTitle = styled.h1`
  font-size: 4rem;
  font-weight: bold;
  color: #8B4513;
  text-shadow: 
    0 0 10px rgba(139, 69, 19, 0.8),
    0 0 20px rgba(139, 69, 19, 0.6),
    0 0 30px rgba(139, 69, 19, 0.4);
  margin: 0;
  letter-spacing: 0.2rem;
  animation: ${flickerAnimation} 3s ease-in-out infinite;
  font-family: serif;
`;

const LoadingText = styled.p`
  color: #666;
  font-size: 1.2rem;
  margin: 0;
  letter-spacing: 0.1rem;
  text-transform: uppercase;
`;

const LoadingSpinner = styled.div`
  width: 60px;
  height: 60px;
  border: 3px solid rgba(139, 69, 19, 0.1);
  border-top: 3px solid #8B4513;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const AtmosphericElements = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
  
  &::before {
    content: '';
    position: absolute;
    top: 20%;
    left: -10%;
    width: 120%;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, rgba(139, 69, 19, 0.3) 50%, transparent 100%);
    transform: rotate(45deg);
    animation: ${pulsate} 6s ease-in-out infinite reverse;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 30%;
    right: -10%;
    width: 120%;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, rgba(139, 69, 19, 0.2) 50%, transparent 100%);
    transform: rotate(-45deg);
    animation: ${pulsate} 8s ease-in-out infinite;
  }
`;

const FlavorText = styled.div`
  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
  color: #444;
  font-size: 0.9rem;
  text-align: center;
  max-width: 500px;
  line-height: 1.6;
  font-style: italic;
  animation: ${fadeIn} 2s ease-in-out 1s both;
`;

function LoadingPage() {
  return (
    <LoadingContainer>
      <AtmosphericElements />
      
      <LoadingContent>
        <GameTitle>AXIOMANCER</GameTitle>
        <LoadingSpinner />
        <LoadingText>Awakening from the Void...</LoadingText>
      </LoadingContent>
      
      <FlavorText>
        In the depths of despair, where hope withers and dies,<br />
        the last pilgrimage begins...
      </FlavorText>
    </LoadingContainer>
  );
}

export default LoadingPage;