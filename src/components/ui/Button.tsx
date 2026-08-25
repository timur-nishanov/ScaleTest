import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  children: ReactNode
}

/**
 * Кнопка-каркас. Все кликабельные элементы получают класс `pressable`
 * (скейл 0.94 при нажатии — стейты «Нажатие тач» в Figma).
 * Визуал будет заменён на этапе вёрстки, API останется.
 */
export function Button({ variant = 'primary', className = '', children, ...rest }: Props) {
  return (
    <button className={`btn btn--${variant} pressable ${className}`} {...rest}>
      {children}
    </button>
  )
}
