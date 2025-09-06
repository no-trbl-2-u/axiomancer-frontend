import styled from "@emotion/styled";
import { useState } from "react";
import { useCharacter } from "../../context/CharacterContext";
import { useNavigate } from "react-router-dom";
import LoadingPage from "../LoadingPage/LoadingPage";

type MoveType = 'body' | 'mind' | 'heart';
type ActionType = 'attack' | 'defend' | 'special';
type AdvantageType = 'advantage' | 'neutral' | 'disadvantage';

const CombatContainer = styled.div`
  min-height: 100vh;
  height: 100vh;
  background: linear-gradient(135deg, #0d0d0d 0%, #1a0a0a 50%, #0d0d0d 100%);
  display: grid;
  gap: 0.5rem;
  padding: 0.5rem;
  overflow: hidden;
  
  /* Mobile layout: stack vertically */
  grid-template-rows: minmax(120px, auto) 1fr minmax(200px, auto);
  
  /* Tablet and desktop */
  @media (min-width: 768px) {
    grid-template-rows: minmax(150px, auto) 1fr minmax(220px, auto);
    gap: 0.75rem;
    padding: 0.75rem;
  }
  
  @media (min-width: 1200px) {
    grid-template-rows: 200px 1fr 250px;
    gap: 1rem;
    padding: 1rem;
  }
`;

const EnemyPane = styled.div`
  background: linear-gradient(135deg, rgba(139, 0, 0, 0.2) 0%, rgba(26, 26, 26, 0.95) 100%);
  border: 2px solid #8B0000;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 
    0 0 20px rgba(139, 0, 0, 0.3),
    inset 0 0 20px rgba(139, 0, 0, 0.1);
  min-height: 0;
  overflow: hidden;
  
  @media (min-width: 768px) {
    padding: 1.5rem;
    gap: 1.5rem;
  }
  
  @media (min-width: 1200px) {
    padding: 2rem;
    gap: 2rem;
  }
`;

const EnemyPortrait = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 8px;
  border: 2px solid #8B0000;
  object-fit: cover;
  filter: sepia(30%) hue-rotate(300deg) saturate(1.5);
  flex-shrink: 0;
  
  @media (min-width: 768px) {
    width: 100px;
    height: 100px;
    border-radius: 10px;
    border: 3px solid #8B0000;
  }
  
  @media (min-width: 1200px) {
    width: 120px;
    height: 120px;
    border-radius: 12px;
  }
`;

const EnemyInfo = styled.div`
  flex: 1;
`;

const EnemyName = styled.h2`
  color: #ff4444;
  font-size: 1.2rem;
  margin: 0 0 0.75rem 0;
  text-shadow: 0 0 10px rgba(255, 68, 68, 0.8);
  
  @media (min-width: 768px) {
    font-size: 1.6rem;
    margin: 0 0 1rem 0;
  }
  
  @media (min-width: 1200px) {
    font-size: 2rem;
  }
`;

const EnemyHealthBar = styled.div<{ current: number; max: number }>`
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  height: 30px;
  border: 2px solid #8B0000;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${props => (props.current / props.max) * 100}%;
    background: linear-gradient(90deg, #dc2626 0%, #ef4444 100%);
    border-radius: 8px;
  }
`;

const EnemyHealthText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-weight: bold;
  z-index: 3;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
`;

const BattleLogPane = styled.div`
  background: linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(34, 34, 34, 0.95) 100%);
  border: 2px solid #444;
  border-radius: 12px;
  padding: 2rem;
  overflow-y: auto;
  box-shadow: inset 0 0 20px rgba(139, 69, 19, 0.1);
`;

const BattleLogTitle = styled.h3`
  color: #8B4513;
  font-size: 1.5rem;
  margin: 0 0 1rem 0;
  text-align: center;
  border-bottom: 2px solid rgba(139, 69, 19, 0.3);
  padding-bottom: 1rem;
`;

const BattleLogContent = styled.div`
  color: #ccc;
  line-height: 1.8;
  font-size: 1rem;
`;

const BattleLogEntry = styled.div<{ type?: 'player' | 'enemy' | 'system' }>`
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border-left: 4px solid ${props => 
    props.type === 'player' ? '#8B4513' : 
    props.type === 'enemy' ? '#dc2626' : 
    '#666'};
  background: ${props => 
    props.type === 'player' ? 'rgba(139, 69, 19, 0.1)' : 
    props.type === 'enemy' ? 'rgba(220, 38, 38, 0.1)' : 
    'rgba(102, 102, 102, 0.1)'};
`;

const PlayerPane = styled.div`
  display: grid;
  gap: 0.5rem;
  min-height: 0;
  
  /* Mobile: stack vertically */
  grid-template-columns: 1fr;
  grid-template-rows: auto auto;
  
  /* Tablet and desktop: side by side */
  @media (min-width: 768px) {
    grid-template-columns: 250px 1fr;
    grid-template-rows: 1fr;
    gap: 1rem;
  }
  
  @media (min-width: 1200px) {
    grid-template-columns: 300px 1fr;
    gap: 2rem;
  }
`;

const PlayerInfo = styled.div`
  background: linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(34, 34, 34, 0.95) 100%);
  border: 2px solid #444;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: inset 0 0 20px rgba(139, 69, 19, 0.1);
`;

const PlayerHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const PlayerPortrait = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  border: 2px solid #8B4513;
  object-fit: cover;
`;

const PlayerDetails = styled.div`
  flex: 1;
`;

const PlayerName = styled.h3`
  color: #fff;
  font-size: 1.2rem;
  margin: 0 0 0.5rem 0;
`;

const PlayerLevel = styled.div`
  background: #8B4513;
  color: #fff;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
  display: inline-block;
`;

const PlayerStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const PlayerHealthBar = styled.div<{ current: number; max: number }>`
  background: rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  height: 20px;
  border: 1px solid rgba(139, 69, 19, 0.3);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${props => (props.current / props.max) * 100}%;
    background: ${props => props.current > props.max * 0.6 ? '#4ade80' : 
                        props.current > props.max * 0.3 ? '#fbbf24' : '#ef4444'};
    border-radius: 8px;
  }
`;

const PlayerBarText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-size: 0.8rem;
  font-weight: bold;
  z-index: 3;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
`;

const PlayerBarLabel = styled.div`
  color: #ccc;
  font-size: 0.8rem;
  margin-bottom: 0.3rem;
  text-transform: uppercase;
`;

const MoveTypeButtons = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
`;

const MoveTypeButton = styled.button<{ 
  moveType: MoveType; 
  selected: boolean; 
  advantage: AdvantageType;
}>`
  padding: 0.8rem;
  border: 2px solid;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  font-size: 0.9rem;
  
  ${props => {
    const colors = {
      body: { primary: '#dc2626', light: '#fca5a5', dark: '#991b1b' },
      mind: { primary: '#3b82f6', light: '#93c5fd', dark: '#1e40af' },
      heart: { primary: '#10b981', light: '#6ee7b7', dark: '#047857' }
    };
    
    const color = colors[props.moveType];
    const isSelected = props.selected;
    
    let borderColor = color.primary;
    if (props.advantage === 'advantage') borderColor = '#10b981';
    else if (props.advantage === 'disadvantage') borderColor = '#dc2626';
    
    return `
      background: ${isSelected ? color.primary : 'transparent'};
      color: ${isSelected ? '#fff' : color.light};
      border-color: ${borderColor};
      
      &:hover {
        background: ${isSelected ? color.dark : color.primary}20;
        border-color: ${borderColor};
        transform: translateY(-2px);
      }
    `;
  }}
`;

const ActionPane = styled.div`
  background: linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(34, 34, 34, 0.95) 100%);
  border: 2px solid #444;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-shadow: inset 0 0 20px rgba(139, 69, 19, 0.1);
`;

const ActionTitle = styled.h3`
  color: #8B4513;
  font-size: 1.3rem;
  margin: 0 0 1.5rem 0;
  text-align: center;
`;

const ActionButtons = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
`;

const ActionButton = styled.button<{ 
  actionType: ActionType; 
  disabled?: boolean;
  moveType?: MoveType;
}>`
  padding: 1.5rem;
  border: 2px solid #666;
  border-radius: 12px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  font-size: 1rem;
  letter-spacing: 0.1rem;
  position: relative;
  
  ${props => {
    if (props.disabled) {
      return `
        background: #333;
        color: #666;
        cursor: not-allowed;
        border-color: #444;
      `;
    }
    
    const moveColors = {
      body: '#dc2626',
      mind: '#3b82f6', 
      heart: '#10b981'
    };
    
    const accentColor = props.moveType ? moveColors[props.moveType] : '#8B4513';
    
    return `
      background: transparent;
      color: ${accentColor};
      border-color: ${accentColor};
      
      &:hover {
        background: ${accentColor}20;
        transform: translateY(-3px);
        box-shadow: 0 6px 20px ${accentColor}40;
      }
      
      &:active {
        transform: translateY(-1px);
      }
    `;
  }}
`;

const AdvantageIndicator = styled.div<{ advantage: AdvantageType }>`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => 
    props.advantage === 'advantage' ? '#10b981' :
    props.advantage === 'disadvantage' ? '#dc2626' :
    '#666'
  };
`;

function CombatPage() {
  const { character, loading } = useCharacter();
  const [selectedMoveType, setSelectedMoveType] = useState<MoveType>('body');
  const [battleLog, setBattleLog] = useState([
    "A Forest Spirit materializes from the shadows, its eyes gleaming with malevolent intent!",
    "The air grows thick with an otherworldly presence...",
    "Choose your approach wisely - your very soul depends on it."
  ]);
  const navigate = useNavigate();

  // Mock enemy data
  const enemy = {
    name: "Corrupted Forest Spirit",
    currentHp: 45,
    maxHp: 60,
    portrait: "https://picsum.photos/120/120?random=enemy",
    moveType: 'mind' as MoveType // Enemy's current move type for advantage calculation
  };

  if (loading || !character) {
    return <LoadingPage />;
  }

  const getAdvantage = (playerMove: MoveType, enemyMove: MoveType): AdvantageType => {
    // Body > Mind > Heart > Body (rock-paper-scissors style)
    if (
      (playerMove === 'body' && enemyMove === 'mind') ||
      (playerMove === 'mind' && enemyMove === 'heart') ||
      (playerMove === 'heart' && enemyMove === 'body')
    ) {
      return 'advantage';
    } else if (
      (playerMove === 'mind' && enemyMove === 'body') ||
      (playerMove === 'heart' && enemyMove === 'mind') ||
      (playerMove === 'body' && enemyMove === 'heart')
    ) {
      return 'disadvantage';
    }
    return 'neutral';
  };

  const advantage = getAdvantage(selectedMoveType, enemy.moveType);

  const handleAction = (actionType: ActionType) => {
    const newEntry = `You attempt a ${selectedMoveType} ${actionType} against the Forest Spirit...`;
    setBattleLog(prev => [...prev, newEntry]);
  };

  const handleFlee = () => {
    navigate('/exploration');
  };

  return (
    <CombatContainer>
      <EnemyPane>
        <EnemyPortrait src={enemy.portrait} alt={enemy.name} />
        <EnemyInfo>
          <EnemyName>{enemy.name}</EnemyName>
          <EnemyHealthBar current={enemy.currentHp} max={enemy.maxHp}>
            <EnemyHealthText>{enemy.currentHp}/{enemy.maxHp}</EnemyHealthText>
          </EnemyHealthBar>
        </EnemyInfo>
      </EnemyPane>

      <BattleLogPane>
        <BattleLogTitle>Battle Chronicle</BattleLogTitle>
        <BattleLogContent>
          {battleLog.map((entry, index) => (
            <BattleLogEntry 
              key={index}
              type={entry.includes('You') ? 'player' : 'system'}
            >
              {entry}
            </BattleLogEntry>
          ))}
        </BattleLogContent>
      </BattleLogPane>

      <PlayerPane>
        <PlayerInfo>
          <PlayerHeader>
            <PlayerPortrait 
              src={`/images/portraits/${character.portrait}.jpg`} 
              alt={character.name}
            />
            <PlayerDetails>
              <PlayerName>{character.name}</PlayerName>
              <PlayerLevel>Lv. {character.level}</PlayerLevel>
            </PlayerDetails>
          </PlayerHeader>

          <PlayerStats>
            <div>
              <PlayerBarLabel>Health</PlayerBarLabel>
              <PlayerHealthBar current={character.currentHp} max={character.maxHp}>
                <PlayerBarText>{character.currentHp}/{character.maxHp}</PlayerBarText>
              </PlayerHealthBar>
            </div>
            <div>
              <PlayerBarLabel>Mana</PlayerBarLabel>
              <PlayerHealthBar current={character.currentMp} max={character.maxMp}>
                <PlayerBarText>{character.currentMp}/{character.maxMp}</PlayerBarText>
              </PlayerHealthBar>
            </div>
          </PlayerStats>

          <MoveTypeButtons>
            <MoveTypeButton
              moveType="body"
              selected={selectedMoveType === 'body'}
              advantage={selectedMoveType === 'body' ? advantage : 'neutral'}
              onClick={() => setSelectedMoveType('body')}
            >
              Body
            </MoveTypeButton>
            <MoveTypeButton
              moveType="mind"
              selected={selectedMoveType === 'mind'}
              advantage={selectedMoveType === 'mind' ? advantage : 'neutral'}
              onClick={() => setSelectedMoveType('mind')}
            >
              Mind
            </MoveTypeButton>
            <MoveTypeButton
              moveType="heart"
              selected={selectedMoveType === 'heart'}
              advantage={selectedMoveType === 'heart' ? advantage : 'neutral'}
              onClick={() => setSelectedMoveType('heart')}
            >
              Heart
            </MoveTypeButton>
          </MoveTypeButtons>
        </PlayerInfo>

        <ActionPane>
          <ActionTitle>
            Choose Your Action
            {advantage !== 'neutral' && (
              <div style={{ 
                fontSize: '0.9rem', 
                color: advantage === 'advantage' ? '#10b981' : '#dc2626',
                fontWeight: 'normal',
                marginTop: '0.5rem'
              }}>
                ({advantage === 'advantage' ? 'ADVANTAGE' : 'DISADVANTAGE'})
              </div>
            )}
          </ActionTitle>

          <ActionButtons>
            <ActionButton
              actionType="attack"
              moveType={selectedMoveType}
              onClick={() => handleAction('attack')}
            >
              <AdvantageIndicator advantage={advantage} />
              Attack
            </ActionButton>
            <ActionButton
              actionType="defend"
              moveType={selectedMoveType}
              onClick={() => handleAction('defend')}
            >
              <AdvantageIndicator advantage={advantage} />
              Defend
            </ActionButton>
            <ActionButton
              actionType="special"
              moveType={selectedMoveType}
              onClick={() => handleAction('special')}
            >
              <AdvantageIndicator advantage={advantage} />
              Sp. Attack
            </ActionButton>
          </ActionButtons>

          <ActionButton
            actionType="attack"
            style={{ 
              marginTop: '1rem', 
              background: 'rgba(139, 69, 19, 0.2)',
              borderColor: '#8B4513',
              color: '#8B4513'
            }}
            onClick={handleFlee}
          >
            Flee Combat
          </ActionButton>
        </ActionPane>
      </PlayerPane>
    </CombatContainer>
  );
}

export default CombatPage;