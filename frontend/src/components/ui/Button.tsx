import { forwardRef, ReactNode, ButtonHTMLAttributes } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  loading?: boolean
  icon?: ReactNode
  iconRight?: ReactNode
  fullWidth?: boolean
}

const variants = {
  primary:
    'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-button hover:shadow-glow hover:from-indigo-400 hover:to-purple-500 border border-indigo-500/30',
  secondary:
    'bg-surface-3 text-slate-200 border border-border hover:bg-surface-2 hover:border-slate-600 shadow-sm',
  ghost: 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent',
  outline:
    'bg-transparent text-slate-200 border border-border hover:border-indigo-500/50 hover:bg-indigo-500/5',
  danger:
    'bg-gradient-to-r from-red-500 to-orange-500 text-white border border-red-500/40 hover:opacity-95 shadow-sm',
  success:
    'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border border-emerald-500/40 hover:opacity-95 shadow-sm',
}

const sizes = {
  sm: 'h-10 px-4 text-sm min-h-[40px]',
  md: 'h-12 px-5 text-sm min-h-[48px]',
  lg: 'h-14 px-7 text-base min-h-[56px]',
  icon: 'h-12 w-12 min-h-[48px] min-w-[48px] p-0',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading,
      icon,
      iconRight,
      children,
      className,
      disabled,
      fullWidth,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading

    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-xl font-semibold',
          'transition-all duration-200 select-none cursor-pointer',
          'hover:scale-[1.02] active:scale-[0.98]',
          'focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/30',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:hover:scale-100',
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={isDisabled}
        {...props}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin shrink-0" />
        ) : (
          icon && <span className="shrink-0">{icon}</span>
        )}
        {children}
        {!loading && iconRight && <span className="shrink-0">{iconRight}</span>}
      </button>
    )
  }
)
Button.displayName = 'Button'
