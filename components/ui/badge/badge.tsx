import { ComponentPropsWithRef, ElementRef, forwardRef } from 'react';

import { cn } from '~/lib/utils';

export const Badge = forwardRef<ElementRef<'span'>, ComponentPropsWithRef<'span'>>(
  ({ children, className, ...props }, ref) => {
    return (
      <span
        className={cn(
          'cart_count absolute end-0 top-0 min-w-[24px] rounded-[28px] border-2 border-white bg-primary px-1 py-px text-center text-xs font-bold font-normal leading-normal text-white',
          className,
        )}
        ref={ref}
        {...props}
      >
        {children}
      </span>
    );
  },
);

Badge.displayName = 'Badge';
