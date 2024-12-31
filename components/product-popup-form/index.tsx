'use client';

import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import { AlertCircle, Check, Heart } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FormProvider } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useState } from 'react';

import { FragmentOf, graphql } from '~/client/graphql';


import { Link } from '~/components/link';


import { handleAddToCart } from './_actions/add-to-cart';
import { AddToCart } from './add-to-cart';
import { CheckboxField } from './fields/checkbox-field';
import { DateField } from './fields/date-field';
import { MultiLineTextField } from './fields/multi-line-text-field';
import { MultipleChoiceField } from './fields/multiple-choice-field';
import { NumberField } from './fields/number-field';
import { QuantityField } from './fields/quantity-field';
import { TextField } from './fields/text-field';
import { ProductFormFragment } from './fragment';
import { ProductFormData, useProductForm } from './use-product-form';
interface Props {
  product: FragmentOf<typeof ProductFormFragment>;
}

export const ProductPopUpForm = ({ product }: Props) => {
  const t = useTranslations('Product.Form');
  const productOptions = removeEdgesAndNodes(product.productOptions);

  const { handleSubmit, register, ...methods } = useProductForm();
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);

  const productFormSubmit = async (data: ProductFormData) => {
    const result = await handleAddToCart(data, product);
    const quantity = Number(data.quantity);

    if (result.error) {
      toast.error(result.error || t('errorMessage'), {
        icon: <AlertCircle className="text-error-secondary" />,
      });
      return;
    }

    toast.success(
      () => (
        <div className="flex items-center gap-3">
          <span>
            {t.rich('addedProductQuantity', {
              cartItems: quantity,
              cartLink: (chunks) => (
                <Link
                  className="font-semibold text-primary hover:text-secondary"
                  href="/cart"
                  prefetch="viewport"
                  prefetchKind="full"
                >
                  {chunks}
                </Link>
              ),
            })}
          </span>
        </div>
      ),
      { icon: <Check className="text-success-secondary" /> },
    );
  };



  return (
    <FormProvider handleSubmit={handleSubmit} register={register} {...methods}>
      <form className="flex flex-col gap-6 @container " onSubmit={handleSubmit(productFormSubmit)}>
        <input type="hidden" value={product.entityId} {...register('product_id')} />

        {productOptions.map((option) => {
          switch (option.__typename) {
            case 'MultipleChoiceOption':
              return <MultipleChoiceField key={option.entityId} option={option} />;
            case 'CheckboxOption':
              return <CheckboxField key={option.entityId} option={option} />;
            case 'NumberFieldOption':
              return <NumberField key={option.entityId} option={option} />;
            case 'MultiLineTextFieldOption':
              return <MultiLineTextField key={option.entityId} option={option} />;
            case 'TextFieldOption':
              return <TextField key={option.entityId} option={option} />;
            case 'DateFieldOption':
              return <DateField key={option.entityId} option={option} />;
            default:
              return null;
          }
        })}

        <div className="pr-qty-buttonwrap">
          <QuantityField />
          <div className="flex flex-col gap-4 @md:flex-row pr-btn-wrapper">
            <AddToCart disabled={product.availabilityV2.status === 'Unavailable'} />
             
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default ProductPopUpForm;