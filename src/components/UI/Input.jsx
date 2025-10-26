/**
 * Input.jsx
 *
 * Componente de input reutilizable con estilos consistentes y soporte para validación.
 * Permite forwardRef y personalización de clases.
 */
import React, { forwardRef } from 'react'

const cx = (...p) => p.filter(Boolean).join(' ')

export const Input = forwardRef(function Input({ className='', invalid=false, ...rest }, ref) {
  return (
    <input
      ref={ref}
      className={cx(
        'w-full rounded-md border bg-white dark:bg-gray-800 text-sm px-3 py-2 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-colors',
        invalid && 'border-danger-500 focus:ring-danger-400 focus:border-danger-400',
        !invalid && 'border-gray-300 dark:border-gray-600',
        className
      )}
      {...rest}
    />
  )
})

export default Input
