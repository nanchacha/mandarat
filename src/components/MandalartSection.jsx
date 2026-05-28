import React from 'react';
import { MandalartCell } from './MandalartCell';

export function MandalartSection({ sectionIndex, sectionData, updateCell, toggleCellCompletion, onSectionClick, isFocused, readOnly }) {
  const isCenterSection = sectionIndex === 4;

  return (
    <div 
      className={`mandalart-section ${isCenterSection ? 'center-section' : 'outer-section'} ${isFocused ? 'focused-section' : ''}`}
      onClick={() => onSectionClick(sectionIndex)}
    >
      {sectionData.map((cellValue, cellIndex) => (
        <MandalartCell
          key={cellIndex}
          value={cellValue}
          onChange={(value) => updateCell && updateCell(sectionIndex, cellIndex, value)}
          onToggleComplete={() => toggleCellCompletion && toggleCellCompletion(sectionIndex, cellIndex)}
          isCenterSection={isCenterSection}
          isCenterCell={cellIndex === 4}
          isFocused={isFocused}
          readOnly={readOnly}
        />
      ))}
    </div>
  );
}
