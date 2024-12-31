import * as LabelPrimitive from '@radix-ui/react-label';
import { ComponentPropsWithRef, ElementRef, forwardRef } from 'react';

import { cn } from '~/lib/utils';

export const Label = forwardRef<
  ElementRef<typeof LabelPrimitive.Root>,
  ComponentPropsWithRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root className={cn(className)} ref={ref} {...props} />
));

Label.displayName = LabelPrimitive.Label.displayName;
