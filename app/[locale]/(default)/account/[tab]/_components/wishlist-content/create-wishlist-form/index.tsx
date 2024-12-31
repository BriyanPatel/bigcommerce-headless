import { useTranslations } from 'next-intl';
import { ChangeEvent, useState } from 'react';
import { useFormStatus } from 'react-dom';

import { Button } from '~/components/ui/button';
import { DialogCancel } from '~/components/ui/dialog';
import {
  Field,
  FieldControl,
  FieldLabel,
  FieldMessage,
  Form,
  FormSubmit,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';

import { Wishlists } from '..';
import { useAccountStatusContext } from '../../account-status-provider';

interface WishlistProduct {
  images: {
    isDefault: boolean;
    url: string;
    altText: string;
  }[];
  prices: {
    priceRange: {
      max: { currencyCode: string; value: number };
      min: { currencyCode: string; value: number };
    };
    salePrice: { currencyCode: string; value: number } | null;
    retailPrice: { currencyCode: string; value: number } | null;
    basePrice: { currencyCode: string; value: number } | null;
    price: { currencyCode: string; value: number };
  } | null;
  defaultImage: {
    url: string;
    altText: string;
  };
  brand: {
    path: string;
    name: string;
  };
  path: string;
  name: string;
  entityId: number;
}

interface WishlistItem {
  entityId: number;  // Changed to number
  product: WishlistProduct;
}

interface CreateWishlistItemResult {
  entityId: string;
  items: {
    entityId: string;
    product: Partial<WishlistProduct> & {
      brand?: string | { path: string; name: string };
    };
  }[];
  name: string;
}

interface Props {
  onWishlistCreated: (newWishlist: Wishlists[number]) => void;
}

async function createWishlist(formData: FormData): Promise<{
  status: 'success' | 'error';
  data?: CreateWishlistItemResult;
  message?: string;
}> {
  try {
    const name = formData.get('name') as string;
    
    const response = await fetch('/api/wishlists', {
      method: 'POST',
      body: JSON.stringify({ name }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to create wishlist');
    }

    const data = await response.json();
    return {
      status: 'success',
      data: {
        entityId: data.entityId,
        items: data.items || [],
        name: data.name
      }
    };
  } catch (error) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'An error occurred',
    };
  }
}

const SubmitButton = () => {
  const { pending } = useFormStatus();
  const t = useTranslations('Account.Wishlist');

  return (
    <FormSubmit asChild>
      <Button
        className="relative w-fit items-center px-8 py-2"
        loading={pending}
        loadingText={t('onSubmitText')}
        variant="primary"
      >
        {t('submitFormText')}
      </Button>
    </FormSubmit>
  );
};

export const CreateWishlistForm = ({ onWishlistCreated }: Props) => {
  const [isInputValid, setInputValidation] = useState(true);
  const { setAccountState } = useAccountStatusContext();
  const t = useTranslations('Account.Wishlist');

  const handleInputValidation = (e: ChangeEvent<HTMLInputElement>) => {
    const validationStatus = e.target.validity.valueMissing;
    setInputValidation(!validationStatus);
  };

  const onSubmit = async (formData: FormData) => {
    const submit = await createWishlist(formData);
   
    if (submit.status === 'success' && submit.data) {
      const wishlistData: Wishlists[number] = {
        entityId: parseInt(submit.data.entityId, 10),
        items: submit.data.items.map(item => {
          const defaultImage = item.product.images?.find(img => img.isDefault) || 
            item.product.images?.[0] || 
            { url: '', altText: '' };

          // Handle the brand property transformation
          const brand = typeof item.product.brand === 'string' 
            ? { path: '', name: item.product.brand }
            : item.product.brand || { path: '', name: '' };

          return {
            entityId: parseInt(item.entityId, 10),  // Convert string to number
            product: {
              ...item.product,
              images: item.product.images || [],
              prices: item.product.prices || null,
              defaultImage: {
                url: defaultImage.url,
                altText: defaultImage.altText
              },
              brand: {
                path: brand.path,
                name: brand.name
              },
              path: item.product.path || '',
              name: item.product.name || '',
              entityId: typeof item.product.entityId === 'number' 
                ? item.product.entityId 
                : parseInt(item.entityId, 10)
            } as WishlistProduct
          };
        }),
        name: submit.data.name
      };
      
      onWishlistCreated(wishlistData);
      setAccountState({
        status: submit.status,
        message: t('messages.created', { name: submit.data.name }),
      });
    }

    if (submit.status === 'error') {
      setAccountState({ status: submit.status, message: submit.message });
    }
  };

  return (
    <Form action={onSubmit} className="w-full">
      <Field className="relative space-y-2 pb-7" name="name">
        <FieldLabel>{t('inputLabel')}</FieldLabel>
        <FieldControl asChild>
          <Input
            id="wishlist"
            onChange={handleInputValidation}
            onInvalid={handleInputValidation}
            required
            type="text"
            variant={!isInputValid ? 'error' : undefined}
          />
        </FieldControl>
        <FieldMessage
          className="absolute inset-x-0 bottom-0 inline-flex w-full text-xs font-normal text-error"
          match="valueMissing"
        >
          {t('emptyName')}
        </FieldMessage>
      </Field>
      <div className="mt-3 flex">
        <SubmitButton />
        <DialogCancel asChild>
          <Button className="ms-2 w-full lg:w-fit" variant="subtle">
            {t('cancel')}
          </Button>
        </DialogCancel>
      </div>
    </Form>
  );
};