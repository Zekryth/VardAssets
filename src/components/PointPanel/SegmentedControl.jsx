/**
 * SegmentedControl.jsx
 *
 * iOS-style segmented control for tab navigation.
 * Professional dashboard design with smooth transitions.
 */
import React from 'react'

const cx = (...classes) => classes.filter(Boolean).join(' ')

export default function SegmentedControl({ tabs, activeTab, onChange, size = 'default' }) {
  const sizeClasses = {
    small: 'h-8 text-xs',
    default: 'h-10 text-sm',
    large: 'h-12 text-base'
  }

  return (
    <div className={cx(
      'inline-flex items-center p-1 bg-gray-100 dark:bg-gray-800 rounded-xl',
      'border border-gray-200 dark:border-gray-700',
      'w-full'
    )}>
      {tabs.map((tab, index) => {
        const isActive = activeTab === tab.id
        const Icon = tab.icon
        
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cx(
              'relative flex items-center justify-center gap-1.5 flex-1 px-3 rounded-lg font-medium transition-all duration-200',
              sizeClasses[size],
              isActive
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
            )}
            aria-pressed={isActive}
            title={tab.name}
          >
            {/* Icon */}
            {Icon && (
              <Icon 
                size={size === 'small' ? 14 : 16} 
                className={cx(
                  'flex-shrink-0',
                  isActive ? 'text-blue-600 dark:text-blue-400' : ''
                )} 
              />
            )}
            
            {/* Label - hide on very small screens if icon exists */}
            <span className={cx(
              Icon ? 'hidden sm:inline' : '',
              'truncate'
            )}>
              {tab.name}
            </span>
            
            {/* Badge */}
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className={cx(
                'inline-flex items-center justify-center min-w-[18px] h-[18px] px-1',
                'text-xs font-semibold rounded-full',
                isActive 
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
              )}>
                {tab.badge > 99 ? '99+' : tab.badge}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
