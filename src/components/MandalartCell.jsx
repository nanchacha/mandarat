import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle } from 'lucide-react';

export function MandalartCell({ value, onChange, onToggleComplete, isCenterSection, isCenterCell, onClick, isFocused, readOnly }) {
  const { text, completed } = value || { text: '', completed: false };
  const textareaRef = useRef(null);

  // Auto-resize font to prevent scrolling
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    // 모바일 등 환경에 따라 기준 폰트 크기가 다를 수 있으므로 CSS 클래스(rem/px)를 무시하고 
    // 적절한 시작 픽셀 크기를 지정하거나 100% 기준으로 줄입니다.
    // 여기서는 기본 글꼴 크기를 16px(코어) / 14px(일반)로 시작해서 줄입니다.
    const isMobile = window.innerWidth <= 768;
    let maxFontSize = isCenterSection && isCenterCell ? (isMobile ? 13 : 16) : (isMobile ? 11 : 14);
    let minFontSize = 8;
    
    // 폰트 크기 초기화 후 측정
    el.style.fontSize = `${maxFontSize}px`;
    el.style.height = 'auto'; // 높이 초기화
    
    let currentSize = maxFontSize;
    const parentHeight = el.parentElement.clientHeight;
    // 부모 높이가 0일 경우(렌더링 전) 대비
    if (parentHeight > 0) {
      // 텍스트 내용의 실제 높이가 부모(칸)의 높이보다 크면 폰트 축소
      while (el.scrollHeight > parentHeight - 8 && currentSize > minFontSize) {
        currentSize -= 0.5;
        el.style.fontSize = `${currentSize}px`;
        el.style.height = 'auto'; // 폰트 축소 후 높이 재측정
      }
      
      // 스크롤 높이만큼 textarea 실제 높이를 고정해야 부모(flex)에서 완벽히 수직 중앙 정렬됨
      el.style.height = `${el.scrollHeight}px`;
    }
  }, [text, isCenterSection, isCenterCell]);

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
      whileHover={readOnly ? {} : { scale: 1.02, zIndex: 10 }}
      whileTap={readOnly ? {} : { scale: 0.98 }}
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
        ref={textareaRef}
        value={text}
        rows={1}
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
