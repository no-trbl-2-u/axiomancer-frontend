import styled from "@emotion/styled";
import { useState } from "react";
import { useCharacter, getPortraitData } from "../../context/CharacterContext";

interface CharacterCreationModalProps {
  onClose: () => void;
  onSuccess: () => void;
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
  backdrop-filter: blur(5px);
`;

const ModalContainer = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  border: 2px solid #8B4513;
  border-radius: 12px;
  padding: 1rem;
  width: 95%;
  max-width: 500px;
  max-height: 95vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(139, 69, 19, 0.5);
  
  @media (min-width: 768px) {
    padding: 1.5rem;
    width: 90%;
    max-width: 550px;
    max-height: 90vh;
  }
  
  @media (min-width: 1200px) {
    padding: 2rem;
    max-width: 600px;
  }
`;

const ModalHeader = styled.div`
  text-align: center;
  margin-bottom: 1rem;
  
  @media (min-width: 768px) {
    margin-bottom: 1.5rem;
  }
  
  @media (min-width: 1200px) {
    margin-bottom: 2rem;
  }
`;

const ModalTitle = styled.h2`
  color: #8B4513;
  font-size: 1.5rem;
  margin: 0 0 0.5rem 0;
  text-shadow: 0 0 10px rgba(139, 69, 19, 0.8);
  
  @media (min-width: 768px) {
    font-size: 1.8rem;
  }
  
  @media (min-width: 1200px) {
    font-size: 2rem;
  }
`;

const ModalSubtitle = styled.p`
  color: #666;
  margin: 0;
  font-style: italic;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  @media (min-width: 768px) {
    gap: 1.5rem;
  }
  
  @media (min-width: 1200px) {
    gap: 2rem;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #ccc;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.1rem;
`;

const Input = styled.input`
  background: rgba(0, 0, 0, 0.5);
  border: 2px solid #444;
  border-radius: 8px;
  padding: 1rem;
  color: #fff;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #8B4513;
    box-shadow: 0 0 10px rgba(139, 69, 19, 0.3);
  }
  
  &::placeholder {
    color: #666;
  }
`;

const Select = styled.select`
  background: rgba(0, 0, 0, 0.5);
  border: 2px solid #444;
  border-radius: 8px;
  padding: 1rem;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #8B4513;
    box-shadow: 0 0 10px rgba(139, 69, 19, 0.3);
  }
  
  option {
    background: #1a1a1a;
    color: #fff;
    padding: 0.5rem;
  }
`;

const PreviewSection = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-direction: column;
  
  @media (min-width: 768px) {
    flex-direction: row;
    gap: 1.5rem;
  }
  
  @media (min-width: 1200px) {
    gap: 2rem;
  }
`;

const PortraitPreview = styled.div`
  position: relative;
`;

const PortraitImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 8px;
  border: 2px solid #8B4513;
  object-fit: cover;
  filter: ${props => props.className?.includes('locked') ? 'grayscale(1) brightness(0.5)' : 'none'};
  
  @media (min-width: 768px) {
    width: 110px;
    height: 110px;
    border-radius: 10px;
    border: 3px solid #8B4513;
  }
  
  @media (min-width: 1200px) {
    width: 120px;
    height: 120px;
    border-radius: 12px;
  }
`;

const LockedOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  color: #ff4444;
  font-weight: bold;
  font-size: 1.2rem;
  text-shadow: 0 0 5px rgba(255, 68, 68, 0.8);
`;

const StatsPreview = styled.div`
  flex: 1;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.1rem;
  
  ${props => props.variant === 'primary' ? `
    background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
    color: #fff;
    box-shadow: 0 4px 15px rgba(139, 69, 19, 0.3);
    
    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(139, 69, 19, 0.4);
    }
    
    &:disabled {
      background: #444;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }
  ` : `
    background: transparent;
    color: #ccc;
    border: 2px solid #666;
    
    &:hover {
      border-color: #8B4513;
      color: #8B4513;
    }
  `}
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 0.5rem;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

function CharacterCreationModal({ onClose, onSuccess }: CharacterCreationModalProps) {
  const { createCharacter, loading } = useCharacter();
  const [name, setName] = useState("");
  const [selectedPortrait, setSelectedPortrait] = useState("elf");
  
  const portraitData = getPortraitData();
  const portraits = Object.keys(portraitData);
  const currentPortraitData = portraitData[selectedPortrait as keyof typeof portraitData];
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;
    
    if (!currentPortraitData.unlocked) {
      return;
    }
    
    try {
      await createCharacter(name.trim(), selectedPortrait);
      onSuccess();
    } catch (error) {
      console.error('Failed to create character:', error);
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Forge Your Destiny</ModalTitle>
          <ModalSubtitle>Choose wisely, for death awaits the unprepared...</ModalSubtitle>
        </ModalHeader>
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="name">Character Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              maxLength={20}
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="portrait">Choose Your Form</Label>
            <Select
              id="portrait"
              value={selectedPortrait}
              onChange={(e) => setSelectedPortrait(e.target.value)}
            >
              {portraits.map(portrait => {
                const data = portraitData[portrait as keyof typeof portraitData];
                const displayName = portrait.replace(/[-_]/g, ' ');
                return (
                  <option key={portrait} value={portrait}>
                    {displayName} {!data.unlocked ? '(LOCKED)' : ''}
                  </option>
                );
              })}
            </Select>
          </FormGroup>
          
          <PreviewSection>
            <PortraitPreview>
              <PortraitImage 
                src={`/images/portraits/${selectedPortrait}.jpg`}
                alt={selectedPortrait}
                className={!currentPortraitData.unlocked ? 'locked' : ''}
              />
              {!currentPortraitData.unlocked && (
                <LockedOverlay>LOCKED</LockedOverlay>
              )}
            </PortraitPreview>
            
            <StatsPreview>
              <StatsGrid>
                <StatItem>
                  <StatLabel>Body</StatLabel>
                  <StatValue>{currentPortraitData.bonuses.body}</StatValue>
                </StatItem>
                <StatItem>
                  <StatLabel>Mind</StatLabel>
                  <StatValue>{currentPortraitData.bonuses.mind}</StatValue>
                </StatItem>
                <StatItem>
                  <StatLabel>Heart</StatLabel>
                  <StatValue>{currentPortraitData.bonuses.heart}</StatValue>
                </StatItem>
              </StatsGrid>
            </StatsPreview>
          </PreviewSection>
          
          <ButtonGroup>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary"
              disabled={loading || !name.trim() || !currentPortraitData.unlocked}
            >
              {loading && <LoadingSpinner />}
              {loading ? 'Creating...' : 'Create Character'}
            </Button>
          </ButtonGroup>
        </Form>
      </ModalContainer>
    </ModalOverlay>
  );
}

export default CharacterCreationModal;