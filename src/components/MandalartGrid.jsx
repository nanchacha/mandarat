import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MandalartSection } from './MandalartSection';
import './MandalartGrid.css';

export function MandalartGrid({ data, updateCell }) {
  // null means show all 9 sections. Number 0-8 means focus on that specific section.
  const [focusedSection, setFocusedSection] = useState(null);

  const handleSectionClick = (sectionIndex) => {
    // Only allow focusing on mobile or narrow screens, managed mostly by CSS and click handlers.
    // If currently viewing all, zoom into the clicked section
    if (focusedSection === null) {
      // Don't focus if it's the center section, center section is already central
      if (sectionIndex !== 4) {
        setFocusedSection(sectionIndex);
      }
    }
  };

  const handleBackClick = () => {
    setFocusedSection(null);
  };

  return (
    <div className="mandalart-container">
      {focusedSection !== null && (
        <button className="back-button glass-panel" onClick={handleBackClick}>
          ← 전체 보기
        </button>
      )}
      
      <motion.div 
        className={`mandalart-grid ${focusedSection !== null ? 'has-focus' : ''}`}
        layout
      >
        {data.map((sectionData, sectionIndex) => {
          // Determine if this section should be visible
          const isVisible = focusedSection === null || focusedSection === sectionIndex;
          
          if (!isVisible) return null;

          return (
            <motion.div
              key={sectionIndex}
              layoutId={`section-${sectionIndex}`}
              className="section-wrapper"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}
            >
              <MandalartSection
                sectionIndex={sectionIndex}
                sectionData={sectionData}
                updateCell={updateCell}
                onSectionClick={handleSectionClick}
                isFocused={focusedSection === sectionIndex}
              />
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
