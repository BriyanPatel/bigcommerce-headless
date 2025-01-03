'use client';

import { ShoppingCart } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useFormContext } from 'react-hook-form';

import { Button } from '~/components/ui/button';

export const AddToCart = ({ disabled = false }: { disabled?: boolean }) => {
  const { formState } = useFormContext();
  const { isSubmitting } = formState;

  const t = useTranslations('Product.Form');

  return (
    <Button className="primary-btn add-to-cart-btn" disabled={disabled} loading={isSubmitting} loadingText={t('processing')} type="submit">
      <ShoppingCart aria-hidden="true" className="mx-2" />
      <span>Add To Cart</span>
    </Button>
  );
};
