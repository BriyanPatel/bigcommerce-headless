'use server';

import { createWishlist } from '~/client/mutations/create-wishlist';


export async function createWishlistAction(
    input,
    customerId
) {

  try {
     
        let cart = await createWishlist(input, customerId);

      if (!cart?.entityId) {
        return { status: 'error', error: 'Failed to create product to wishlist.' };
      }

      //revalidateTag(TAGS.cart);

      return { status: 'success', data: cart };

  } catch (error: unknown) {
    if (error instanceof Error) {
      return { status: 'error', error: error.message };
    }

    return { status: 'error', error: 'Something went wrong. Please try again.' };
  }
}
