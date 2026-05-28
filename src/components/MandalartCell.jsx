import React from 'react';
import { motion } from 'framer-motion';

export function MandalartCell({ value, onChange, isCenterSection, isCenterCell, onClick, isFocused }) {
  // Determine styles based on cell position and state
  let cellClass = "mandalart-cell ";
  
  if (isCenterSection && isCenterCell) {
    cellClass += "core-goal ";
  } else if (isCenterCell || (isCenterSection && !isCenterCell)) {
    cellClass += "sub-goal ";
  } else {
    cellClass += "action-item ";
  }

  if (isFocused) {
    cellClass += "focused ";
  }

  // Use a textarea for multiline support, but make it look like a seamless cell
  return (
    <motion.div 
      className={cellClass}
      whileHover={{ scale: 1.02, zIndex: 10 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      layout
    >
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={
          isCenterSection && isCenterCell ? "핵심 목표" 
          : isCenterCell || (isCenterSection && !isCenterCell) ? "세부 목표" 
          : "실천 계획"
        }
        className="cell-input"
        spellCheck="false"
      />
    </motion.div>
  );
}
