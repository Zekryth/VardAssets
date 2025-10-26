import React, { useState } from 'react';
import { X, MapPin } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import PointPanelBody from './PointPanelBody';

const PointPanel = ({ point, isOpen, onClose, onUpdate, onDelete, variant = 'floating' }) => {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('info');

  if (!isOpen || !point) return null;

  return (
    <div className={`${variant === 'docked' 
      ? 'w-full h-full bg-white dark:bg-surface shadow-inner flex flex-col transition-colors duration-300' 
      : 'fixed inset-y-0 right-0 w-96 bg-white dark:bg-surface shadow-2xl transform transition-transform duration-300 z-50 flex flex-col transition-colors'}`}>
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-primary-50 dark:bg-surface-raised/60 backdrop-blur sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <MapPin className="text-primary-600 dark:text-primary-400" size={24} />
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{point.nombre}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Punto del mapa</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <PointPanelBody point={point} activeTab={activeTab} onChangeTab={setActiveTab} />
    </div>
  );
};

export default PointPanel;