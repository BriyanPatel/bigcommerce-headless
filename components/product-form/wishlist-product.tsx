'use client';

import { useTranslations } from 'next-intl';
import { Heart } from 'lucide-react';
import { Button } from '~/components/ui/button';

export const AddToCartExample = ({ productId, wishlistId, customerId }) => {

  const t = useTranslations('Product.Form');

  return (
    <Button className="secondary-btn" type="submit">
      <Heart aria-hidden="true" className="mx-2" />
      <span>{t('saveToWishlist')}</span>
    </Button>
  );
};

