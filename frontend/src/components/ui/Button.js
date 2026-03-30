import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

const Button = React.forwardRef(({ 
  className, 
  variant = 'default', 
  size = 'default', 
  loading = false,
  children, 
  disabled,
  ...props 
}, ref) => {
  const variants = {
    default: 'bg-white text-black hover:bg-zinc-200 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]',
    destructive: 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border border-rose-500/20',
    outline: 'border border-white/[0.1] bg-transparent text-white hover:bg-white/[0.05]',
    secondary: 'bg-white/[0.05] text-white hover:bg-white/[0.1]',
    ghost: 'hover:bg-white/[0.05] text-zinc-400 hover:text-white',
    link: 'text-primary underline-offset-4 hover:underline',
  };

  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8',
    icon: 'h-10 w-10',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export { Button };
