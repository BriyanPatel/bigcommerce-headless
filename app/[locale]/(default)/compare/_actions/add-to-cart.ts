'use server';

import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';

import { addCartLineItem } from '~/client/mutations/add-cart-line-item';
import { createCart } from '~/client/mutations/create-cart';
import { getCart } from '~/client/queries/get-cart';
import { TAGS } from '~/client/tags';

export const addToCart = async (data: FormData) => {
  
  const productEntityId = Number(data.get('product_id'));
  let quantity = Number(data.get('quantity')) || 1;
  
  // Structure for selected options
  const selectedOptions: {
    multipleChoices: Array<{
      optionEntityId: number,
      optionValueEntityId: number
    }>
  } = {
    multipleChoices: []
  };

  // Extract selected options
  for (const [key, value] of data.entries()) {
    if (key.startsWith('attribute_')) {
      const match = key.match(/attribute_(\d+)/);
      if (match) {
        const optionEntityId = Number(match[1]);
        const optionValueEntityId = Number(value);
        
        selectedOptions.multipleChoices.push({
          optionEntityId,
          optionValueEntityId
        });
      }
    }
  }

  const cartId = cookies().get('cartId')?.value;

  let cart;

  try {
    cart = await getCart(cartId);
  
    const lineItem = {
      quantity,
      productEntityId,
      selectedOptions
    };

    if (cart) {
      cart = await addCartLineItem(cart.entityId, {
        lineItems: [lineItem],
      });

      if (!cart?.entityId) {
        return { status: 'error', error: 'Failed to add product to cart.' };
      }

      revalidateTag(TAGS.cart);

      return { status: 'success', data: cart };
    }

    cart = await createCart([lineItem]);

    if (!cart?.entityId) {
      return { status: 'error', error: 'Failed to add product to cart.' };
    }

    cookies().set({
      name: 'cartId',
      value: cart.entityId,
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      path: '/',
    });

    revalidateTag(TAGS.cart);

    return { status: 'success', data: cart };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { status: 'error', error: error.message };
    }

    return { status: 'error', error: 'Something went wrong. Please try again.' };
  }
};