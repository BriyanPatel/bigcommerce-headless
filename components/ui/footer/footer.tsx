import { ComponentPropsWithRef, ElementRef, forwardRef } from 'react';

import { cn } from '~/lib/utils';

const Footer = forwardRef<ElementRef<'footer'>, ComponentPropsWithRef<'footer'>>(
  ({ children, className, ...props }, ref) => (
    <footer className="footer" ref={ref} {...props}>
      <div className="container">
      {children}

      </div>
    </footer>
  ),
);

Footer.displayName = 'Footer';

const FooterSection = forwardRef<ElementRef<'section'>, ComponentPropsWithRef<'div'>>(
  ({ children, className, ...props }, ref) => (
    <section className={cn('ftr', )} {...props} ref={ref} >
      {children}
    </section>
  ),
);

FooterSection.displayName = 'FooterSection';

export { Footer, FooterSection };
