import React from 'react'

// Tiny utility to merge class names without pulling an external dependency
const cx = (...parts) => parts.filter(Boolean).join(' ')

export const Skeleton = ({ className = '', rounded = 'md' }) => {
  const roundedClass =
    rounded === 'full'
      ? 'rounded-full'
      : rounded === 'none'
        ? ''
        : `rounded-${rounded}`
  return (
    <div
      className={cx(
        'animate-pulse bg-gray-200 dark:bg-gray-700',
        roundedClass,
        className
      )}
    />
  )
}

export const SkeletonText = ({ lines = 3, className = '' }) => (
  <div className={cx('space-y-2', className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className="h-3 w-full rounded bg-gray-200 dark:bg-gray-700 animate-pulse"
        style={{ width: i === lines - 1 ? '70%' : undefined }}
      />
    ))}
  </div>
)

export const SkeletonCircle = ({ size = 40, className = '' }) => (
  <div
    className={cx(
      'animate-pulse bg-gray-200 dark:bg-gray-700 rounded-full',
      className
    )}
    style={{ width: size, height: size }}
  />
)

export default Skeleton
