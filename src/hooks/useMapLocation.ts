import { useCharacter } from "../context/CharacterContext";

export function useMapLocation() {
  const { character } = useCharacter();
  
  const getMapImage = (): string => {
    if (!character) {
      return "https://picsum.photos/800/600?random=1";
    }
    
    // Mock map selection based on character location
    switch (character.location) {
      case "Whispering Woods":
        return "https://picsum.photos/800/600?random=2";
      case "Starting Village": 
        return "https://picsum.photos/800/600?random=3";
      case "Dark Forest":
        return "https://picsum.photos/800/600?random=4";
      case "Ancient Ruins":
        return "https://picsum.photos/800/600?random=5";
      default:
        return "https://picsum.photos/800/600?random=1";
    }
  };
  
  return {
    currentLocation: character?.location || "Unknown",
    mapImage: getMapImage()
  };
}