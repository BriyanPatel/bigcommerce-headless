'use client';

import { useTranslations } from 'next-intl';
import { useFormStatus } from 'react-dom';

import { Button } from '~/components/ui/button';

export const AddToCart = ({ disabled = false }: { disabled?: boolean }) => {
  const { pending } = useFormStatus();
  const t = useTranslations('Product.ProductSheet');

  return (
    <Button
      className="card-figcaption-button add-to-cart-btn"
      disabled={disabled}
      loading={pending}
      loadingText={t('processing')}
      type="submit"
    >
      {t('addToCart')}
    </Button>
  );
};
