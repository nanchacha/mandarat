import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MandalartGrid } from './MandalartGrid';
import { X } from 'lucide-react';
import { ohtaniSample } from '../data/sampleMandalart';
import './SampleModal.css';

export function SampleModal({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div 
            className="modal-content glass-panel"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>오타니 쇼헤이의 만다라트 (샘플)</h2>
              <button className="close-button" onClick={onClose}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <MandalartGrid data={ohtaniSample} readOnly={true} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
