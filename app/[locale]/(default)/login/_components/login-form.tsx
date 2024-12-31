'use client';

import { useTranslations } from 'next-intl';
import { ChangeEvent, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';

import { Link } from '~/components/link';
import { Button } from '~/components/ui/button';
import {
  Field,
  FieldControl,
  FieldLabel,
  FieldMessage,
  Form,
  FormSubmit,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Message } from '~/components/ui/message';

import { submitLoginForm } from '../_actions/submit-login-form';

const SubmitButton = () => {
  const { pending } = useFormStatus();
  const t = useTranslations('Account.Login');

  return (
    <Button
      className="relative md:w-auto button"
      loading={pending}
      loadingText={t('Form.submitting')}
      variant="primary"
    >
      {t('Form.logIn')}
    </Button>
  );
};

export const LoginForm = () => {
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [state, formAction] = useFormState(submitLoginForm, { status: 'idle' });

  const t = useTranslations('Account.Login');

  const isFormInvalid = state?.status === 'error';

  const handleInputValidation = (e: ChangeEvent<HTMLInputElement>) => {
    const validationStatus = e.target.validity.valueMissing;

    switch (e.target.name) {
      case 'email': {
        setIsEmailValid(!validationStatus);

        return;
      }

      case 'password': {
        setIsPasswordValid(!validationStatus);
      }
    }
  };

  return (
    <>
      {isFormInvalid && (
        <Message
          aria-labelledby="error-message"
          aria-live="polite"
          className="mb-8 lg:col-span-2"
          role="region"
          variant="error"
        >
          <p id="error-message">{t('Form.errorMessage')}</p>
        </Message>
      )}
      <Form action={formAction} className="login-form">
        <Field className="form-field form-field--input form-field--inputEmail" name="email">
          <FieldLabel className='form-label' htmlFor="email">{t('Form.emailLabel')}</FieldLabel>
          <FieldControl asChild>
            <Input
              autoComplete="email"
              id="email"
              onChange={handleInputValidation}
              onInvalid={handleInputValidation}
              required
              type="email"
              className='form-input'
              variant={!isEmailValid ? 'error' : undefined}
            />
          </FieldControl>
          <FieldMessage
            className="form-inlineMessage"
            match="valueMissing"
          >
            {t('Form.enterEmailMessage')}
          </FieldMessage>
        </Field>
        <Field className="form-field form-field--input form-field--inputPassword" name="password">
          <FieldLabel className='form-label' htmlFor="password">{t('Form.passwordLabel')}</FieldLabel>
          <FieldControl asChild>
            <Input
              id="password"
              onChange={handleInputValidation}
              onInvalid={handleInputValidation}
              required
              type="password"
              className='form-input'
              variant={!isPasswordValid ? 'error' : undefined}
            />
          </FieldControl>
          <FieldMessage
            className="form-inlineMessage"
            match="valueMissing"
          >
            {t('Form.entePasswordMessage')}
          </FieldMessage>
        </Field>
        <div className="flex flex-col items-start md:flex-row md:items-center md:justify-start form-actions">
          <FormSubmit asChild>
            <SubmitButton />
          </FormSubmit>
          <Link
            className="forgot-password"
            href={{
              pathname: '/login',
              query: { action: 'reset_password' },
            }}
          >
            {t('Form.resetPassword')}
          </Link>
        </div>
      </Form>
    </>
  );
};
