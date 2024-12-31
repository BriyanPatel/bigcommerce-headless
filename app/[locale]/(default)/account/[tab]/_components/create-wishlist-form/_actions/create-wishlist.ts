'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getSessionCustomerId } from '~/auth';

import { createWishlist as createWishlistMutation } from '~/client/mutations/create-wishlist';

const CreateWishlistSchema = z.object({
  name: z.string(),
});

export const createWishlist = async (formData: FormData) => {
  const parsedData = CreateWishlistSchema.parse({
    name: formData.get('name'),
  });
  const customerIdString = await getSessionCustomerId();
  
  if (!customerIdString) {
    return {
      status: 'error' as const,
      message: 'Customer ID is required.',
    };
  }

  // Convert string to number
  const customerId = parseInt(customerIdString, 10);

  const input = {
    ...parsedData,
    isPublic: true,
  };

  try {
    const newWishlist = await createWishlistMutation({ input, customerId });

    revalidatePath('/account/wishlists', 'page');

    if (newWishlist) {
      return {
        status: 'success' as const,
        data: newWishlist,
      };
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        status: 'error' as const,
        message: error.message,
      };
    }
  }

  return { status: 'error' as const, message: 'Unknown error.' };
};