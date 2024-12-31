import { Slot } from '@radix-ui/react-slot';
import { ComponentPropsWithRef, ElementRef, forwardRef } from 'react';

import { cn } from '~/lib/utils';

const Breadcrumbs = forwardRef<ElementRef<'nav'>, ComponentPropsWithRef<'ul'>>(
  ({ children, className, ...props }, ref) => {
    return (
      <div className="container">
          <nav aria-label="Breadcrumb" ref={ref}>
          <ul className={cn('flex flex-wrap items-center', className)} {...props}>
            {children}
          </ul>
      </nav>
      </div>
    );
  },
);

Breadcrumbs.displayName = 'Breadcrumbs';

interface BreadcrumbItemProps extends ComponentPropsWithRef<'a'> {
  asChild?: boolean;
  isActive?: boolean;
}

const BreadcrumbItem = forwardRef<ElementRef<'li'>, BreadcrumbItemProps>(
  ({ asChild, children, className, isActive, ...props }, ref) => {
    const Comp = asChild ? Slot : 'a';

    return (
      <li className={cn('breadcrumb')} ref={ref}>
        <Comp
          aria-current={isActive ? `page` : undefined}
          className={cn(
            'breadcrumb-link',
            isActive,
            className,
          )}
          {...props}
        >
          {children}
        </Comp>
      </li>
    );
  },
);

BreadcrumbItem.displayName = 'BreadcrumbItem';

const BreadcrumbDivider = forwardRef<ElementRef<'span'>, ComponentPropsWithRef<'span'>>(
  ({ children, className, ...props }, ref) => {
    return (
      <span className={cn('arrw-icon', className)} ref={ref} {...props}>
        {children}
      </span>
    );
  },
);

BreadcrumbDivider.displayName = 'BreadcrumbDivider';

export { Breadcrumbs, BreadcrumbItem, BreadcrumbDivider };
