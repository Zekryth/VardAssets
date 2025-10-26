import React, { forwardRef } from 'react'

const cx = (...p) => p.filter(Boolean).join(' ')

const base = 'inline-flex items-center justify-center rounded-md font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-sm'

const variants = {
  solid: 'bg-primary-600 hover:bg-primary-500 text-white focus-visible:ring-primary-400 ring-offset-transparent',
  outline: 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus-visible:ring-primary-400',
  subtle: 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 focus-visible:ring-primary-400',
  ghost: 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:ring-primary-400',
  icon: 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 focus-visible:ring-primary-400'
}

const sizes = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4',
  lg: 'h-12 px-6 text-base',
  icon: 'h-9 w-9 p-0'
}

export const Button = forwardRef(function Button({ variant='solid', size='md', className='', children, as:Comp='button', ...rest }, ref) {
  return (
    <Comp ref={ref} className={cx(base, variants[variant], sizes[size], className)} {...rest}>
      {children}
    </Comp>
  )
})

export default Button
