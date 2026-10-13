import React from 'react';
import './CapabilitySlider.css';

interface CapabilitySliderProps {
  capabilityName: string;
  value: number;
  onChange: (value: number) => void;
  maxLevel?: number;
}

export const CapabilitySlider: React.FC<CapabilitySliderProps> = ({
  capabilityName,
  value,
  onChange,
  maxLevel = 4
}) => {
  const levels = Array.from({ length: maxLevel + 1 }, (_, i) => i);

  return (
    <div className="capability-slider">
      <div className="slider-header">
        <span className="slider-label">{capabilityName}</span>
        <span className="slider-value">{value}/{maxLevel}</span>
      </div>

      <div className="slider-track">
        {levels.map((level) => (
          <button
            key={level}
            className={`slider-dot ${value >= level ? 'active' : ''}`}
            onClick={() => onChange(level)}
            type="button"
          >
            <span className="dot-inner" />
          </button>
        ))}
      </div>

      <div className="slider-labels">
        <span className="label-min">None</span>
        <span className="label-max">Expert</span>
      </div>
    </div>
  );
};

export default CapabilitySlider;