import { useState, useEffect, useCallback } from 'react';

const INITIAL_DATA = Array(9).fill(null).map(() => Array(9).fill(''));
const STORAGE_KEY = 'mandalart_data';

export function useMandalart() {
  const [data, setData] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error("Failed to load Mandalart data from local storage", e);
    }
    return INITIAL_DATA;
  });

  const [saveMessage, setSaveMessage] = useState('');

  // Whenever data changes, save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setSaveMessage('✓ 자동 저장됨');
      
      const timer = setTimeout(() => {
        setSaveMessage('');
      }, 2000);
      
      return () => clearTimeout(timer);
    } catch (e) {
      console.error("Failed to save Mandalart data to local storage", e);
      setSaveMessage('저장 실패');
    }
  }, [data]);

  // Update a specific cell
  const updateCell = useCallback((sectionIndex, cellIndex, value) => {
    setData((prev) => {
      const newData = prev.map((section, sIdx) => 
        sIdx === sectionIndex 
          ? [...section.slice(0, cellIndex), value, ...section.slice(cellIndex + 1)]
          : [...section]
      );

      // Handle synchronization between center section and outer sections
      if (sectionIndex === 4) {
        // If editing a sub-goal in the center section, update the corresponding outer section's center cell
        if (cellIndex !== 4) {
          const targetSectionIndex = cellIndex; // 0-8 maps directly to the 9 sections
          newData[targetSectionIndex] = [...newData[targetSectionIndex]];
          newData[targetSectionIndex][4] = value;
        }
      } else {
        // If editing the center cell of an outer section, update the corresponding cell in the center section
        if (cellIndex === 4) {
          newData[4] = [...newData[4]];
          newData[4][sectionIndex] = value;
        }
      }

      return newData;
    });
  }, []);

  // Calculate progress
  // Progress can be defined as how many action items (non-center cells of non-center sections) are filled.
  // There are 8 outer sections * 8 action cells = 64 action cells total.
  const calculateProgress = () => {
    let filledActions = 0;
    const totalActions = 64;

    data.forEach((section, sIdx) => {
      if (sIdx !== 4) { // Outer section
        section.forEach((cell, cIdx) => {
          if (cIdx !== 4 && cell.trim() !== '') {
            filledActions++;
          }
        });
      }
    });

    return {
      filledActions,
      totalActions,
      percentage: Math.round((filledActions / totalActions) * 100) || 0
    };
  };

  const progress = calculateProgress();

  const resetData = useCallback(() => {
    if (window.confirm('정말 모든 데이터를 초기화하시겠습니까?')) {
      setData(INITIAL_DATA);
    }
  }, []);

  return {
    data,
    updateCell,
    progress,
    resetData,
    saveMessage
  };
}
