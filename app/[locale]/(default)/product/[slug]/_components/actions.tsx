'use server';

import { revalidatePath } from 'next/cache';
import { addProductReview } from '~/client/mutations/write-review';

export async function submitReview({
  formData,
  productEntityId,
  customerId,
}: {
  formData: FormData;
  productEntityId: number;
  customerId?: string | number;
}) {
  try {
    // Convert FormData to object
    const reviewInput = {
      rating: parseInt(formData.get('rating') as string, 10),
      author: formData.get('name') as string,
      email: formData.get('email') as string,
      title: formData.get('subject') as string,
      text: formData.get('comments') as string,
    };

    // Convert customerId to number if it's a string, or use undefined if not provided
    const normalizedCustomerId = customerId 
      ? typeof customerId === 'string' 
        ? parseInt(customerId, 10) 
        : customerId 
      : 0;

    // Submit review
    const response = await addProductReview({
      input: reviewInput,
      productEntityId,
      customerId: normalizedCustomerId,
    });

    // Revalidate the product page
    revalidatePath(`/product/${productEntityId}`, 'page');

    // Handle response
    if (response.errors.length === 0) {
      return {
        status: 'success',
        message: 'Review submitted successfully.'
      };
    }

    return {
      status: 'error',
      message: response.errors.map((error) => error.message).join('\n'),
    };
  } catch (error) {
    console.error('Review submission error:', error);
    return {
      status: 'error',
      message: 'Failed to submit review.'
    };
  }
}