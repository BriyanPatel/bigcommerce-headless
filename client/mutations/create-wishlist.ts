import { client } from '..';
import { graphql, VariablesOf } from '../graphql';

const CREATE_WISHLIST_MUTATION = graphql(`
  mutation CreateWishlist($input: CreateWishlistInput!) {
    wishlist {
      createWishlist(input: $input) {
        result {
          entityId
          name
        }
      }
    }
  }
`);

type CreateWishlistVariables = VariablesOf<typeof CREATE_WISHLIST_MUTATION>;

interface CreateWishlistItemResult {
  entityId: string;  // Changed from 'input: any' to match the expected return type
  name: string;
  items: any;
  isPublic: boolean;
}

interface CreateWishlistParams {
  input: CreateWishlistVariables['input'];
  customerId: number;
}

export const createWishlist = async (
  params: CreateWishlistParams
): Promise<CreateWishlistItemResult> => {
  try {
    console.log("Starting createWishlist function");
    console.log(params)
   
    if (!params.customerId) {
      throw new Error('Customer ID is required');
    }
   
    console.log("Creating new wishlist");
    console.log({
      document: CREATE_WISHLIST_MUTATION,
      variables: { 
        input: params.input 
      },
      customerId: Number(params.customerId),
      fetchOptions: { cache: 'no-store' }
    });
    const createResponse = await client.fetch<CreateWishlistVariables>({
      document: CREATE_WISHLIST_MUTATION,
      variables: { 
        input: params.input 
      },
      customerId: Number(params.customerId),
      fetchOptions: { cache: 'no-store' }
    });
    
    const entityId = createResponse?.data?.wishlist?.createWishlist?.result?.entityId;
    if (!entityId) {
      throw new Error('Failed to create wishlist');
    }

    return {
      entityId
    };

  } catch (error) {
    console.error("Error in createWishlist:", error);
    throw error;
  }
};