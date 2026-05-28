import { useState, useEffect, useCallback } from 'react';

const INITIAL_DATA = Array(9).fill(null).map(() => 
  Array(9).fill(null).map(() => ({ text: '', completed: false }))
);
const STORAGE_KEY = 'mandalart_data';

export function useMandalart() {
  const [data, setData] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Migration from old string arrays to object arrays
        return parsed.map(section => section.map(cell => {
          if (typeof cell === 'string') return { text: cell, completed: false };
          return cell || { text: '', completed: false };
        }));
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

  // Update a specific cell's text
  const updateCell = useCallback((sectionIndex, cellIndex, newText) => {
    setData((prev) => {
      const newData = prev.map(section => [...section]);
      
      newData[sectionIndex][cellIndex] = { 
        ...newData[sectionIndex][cellIndex], 
        text: newText 
      };

      // Handle synchronization between center section and outer sections
      if (sectionIndex === 4) {
        // If editing a sub-goal in the center section, update the corresponding outer section's center cell
        if (cellIndex !== 4) {
          const targetSectionIndex = cellIndex; // 0-8 maps directly to the 9 sections
          newData[targetSectionIndex] = [...newData[targetSectionIndex]];
          newData[targetSectionIndex][4] = { 
            ...newData[targetSectionIndex][4], 
            text: newText 
          };
        }
      } else {
        // If editing the center cell of an outer section, update the corresponding cell in the center section
        if (cellIndex === 4) {
          newData[4] = [...newData[4]];
          newData[4][sectionIndex] = { 
            ...newData[4][sectionIndex], 
            text: newText 
          };
        }
      }

      return newData;
    });
  }, []);

  // Toggle completion status of an action cell
  const toggleCellCompletion = useCallback((sectionIndex, cellIndex) => {
    setData((prev) => {
      const newData = prev.map(section => [...section]);
      newData[sectionIndex][cellIndex] = { 
        ...newData[sectionIndex][cellIndex], 
        completed: !newData[sectionIndex][cellIndex].completed 
      };
      return newData;
    });
  }, []);

  // Calculate progress based on 'completed' status, not just text presence
  const calculateProgress = () => {
    let filledActions = 0;
    const totalActions = 64;

    data.forEach((section, sIdx) => {
      if (sIdx !== 4) { // Outer section
        section.forEach((cell, cIdx) => {
          if (cIdx !== 4 && cell.completed) {
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
    toggleCellCompletion,
    progress,
    resetData,
    saveMessage
  };
}
