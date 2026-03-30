import React from 'react';
import { cn } from '../../lib/utils';

const Badge = React.forwardRef(({ className, variant = 'default', ...props }, ref) => {
  const variants = {
    default: 'border-transparent bg-white/[0.05] text-white',
    secondary: 'border-transparent bg-blue-500/10 text-blue-400',
    destructive: 'border-transparent bg-rose-500/10 text-rose-500',
    outline: 'text-zinc-400 border-white/[0.1]',
    success: 'border-transparent bg-emerald-500/10 text-emerald-400',
    warning: 'border-transparent bg-amber-500/10 text-amber-400',
  };

  return (
    <div
      ref={ref}
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        variants[variant],
        className
      )}
      {...props}
    />
  );
});
Badge.displayName = 'Badge';

export { Badge };
