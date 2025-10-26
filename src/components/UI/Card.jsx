import React from 'react'

const cx = (...p) => p.filter(Boolean).join(' ')

export const Card = ({ className='', children, padded=true, ...rest }) => (
  <div
    className={cx('rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-raised shadow-sm transition-colors', padded && 'p-4', className)}
    {...rest}
  >
    {children}
  </div>
)

export default Card
