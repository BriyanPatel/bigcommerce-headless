'use server';

import { revalidatePath } from 'next/cache';

import {
  deleteWishlists as deleteWishlistsClient,
} from '~/client/mutations/delete-wishlists';

export const deleteWishlists = async (wishlists: any) => {
  try {
    const result = await deleteWishlistsClient(wishlists);

    revalidatePath('/account/wishlists', 'page');

    if (result === 'success') {
      return {
        status: 'success',
      };
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        status: 'error',
        message: error.message,
      };
    }
  }

  return { status: 'error', message: 'Unknown error.' };
};
