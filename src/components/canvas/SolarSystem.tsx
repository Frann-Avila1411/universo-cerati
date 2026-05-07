"use client";
import { Planet } from "./Planet";
import { universeData } from "@/data/ceratiUniverse";

interface Props {
  selectedPlanet: string | null;
  onSelect: (id: string) => void;
  sceneRevealed: boolean;
  onSatelliteHover?: (songIndex: number) => void;
}

export const SolarSystem = ({ selectedPlanet, onSelect, sceneRevealed, onSatelliteHover }: Props) => {
  return (
    <group>
      {universeData.map((planet) => (
        <Planet 
          key={planet.id} 
          data={planet} 
          onSelect={onSelect} 
          isSelected={selectedPlanet === planet.id} 
          sceneRevealed={sceneRevealed}
          dimmed={!!selectedPlanet && selectedPlanet !== planet.id}
          onSatelliteHover={onSatelliteHover}
        />
      ))}
    </group>
  );
};