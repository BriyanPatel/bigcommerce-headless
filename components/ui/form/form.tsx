import * as FormPrimitive from '@radix-ui/react-form';
import { ComponentPropsWithRef, ElementRef, forwardRef } from 'react';

import { cn } from '~/lib/utils';

import { Label } from '../label';

type ValidationPattern =
  | 'badInput'
  | 'patternMismatch'
  | 'rangeOverflow'
  | 'rangeUnderflow'
  | 'stepMismatch'
  | 'tooLong'
  | 'tooShort'
  | 'typeMismatch'
  | 'valid'
  | 'valueMissing';

type ValidationFunction =
  | ((value: string, formData: FormData) => boolean)
  | ((value: string, formData: FormData) => Promise<boolean>);
type ControlValidationPatterns = ValidationPattern | ValidationFunction;
type BuiltInValidityState = {
  [pattern in ValidationPattern]: boolean;
};

const Form = forwardRef<
  ElementRef<typeof FormPrimitive.Root>,
  ComponentPropsWithRef<typeof FormPrimitive.Root>
>(({ className, ...props }, ref) => (
  <FormPrimitive.Root className={cn('text-base', className)} ref={ref} {...props} />
));

Form.displayName = FormPrimitive.Form.displayName;

const Field = forwardRef<
  ElementRef<typeof FormPrimitive.Field>,
  ComponentPropsWithRef<typeof FormPrimitive.Field>
>(({ className, children, ...props }, ref) => (
  <FormPrimitive.Field className={cn(className)} ref={ref} {...props}>
    {children}
  </FormPrimitive.Field>
));

Field.displayName = 'Field';

const FieldMessage = forwardRef<
  ElementRef<typeof FormPrimitive.Message>,
  ComponentPropsWithRef<typeof FormPrimitive.Message>
>(({ className, children, ...props }, ref) => (
  <FormPrimitive.Message className={cn(className)} ref={ref} {...props}>
    {children}
  </FormPrimitive.Message>
));

FieldMessage.displayName = 'FieldMessage';

interface FieldLabelProps extends ComponentPropsWithRef<typeof Label> {
  isRequired?: boolean;
}

const FieldLabel = forwardRef<ElementRef<typeof Label>, FieldLabelProps>(
  ({ className, children, isRequired, ...props }, ref) => (
    <Label
      className={cn(className="form-label")}
      ref={ref}
      {...props}
    >
      <span>{children}</span>
      {isRequired && <span className="req">*</span>}
    </Label>
  ),
);

FieldLabel.displayName = 'FieldLabel';

const FieldControl = forwardRef<
  ElementRef<typeof FormPrimitive.Control>,
  ComponentPropsWithRef<typeof FormPrimitive.Control>
>(({ className, children, ...props }, ref) => (
  <FormPrimitive.Control className={cn(className)} ref={ref} {...props}>
    {children}
  </FormPrimitive.Control>
));

FieldControl.displayName = 'FieldControl';

const FormSubmit = forwardRef<
  ElementRef<typeof FormPrimitive.Submit>,
  ComponentPropsWithRef<typeof FormPrimitive.Submit>
>(({ className, children, ...props }, ref) => (
  <FormPrimitive.Submit className={cn(className)} ref={ref} {...props}>
    {children}
  </FormPrimitive.Submit>
));

FormSubmit.displayName = 'FormSubmit';

const FieldValidation = FormPrimitive.ValidityState;

FieldValidation.displayName = 'FieldValidation';

export { Form, Field, FieldMessage, FieldLabel, FieldControl, FormSubmit, FieldValidation };
export type {
  ValidationPattern,
  ValidationFunction,
  ControlValidationPatterns,
  BuiltInValidityState,
};