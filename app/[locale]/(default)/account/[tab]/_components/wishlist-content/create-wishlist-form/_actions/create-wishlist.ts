'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getSessionCustomerId } from '~/auth';
import { createWishlist as createWishlistClient } from '~/client/mutations/create-wishlist';

const CreateWishlistSchema = z.object({
  name: z.string(),
});

export const createWishlist = async (formData: FormData) => {
  const parsedData = CreateWishlistSchema.parse({
    name: formData.get('name'),
  });

  const customerId = await getSessionCustomerId();

  if (!customerId) {
    return {
      status: 'error' as const,
      message: 'Customer ID is required.',
    };
  }

  const input = {
    ...parsedData,
    isPublic: true,
  };

  try {
    const newWishlist = await createWishlistClient({
      input,
      customerId: parseInt(customerId, 10),
    });

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