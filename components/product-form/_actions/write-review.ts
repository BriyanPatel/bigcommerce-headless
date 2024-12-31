'use server';

import { addProductReview } from '~/client/mutations/write-review';

interface WriteReviewResponse {
  status: 'success' | 'error';
  errors?: { message: string; fields?: string[] }[];
  error?: string;
}

export async function addWriteReviewData({
  input,
  productEntityId,
  customerId,
  reCaptchaToken
}: {
  input: AddProductReviewParams['input'];
  productEntityId: number;
  customerId: number;
  reCaptchaToken?: string;
}): Promise<WriteReviewResponse> {
  try {
    const writeReview = await addProductReview({ 
      input, 
      productEntityId,
      customerId,
      reCaptchaToken
    });

    return writeReview;
  } catch (error) {
    console.log("error", error);
    
    return { 
      status: 'error', 
      error: error instanceof Error ? error.message : 'Something went wrong'
    };
  }
}