import styled from "@emotion/styled";
import { useState } from "react";
import { useCharacter } from "../../context/CharacterContext";
import { useMapLocation } from "../../hooks/useMapLocation";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoadingPage from "../LoadingPage/LoadingPage";
import InteractiveMap from "../../components/InteractiveMap/InteractiveMap";
import EventModal from "../../components/EventModal/EventModal";

interface MapNodeData {
  id: string;
  name: string;
  coordinates: {
    x: number;
    y: number;
  };
  area: string;
  unlocked: boolean;
}

interface MapNodeEvent {
  type: 'combat' | 'event' | 'rest';
  id: string;
  title: string;
  description: string;
  portrait?: string;
  rewards?: {
    experience?: number;
    items?: string[];
    fallacySpells?: string[];
    paradoxes?: string[];
  };
  enemy?: {
    type: 'greater_mythical' | 'lesser_mythical' | 'random';
    name: string;
    level: number;
  };
  choices?: {
    id: string;
    text: string;
    consequences?: {
      mpDrain?: boolean;
      items?: string[];
      fallacySpells?: string[];
    };
  }[];
}

const ExplorationContainer = styled.div`
  min-height: 100vh;
  height: 100vh;
  background: linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 50%, #0d0d0d 100%);
  display: grid;
  gap: 0.5rem;
  padding: 0.5rem;
  overflow: hidden;
  
  /* Desktop layout: 2x2 grid with character panel spanning bottom */
  grid-template-columns: 1fr 1fr;
  grid-template-rows: minmax(300px, 2fr) minmax(200px, auto);
  
  /* Mobile layout: single column stack */
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-rows: minmax(200px, auto) minmax(150px, auto) minmax(150px, auto);
    height: auto;
    min-height: 100vh;
    padding: 0.25rem;
    gap: 0.25rem;
  }
  
  /* Large desktop adjustments */
  @media (min-width: 1400px) {
    gap: 1rem;
    padding: 1rem;
    grid-template-rows: minmax(400px, 2fr) minmax(250px, auto);
  }
`;

const DescriptionPane = styled.div`
  background: linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(34, 34, 34, 0.95) 100%);
  border: 2px solid #444;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  box-shadow: inset 0 0 20px rgba(139, 69, 19, 0.1);
  overflow: hidden;
  min-height: 0;
  
  @media (min-width: 768px) {
    padding: 1.5rem;
  }
  
  @media (min-width: 1400px) {
    padding: 2rem;
  }
`;

const LocationHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid rgba(139, 69, 19, 0.3);
  flex-shrink: 0;
  
  @media (min-width: 768px) {
    gap: 1rem;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
  }
`;

const LocationIcon = styled.div`
  width: 40px;
  height: 40px;
  background: #8B4513;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: bold;
  font-size: 1.5rem;
`;

const LocationTitle = styled.h2`
  color: #8B4513;
  font-size: 1.2rem;
  margin: 0;
  text-shadow: 0 0 10px rgba(139, 69, 19, 0.5);
  
  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
  
  @media (min-width: 1400px) {
    font-size: 1.8rem;
  }
`;

const LocationDescription = styled.p`
  color: #ccc;
  line-height: 1.6;
  margin-bottom: 1rem;
  flex: 1;
  font-size: 0.9rem;
  overflow-y: auto;
  
  @media (min-width: 768px) {
    font-size: 1rem;
    line-height: 1.7;
    margin-bottom: 1.5rem;
  }
  
  @media (min-width: 1400px) {
    font-size: 1.1rem;
    line-height: 1.8;
    margin-bottom: 2rem;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  flex-shrink: 0;
  
  @media (min-width: 768px) {
    gap: 1rem;
  }
`;

const ActionButton = styled.button<{ variant?: 'danger' | 'primary' | 'secondary' }>`
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.05rem;
  font-size: 0.8rem;
  flex: 1;
  min-width: 0;
  
  @media (min-width: 768px) {
    padding: 0.875rem 1.5rem;
    font-size: 0.9rem;
    letter-spacing: 0.075rem;
    flex: none;
  }
  
  @media (min-width: 1400px) {
    padding: 1rem 2rem;
    font-size: 1rem;
    letter-spacing: 0.1rem;
  }
`;

const DangerButton = styled(ActionButton)`
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  color: #fff;
  box-shadow: 0 4px 15px rgba(220, 38, 38, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(220, 38, 38, 0.4);
  }
`;

const PrimaryButton = styled(ActionButton)`
  background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
  color: #fff;
  box-shadow: 0 4px 15px rgba(139, 69, 19, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(139, 69, 19, 0.4);
  }
`;

const SecondaryButton = styled(ActionButton)`
  background: rgba(139, 69, 19, 0.2);
  color: #8B4513;
  border: 2px solid rgba(139, 69, 19, 0.5);
  
  &:hover {
    background: rgba(139, 69, 19, 0.3);
    border-color: #8B4513;
  }
`;

const MapPane = styled.div`
  background: linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(34, 34, 34, 0.95) 100%);
  border: 2px solid #444;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  box-shadow: inset 0 0 20px rgba(139, 69, 19, 0.1);
`;

// Removed unused MapImage component

const CharacterPane = styled.div<{ expanded: boolean }>`
  grid-column: 1 / -1;
  background: linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(34, 34, 34, 0.95) 100%);
  border: 2px solid #444;
  border-radius: 12px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  box-shadow: inset 0 0 20px rgba(139, 69, 19, 0.1);
  overflow: hidden;
  min-height: 0;
  max-height: ${props => props.expanded ? '80vh' : 'auto'};
  
  &:hover {
    border-color: #8B4513;
  }
  
  @media (min-width: 768px) {
    padding: 1.5rem;
  }
  
  @media (min-width: 1400px) {
    padding: 2rem;
  }
  
  /* Mobile layout - character pane is third item */
  @media (max-width: 768px) {
    grid-column: 1;
    order: 3;
  }
`;

const CharacterHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const CharacterPortrait = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  border: 2px solid #8B4513;
  object-fit: cover;
`;

const CharacterInfo = styled.div`
  flex: 1;
`;

const CharacterName = styled.h3`
  color: #fff;
  font-size: 1.5rem;
  margin: 0 0 0.5rem 0;
`;

const CharacterLevel = styled.div`
  background: #8B4513;
  color: #fff;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
  display: inline-block;
`;

const StatsSection = styled.div`
  margin-top: 1.5rem;
`;

const ProgressBars = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 2rem;
  align-items: center;
`;

const ProgressGroup = styled.div``;

const ProgressLabel = styled.div`
  color: #8B4513;
  font-size: 0.9rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
`;

const ProgressBar = styled.div<{ current: number; max: number; color: string }>`
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
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
    background: ${props => props.color};
    border-radius: 10px;
  }
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
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
`;

const CoreStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
`;

const CoreStat = styled.div`
  text-align: center;
  padding: 1rem;
  background: rgba(139, 69, 19, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(139, 69, 19, 0.3);
`;

const CoreStatLabel = styled.div`
  color: #8B4513;
  font-size: 0.9rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
`;

const CoreStatValue = styled.div`
  color: #fff;
  font-size: 1.5rem;
  font-weight: bold;
`;

const DetailedStatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-top: 1rem;
  overflow-y: auto;
  max-height: 50vh;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    margin-top: 1.5rem;
  }
  
  @media (min-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    margin-top: 2rem;
  }
`;

const StatCategory = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid rgba(139, 69, 19, 0.2);
`;

const CategoryTitle = styled.h4`
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  text-align: center;
  padding: 0.5rem;
  border-radius: 6px;
`;

const BodyTitle = styled(CategoryTitle)`
  color: #dc2626;
  background: rgba(220, 38, 38, 0.1);
  border: 1px solid rgba(220, 38, 38, 0.3);
`;

const MindTitle = styled(CategoryTitle)`
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
`;

const HeartTitle = styled(CategoryTitle)`
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(139, 69, 19, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
`;

const StatName = styled.div`
  color: #ccc;
  font-size: 0.9rem;
`;

const StatValueSmall = styled.div`
  color: #fff;
  font-weight: bold;
`;

const ExperienceBar = styled.div`
  text-align: right;
`;

const ExperienceText = styled.div`
  color: #8B4513;
  font-size: 0.9rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const ExpandIcon = styled.div<{ expanded: boolean }>`
  position: absolute;
  top: 2rem;
  right: 2rem;
  color: #8B4513;
  font-size: 1.5rem;
  transition: transform 0.3s ease;
  transform: ${props => props.expanded ? 'rotate(180deg)' : 'rotate(0deg)'};
`;

const TooltipArea = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  right: 1rem;
  max-height: 100px;
  overflow-y: auto;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 6px;
  padding: 1rem;
  border: 1px solid rgba(139, 69, 19, 0.3);
`;

const TooltipTitle = styled.div`
  color: #8B4513;
  font-weight: bold;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const TooltipText = styled.div`
  color: #ccc;
  font-size: 0.8rem;
  line-height: 1.4;
`;

function ExplorationPage() {
  const { character, loading } = useCharacter();
  const { currentLocation } = useMapLocation();
  const { logout } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<MapNodeEvent | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  if (loading || !character) {
    return <LoadingPage />;
  }

  const handleEnterCombat = () => {
    navigate('/combat');
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      // Force redirect even if logout fails
      navigate('/login');
    }
  };

  const handleNodeClick = async (node: MapNodeData) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    try {
      // Mock API call - replace with actual API call
      const response = await fetch('/api/travel-to-node', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: character.id,
          characterId: character.id,
          nodeId: node.id,
          coordinates: node.coordinates
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.newEvent) {
          setCurrentEvent(result.newEvent);
        }
      } else {
        console.error('Failed to travel to node');
      }
    } catch (error) {
      console.error('Error traveling to node:', error);
      
      // Mock event generation for demo purposes
      const mockEvent: MapNodeEvent = {
        type: Math.random() < 0.5 ? 'combat' : Math.random() < 0.85 ? 'rest' : 'event',
        id: `mock_${Date.now()}`,
        title: 'Random Encounter',
        description: 'Something interesting happens as you explore this location...',
        portrait: 'Angel'
      };
      setCurrentEvent(mockEvent);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEventChoice = async (choiceId: string) => {
    if (!currentEvent) return;
    
    try {
      // Mock API call for event choice
      console.log('Processing event choice:', choiceId);
      setCurrentEvent(null);
    } catch (error) {
      console.error('Error processing event choice:', error);
    }
  };

  const handleEventCombat = async () => {
    if (!currentEvent) return;
    
    setCurrentEvent(null);
    navigate('/combat');
  };

  const handleEventRest = async () => {
    if (!currentEvent) return;
    
    try {
      // Mock API call for rest
      console.log('Processing rest event');
      setCurrentEvent(null);
      // Show success message or update character stats
    } catch (error) {
      console.error('Error processing rest:', error);
    }
  };

  const handleCloseEvent = () => {
    setCurrentEvent(null);
  };

  // Mock current location coordinates
  const currentCoordinates = { x: 50, y: 80 };

  return (
    <ExplorationContainer>
      <DescriptionPane>
        <LocationHeader>
          <LocationIcon>📍</LocationIcon>
          <LocationTitle>{currentLocation}</LocationTitle>
        </LocationHeader>

        <LocationDescription>
          You stand at the edge of the Whispering Woods. Ancient trees stretch endlessly
          before you, their branches swaying in the ethereal breeze. Strange sounds echo
          from the depths - both alluring and ominous. The very air seems thick with
          forgotten secrets and lurking dangers.
        </LocationDescription>

        <ButtonContainer>
          <DangerButton onClick={handleEnterCombat}>
            Enter Combat
          </DangerButton>
          <PrimaryButton>
            Rest
          </PrimaryButton>
          <SecondaryButton>
            Inventory
          </SecondaryButton>
          <SecondaryButton onClick={handleLogout}>
            Logout
          </SecondaryButton>
        </ButtonContainer>
      </DescriptionPane>

      <MapPane>
        <InteractiveMap 
          currentLocation={currentCoordinates}
          onNodeClick={handleNodeClick}
        />
      </MapPane>

      <CharacterPane expanded={expanded} onClick={() => setExpanded(!expanded)}>
        <ExpandIcon expanded={expanded}>⌄</ExpandIcon>

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

        <StatsSection>
          <ProgressBars>
            <ProgressGroup>
              <ProgressLabel>Health</ProgressLabel>
              <ProgressBar
                current={character.currentHp}
                max={character.maxHp}
                color={character.currentHp > character.maxHp * 0.6 ? '#4ade80' :
                  character.currentHp > character.maxHp * 0.3 ? '#fbbf24' : '#ef4444'}
              >
                <BarText>{character.currentHp}/{character.maxHp}</BarText>
              </ProgressBar>
            </ProgressGroup>

            <ProgressGroup>
              <ProgressLabel>Mana</ProgressLabel>
              <ProgressBar
                current={character.currentMp}
                max={character.maxMp}
                color="#3b82f6"
              >
                <BarText>{character.currentMp}/{character.maxMp}</BarText>
              </ProgressBar>
            </ProgressGroup>

            <ExperienceBar>
              <ExperienceText>Experience</ExperienceText>
              <ProgressBar
                current={character.experience}
                max={character.experienceToNext}
                color="#8B4513"
              >
                <BarText>{character.experience}/{character.experienceToNext}</BarText>
              </ProgressBar>
            </ExperienceBar>
          </ProgressBars>

          <CoreStatsGrid>
            <CoreStat>
              <CoreStatLabel>Body</CoreStatLabel>
              <CoreStatValue>{character.stats.body}</CoreStatValue>
            </CoreStat>
            <CoreStat>
              <CoreStatLabel>Mind</CoreStatLabel>
              <CoreStatValue>{character.stats.mind}</CoreStatValue>
            </CoreStat>
            <CoreStat>
              <CoreStatLabel>Heart</CoreStatLabel>
              <CoreStatValue>{character.stats.heart}</CoreStatValue>
            </CoreStat>
          </CoreStatsGrid>

          {expanded && (
            <DetailedStatsGrid>
              <StatCategory>
                <BodyTitle>Body ({character.stats.body})</BodyTitle>
                <StatRow>
                  <StatName>Physical Atk</StatName>
                  <StatValueSmall>{character.detailedStats.physicalAtk}</StatValueSmall>
                </StatRow>
                <StatRow>
                  <StatName>Physical Def</StatName>
                  <StatValueSmall>{character.detailedStats.physicalDef}</StatValueSmall>
                </StatRow>
                <StatRow>
                  <StatName>Accuracy</StatName>
                  <StatValueSmall>{character.detailedStats.accuracy}%</StatValueSmall>
                </StatRow>
                <StatRow>
                  <StatName>Crit Damage</StatName>
                  <StatValueSmall>{character.detailedStats.critDamage}%</StatValueSmall>
                </StatRow>
                <StatRow>
                  <StatName>Constitution</StatName>
                  <StatValueSmall>{character.detailedStats.constitution}</StatValueSmall>
                </StatRow>
              </StatCategory>

              <StatCategory>
                <MindTitle>Mind ({character.stats.mind})</MindTitle>
                <StatRow>
                  <StatName>Mental Atk</StatName>
                  <StatValueSmall>{character.detailedStats.mentalAtk}</StatValueSmall>
                </StatRow>
                <StatRow>
                  <StatName>Mental Def</StatName>
                  <StatValueSmall>{character.detailedStats.mentalDef}</StatValueSmall>
                </StatRow>
                <StatRow>
                  <StatName>Evasion</StatName>
                  <StatValueSmall>{character.detailedStats.evasion}%</StatValueSmall>
                </StatRow>
                <StatRow>
                  <StatName>Perception</StatName>
                  <StatValueSmall>{character.detailedStats.perception}</StatValueSmall>
                </StatRow>
                <StatRow>
                  <StatName>Reflex Save</StatName>
                  <StatValueSmall>{character.detailedStats.reflexSave}</StatValueSmall>
                </StatRow>
              </StatCategory>

              <StatCategory>
                <HeartTitle>Heart ({character.stats.heart})</HeartTitle>
                <StatRow>
                  <StatName>Charisma</StatName>
                  <StatValueSmall>{character.detailedStats.charisma}</StatValueSmall>
                </StatRow>
                <StatRow>
                  <StatName>Ailment Atk</StatName>
                  <StatValueSmall>{character.detailedStats.ailmentAtk}</StatValueSmall>
                </StatRow>
                <StatRow>
                  <StatName>Critical Rate</StatName>
                  <StatValueSmall>{character.detailedStats.criticalRate}%</StatValueSmall>
                </StatRow>
                <StatRow>
                  <StatName>Willpower</StatName>
                  <StatValueSmall>{character.detailedStats.willpower}</StatValueSmall>
                </StatRow>
                <StatRow>
                  <StatName>Empathy</StatName>
                  <StatValueSmall>{character.detailedStats.empathy}</StatValueSmall>
                </StatRow>
                <StatRow>
                  <StatName>Luck</StatName>
                  <StatValueSmall>{character.detailedStats.luck}</StatValueSmall>
                </StatRow>
              </StatCategory>
            </DetailedStatsGrid>
          )}

          {!expanded && (
            <TooltipArea>
              <TooltipTitle>Current Status</TooltipTitle>
              <TooltipText>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation.
              </TooltipText>
            </TooltipArea>
          )}
        </StatsSection>
      </CharacterPane>

      <EventModal
        event={currentEvent}
        onClose={handleCloseEvent}
        onChoice={handleEventChoice}
        onCombat={handleEventCombat}
        onRest={handleEventRest}
      />
    </ExplorationContainer>
  );
}

export default ExplorationPage;