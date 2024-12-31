import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { Loader2 as Spinner } from 'lucide-react';
import { ComponentPropsWithRef, ElementRef, forwardRef } from 'react';

import { cn } from '~/lib/utils';

export const buttonVariants = cva(
  'card-button relative flex justify-center items-center border-2 py-2.5 px-[30px] text-base leading-6 font-semibold border-primary disabled:border-gray-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20',
  {
    variants: {
      variant: {
        primary:
          'primary-btn',
        secondary:
          'secondary-btn',
        subtle:
          'border-none bg-transparent text-primary hover:bg-secondary hover:bg-opacity-10 hover:text-secondary disabled:text-gray-400 disabled:hover:bg-transparent disabled:hover:text-gray-400',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
);

export interface ButtonProps extends ComponentPropsWithRef<'button'> {
  variant?: 'primary' | 'secondary' | 'subtle';
  asChild?: boolean;
  loading?: boolean;
  loadingText?: string;
}

export const Button = forwardRef<ElementRef<'button'>, ButtonProps>(
  (
    { asChild = false, children, className, variant, loading, loadingText, disabled, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        className={cn(buttonVariants({ variant, className }))}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {loading ? (
          <>
            <span className="absolute top-0 left-0 z-[1] flex items-center justify-center w-full h-full spinner">
              <Spinner aria-hidden="true" className="animate-spin" />
              <span className="sr-only">{loadingText}</span>
            </span>
            <span className={cn('invisible flex items-center')}>{children}</span>
          </>
        ) : (
          children
        )}
      </Comp>
    );
  },
);

Button.displayName = 'Button';
