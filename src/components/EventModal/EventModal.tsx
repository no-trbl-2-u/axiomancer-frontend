import styled from "@emotion/styled";
import { useState } from "react";

interface EventChoice {
  id: string;
  text: string;
  consequences?: {
    mpDrain?: boolean;
    items?: string[];
    fallacySpells?: string[];
  };
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
  choices?: EventChoice[];
}

interface EventModalProps {
  event: MapNodeEvent | null;
  onClose: () => void;
  onChoice: (choiceId: string) => void;
  onCombat: () => void;
  onRest: () => void;
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(34, 34, 34, 0.95) 100%);
  border: 2px solid #8B4513;
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 0 30px rgba(139, 69, 19, 0.3);
`;

const ModalHeader = styled.div`
  padding: 2rem 2rem 1rem 2rem;
  border-bottom: 2px solid rgba(139, 69, 19, 0.3);
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const EventPortrait = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 8px;
  border: 2px solid #8B4513;
  object-fit: cover;
`;

const EventInfo = styled.div`
  flex: 1;
`;

const EventTitle = styled.h2`
  color: #8B4513;
  font-size: 1.5rem;
  margin: 0 0 0.5rem 0;
  text-shadow: 0 0 10px rgba(139, 69, 19, 0.5);
`;

const EventType = styled.div<{ type: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
  display: inline-block;
  text-transform: uppercase;
  
  ${props => props.type === 'combat' && `
    background: rgba(220, 38, 38, 0.2);
    color: #dc2626;
    border: 1px solid rgba(220, 38, 38, 0.3);
  `}
  
  ${props => props.type === 'event' && `
    background: rgba(139, 69, 19, 0.2);
    color: #8B4513;
    border: 1px solid rgba(139, 69, 19, 0.3);
  `}
  
  ${props => props.type === 'rest' && `
    background: rgba(16, 185, 129, 0.2);
    color: #10b981;
    border: 1px solid rgba(16, 185, 129, 0.3);
  `}
`;

const ModalBody = styled.div`
  padding: 2rem;
`;

const EventDescription = styled.p`
  color: #ccc;
  line-height: 1.6;
  margin-bottom: 2rem;
  font-size: 1rem;
`;

const EnemyInfo = styled.div`
  background: rgba(220, 38, 38, 0.1);
  border: 1px solid rgba(220, 38, 38, 0.3);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 2rem;
`;

const EnemyName = styled.div`
  color: #dc2626;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const EnemyLevel = styled.div`
  color: #ccc;
  font-size: 0.9rem;
`;

const ChoiceContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ChoiceButton = styled.button<{ variant?: 'danger' | 'primary' | 'success' }>`
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  font-size: 1rem;
  
  ${props => props.variant === 'danger' && `
    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
    color: #fff;
    box-shadow: 0 4px 15px rgba(220, 38, 38, 0.3);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(220, 38, 38, 0.4);
    }
  `}
  
  ${props => props.variant === 'primary' && `
    background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
    color: #fff;
    box-shadow: 0 4px 15px rgba(139, 69, 19, 0.3);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(139, 69, 19, 0.4);
    }
  `}
  
  ${props => props.variant === 'success' && `
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: #fff;
    box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
    }
  `}
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: #8B4513;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  
  &:hover {
    color: #A0522D;
  }
`;

function EventModal({ event, onClose, onChoice, onCombat, onRest }: EventModalProps) {
  const [processing, setProcessing] = useState(false);

  if (!event) return null;

  const handleChoice = async (choiceId: string) => {
    setProcessing(true);
    await onChoice(choiceId);
    setProcessing(false);
  };

  const handleCombat = async () => {
    setProcessing(true);
    await onCombat();
    setProcessing(false);
  };

  const handleRest = async () => {
    setProcessing(true);
    await onRest();
    setProcessing(false);
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>✕</CloseButton>
        
        <ModalHeader>
          {event.portrait && (
            <EventPortrait
              src={`/images/portraits/${event.portrait}.jpg`}
              alt={event.title}
            />
          )}
          <EventInfo>
            <EventTitle>{event.title}</EventTitle>
            <EventType type={event.type}>{event.type}</EventType>
          </EventInfo>
        </ModalHeader>

        <ModalBody>
          <EventDescription>{event.description}</EventDescription>

          {event.enemy && (
            <EnemyInfo>
              <EnemyName>{event.enemy.name}</EnemyName>
              <EnemyLevel>Level {event.enemy.level} {event.enemy.type.replace('_', ' ')} creature</EnemyLevel>
            </EnemyInfo>
          )}

          <ChoiceContainer>
            {event.type === 'combat' && (
              <ChoiceButton 
                variant="danger" 
                onClick={handleCombat}
                disabled={processing}
              >
                {processing ? 'Entering Combat...' : 'Enter Combat'}
              </ChoiceButton>
            )}

            {event.type === 'rest' && (
              <ChoiceButton 
                variant="success" 
                onClick={handleRest}
                disabled={processing}
              >
                {processing ? 'Resting...' : 'Rest and Recover'}
              </ChoiceButton>
            )}

            {event.type === 'event' && event.choices?.map((choice) => (
              <ChoiceButton
                key={choice.id}
                variant={choice.id === 'challenge' || choice.id === 'engage' ? 'danger' : 'primary'}
                onClick={() => handleChoice(choice.id)}
                disabled={processing}
              >
                {processing ? 'Processing...' : choice.text}
              </ChoiceButton>
            ))}

            <ChoiceButton 
              variant="primary" 
              onClick={onClose}
              disabled={processing}
            >
              Leave Area
            </ChoiceButton>
          </ChoiceContainer>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
}

export default EventModal;