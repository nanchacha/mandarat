import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle } from 'lucide-react';

export function MandalartCell({ value, onChange, onToggleComplete, isCenterSection, isCenterCell, onClick, isFocused, readOnly }) {
  const { text, completed } = value || { text: '', completed: false };

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
  
  if (readOnly) {
    cellClass += "read-only ";
  }

  if (completed) {
    cellClass += "completed ";
  }

  const isActionItem = !isCenterSection && !isCenterCell;

  // Use a textarea for multiline support, but make it look like a seamless cell
  return (
    <motion.div 
      className={cellClass}
      whileHover={{ scale: 1.02, zIndex: 10 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      layout
    >
      {isActionItem && text.trim() !== '' && isFocused && (
        <button 
          className={`check-button ${completed ? 'checked' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            !readOnly && onToggleComplete && onToggleComplete();
          }}
          title={completed ? "달성 취소" : "목표 달성"}
        >
          {completed ? <CheckCircle size={16} /> : <Circle size={16} />}
        </button>
      )}
      <textarea
        value={text}
        onChange={(e) => !readOnly && onChange(e.target.value)}
        placeholder={
          isCenterSection && isCenterCell ? "핵심 목표" 
          : isCenterCell || (isCenterSection && !isCenterCell) ? "세부 목표" 
          : "실천 계획"
        }
        className="cell-input"
        spellCheck="false"
        readOnly={readOnly}
      />
    </motion.div>
  );
}
