import styled from "@emotion/styled";
import { useState } from "react";
import { useCharacter } from "../../context/CharacterContext";
import { useNavigate } from "react-router-dom";
import CharacterCreationModal from "./CharacterCreationModal";
import LoadingPage from "../LoadingPage/LoadingPage";

const CharacterContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 50%, #0d0d0d 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 30%, rgba(139, 69, 19, 0.1) 0%, transparent 30%),
      radial-gradient(circle at 80% 70%, rgba(139, 69, 19, 0.05) 0%, transparent 40%);
  }
  
  @media (min-width: 768px) {
    padding: 1.5rem;
  }
  
  @media (min-width: 1200px) {
    padding: 2rem;
  }
`;

const PageTitle = styled.h1`
  color: #8B4513;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 2rem;
  text-shadow: 0 0 10px rgba(139, 69, 19, 0.5);
  z-index: 2;
  position: relative;
  letter-spacing: 0.075rem;
  text-align: center;
  
  @media (min-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 2.5rem;
    letter-spacing: 0.085rem;
  }
  
  @media (min-width: 1200px) {
    font-size: 3rem;
    margin-bottom: 3rem;
    letter-spacing: 0.1rem;
  }
`;

const CreateCharacterCard = styled.div`
  width: 100%;
  max-width: 350px;
  height: 400px;
  background: rgba(26, 26, 26, 0.95);
  border: 2px dashed #444;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
  
  &:hover {
    border-color: #8B4513;
    background: rgba(139, 69, 19, 0.1);
    box-shadow: 
      0 0 20px rgba(139, 69, 19, 0.3),
      inset 0 0 20px rgba(139, 69, 19, 0.1);
    transform: translateY(-5px);
  }
  
  @media (min-width: 768px) {
    max-width: 380px;
    height: 450px;
  }
  
  @media (min-width: 1200px) {
    max-width: 400px;
    height: 500px;
  }
`;

const PlusIcon = styled.div`
  width: 80px;
  height: 80px;
  border: 3px solid #666;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  transition: all 0.3s ease;
  
  &::before {
    content: '+';
    font-size: 3rem;
    color: #666;
    font-weight: bold;
  }
  
  ${CreateCharacterCard}:hover & {
    border-color: #8B4513;
    
    &::before {
      color: #8B4513;
      text-shadow: 0 0 10px rgba(139, 69, 19, 0.8);
    }
  }
`;

const CreateText = styled.div`
  color: #888;
  font-size: 1.5rem;
  font-weight: 500;
  text-align: center;
  transition: color 0.3s ease;
  
  ${CreateCharacterCard}:hover & {
    color: #8B4513;
    text-shadow: 0 0 5px rgba(139, 69, 19, 0.5);
  }
`;

const CharacterCard = styled.div`
  width: 100%;
  max-width: 350px;
  background: linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(34, 34, 34, 0.95) 100%);
  border: 2px solid #444;
  border-radius: 12px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
  
  &:hover {
    border-color: #8B4513;
    box-shadow: 
      0 0 20px rgba(139, 69, 19, 0.4),
      inset 0 0 20px rgba(139, 69, 19, 0.1);
    transform: translateY(-5px);
  }
  
  @media (min-width: 768px) {
    max-width: 380px;
    padding: 1.5rem;
  }
  
  @media (min-width: 1200px) {
    max-width: 400px;
    padding: 2rem;
  }
`;

const CharacterHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const CharacterPortrait = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 8px;
  border: 2px solid #8B4513;
  object-fit: cover;
`;

const CharacterInfo = styled.div`
  flex: 1;
`;

const CharacterName = styled.h2`
  color: #fff;
  font-size: 1.8rem;
  margin: 0 0 0.5rem 0;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.3);
`;

const CharacterLevel = styled.div`
  background: #8B4513;
  color: #fff;
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.9rem;
  font-weight: bold;
  display: inline-block;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatItem = styled.div`
  text-align: center;
  padding: 1rem;
  background: rgba(139, 69, 19, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(139, 69, 19, 0.3);
`;

const StatLabel = styled.div`
  color: #8B4513;
  font-size: 0.9rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
`;

const StatValue = styled.div`
  color: #fff;
  font-size: 1.5rem;
  font-weight: bold;
`;

const HealthManaSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const ProgressBar = styled.div<{ current: number; max: number }>`
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  height: 20px;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${props => (props.current / props.max) * 100}%;
    background: ${props => props.current > props.max * 0.6 ? '#4ade80' : 
                        props.current > props.max * 0.3 ? '#fbbf24' : '#ef4444'};
    border-radius: 10px;
  }
`;

const BarLabel = styled.div`
  color: #ccc;
  font-size: 0.8rem;
  margin-bottom: 0.3rem;
  text-transform: uppercase;
`;

const BarText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-size: 0.8rem;
  font-weight: bold;
  z-index: 3;
`;

function CharacterPage() {
  const { character, loading, hasCharacter } = useCharacter();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigate = useNavigate();

  if (loading) {
    return <LoadingPage />;
  }

  const handleCharacterClick = () => {
    if (hasCharacter && character) {
      navigate('/exploration');
    }
  };

  const handleCreateClick = () => {
    setShowCreateModal(true);
  };

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    navigate('/exploration');
  };

  return (
    <CharacterContainer>
      <PageTitle>Choose Your Fate</PageTitle>
      
      {!hasCharacter ? (
        <CreateCharacterCard onClick={handleCreateClick}>
          <PlusIcon />
          <CreateText>Create Character</CreateText>
        </CreateCharacterCard>
      ) : character && (
        <CharacterCard onClick={handleCharacterClick}>
          <CharacterHeader>
            <CharacterPortrait 
              src={`/images/portraits/${character.portrait}.jpg`} 
              alt={character.name}
            />
            <CharacterInfo>
              <CharacterName>{character.name}</CharacterName>
              <CharacterLevel>Lv. {character.level}</CharacterLevel>
            </CharacterInfo>
          </CharacterHeader>
          
          <StatsGrid>
            <StatItem>
              <StatLabel>Body</StatLabel>
              <StatValue>{character.stats.body}</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>Mind</StatLabel>
              <StatValue>{character.stats.mind}</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>Heart</StatLabel>
              <StatValue>{character.stats.heart}</StatValue>
            </StatItem>
          </StatsGrid>
          
          <HealthManaSection>
            <div>
              <BarLabel>Health</BarLabel>
              <ProgressBar current={character.currentHp} max={character.maxHp}>
                <BarText>{character.currentHp}/{character.maxHp}</BarText>
              </ProgressBar>
            </div>
            <div>
              <BarLabel>Mana</BarLabel>
              <ProgressBar current={character.currentMp} max={character.maxMp}>
                <BarText>{character.currentMp}/{character.maxMp}</BarText>
              </ProgressBar>
            </div>
          </HealthManaSection>
        </CharacterCard>
      )}
      
      {showCreateModal && (
        <CharacterCreationModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />
      )}
    </CharacterContainer>
  );
}

export default CharacterPage;