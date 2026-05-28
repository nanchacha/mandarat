import React, { useState } from 'react';
import { useMandalart } from './hooks/useMandalart';
import { MandalartGrid } from './components/MandalartGrid';
import { SampleModal } from './components/SampleModal';
import { Target, RefreshCw, BookOpen } from 'lucide-react';
import './App.css';

function App() {
  const { data, updateCell, toggleCellCompletion, progress, resetData, saveMessage } = useMandalart();
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);

  return (
    <div className="app-layout">
      <header className="glass-panel app-header">
        <div className="header-content">
          <div className="logo-container">
            <Target className="logo-icon" size={32} color="var(--primary-color)" />
            <h1>Mandalart Planner</h1>
          </div>
          <div className="header-actions">
            <button className="sample-button" onClick={() => setIsSampleModalOpen(true)} title="오타니 샘플 보기">
              <BookOpen size={18} />
              <span>샘플 보기</span>
            </button>
            <div className="save-message-container">
              <span className={`save-message ${saveMessage ? 'visible' : ''}`}>
                {saveMessage}
              </span>
            </div>
            <div className="progress-container">
              <span className="progress-text">달성률 {progress.percentage}%</span>
              <div className="progress-bar-bg">
                <div 
                  className="progress-bar-fill" 
                  style={{ width: `${progress.percentage}%` }}
                ></div>
              </div>
            </div>
            <button className="reset-button" onClick={resetData} title="초기화">
              <RefreshCw size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        <p className="subtitle">중앙에 핵심 목표를 적고, 주변으로 세부 목표와 실천 계획을 펼쳐보세요.</p>
        <MandalartGrid data={data} updateCell={updateCell} toggleCellCompletion={toggleCellCompletion} />
      </main>
      
      <footer className="app-footer">
        <p>Built with React & Vite. Data is saved locally in your browser.</p>
      </footer>
      
      <SampleModal 
        isOpen={isSampleModalOpen} 
        onClose={() => setIsSampleModalOpen(false)} 
      />
    </div>
  );
}

export default App;
