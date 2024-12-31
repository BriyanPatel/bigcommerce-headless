import { client } from '..';
import { graphql } from '../graphql';

interface ReviewError {
  message: string;
  fields?: string[];
}

const CREATE_PRODUCT_REVIEW_MUTATION = graphql(`
  mutation createProductReview($input: ProductReviewInput!, $productEntityId: Long!, $reCaptchaV2: ReCaptchaV2Input) {
    catalog {
      addProductReview(
        input: { review: $input, productEntityId: $productEntityId }
        reCaptchaV2: $reCaptchaV2
      ) {
        errors {
          __typename
          ... on CustomerAlreadyReviewedProductError {
            message
          }
          ... on NotAuthorizedToAddProductReviewError {
            message
          }
          ... on ProductIdNotFoundError {
            message
          }
          ... on InvalidInputFieldsError {
            fields
            message
          }
          ... on UnexpectedAddReviewError {
            message
          }
        }
      }
    }
  }
`);

interface AddProductReviewParams {
  input: {
    rating: number;
    author: string;
    email: string;
    title: string;
    text: string;
  };
  productEntityId: number;
  customerId: number;
  reCaptchaToken?: string;
}

export const addProductReview = async ({ 
  input, 
  productEntityId,
  customerId,
  reCaptchaToken 
}: AddProductReviewParams) => {
  const response = await client.fetch({
    document: CREATE_PRODUCT_REVIEW_MUTATION,
    customerId,
    fetchOptions: { cache: 'no-store' },
    variables: {
      input,
      productEntityId,
      ...(reCaptchaToken && { reCaptchaV2: { token: reCaptchaToken } }),
    },
  });
  
  if(response?.data?.catalog?.addProductReview?.errors[0]?.message)
    return response?.data?.catalog?.addProductReview;
  else if(response?.errors[0]?.message)
    return response;
  else 
  return response?.data?.catalog?.addProductReview;
};