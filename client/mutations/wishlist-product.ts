import { client } from '..';
import { graphql, VariablesOf } from '../graphql';

const CREATE_WISHLIST_MUTATION = graphql(`
  mutation CreateWishlist($input: CreateWishlistInput!) {
    wishlist {
      createWishlist(input: $input) {
        result {
          entityId
        }
      }
    }
  }
`);

const ADD_WISHLIST_ITEMS_MUTATION = graphql(`
  mutation AddWishlistItems($input: AddWishlistItemsInput!) {
    wishlist {
      addWishlistItems(input: $input) {
        result {
          entityId
        }
      }
    }
  }
`);

type CreateWishlistVariables = VariablesOf<typeof CREATE_WISHLIST_MUTATION>;
type AddWishlistItemsVariables = VariablesOf<typeof ADD_WISHLIST_ITEMS_MUTATION>;
type Input = AddWishlistItemsVariables['input'];
interface AddWishlistItemResult {
  entityId: string;
  productEntityId: number;
  customerId: number;
  wishlistId?: string;
}

export const addWishlistProduct = async (
  productEntityId: Input['productEntityId'],
  wishlistId?: Input['wishlistId'],
  customerId?:Input['customerId']

): Promise<AddWishlistItemResult> => {
  try {

    if (!customerId) {
      throw new Error('Customer ID is required');
    }

    let currentWishlistId = wishlistId;

    // Create wishlist if it doesn't exist
    if (!currentWishlistId) {

      const createResponse = await client.fetch<CreateWishlistVariables>({
        document: CREATE_WISHLIST_MUTATION,
        variables: {
          input: {
            name: "My Wishlist",
            isPublic: false
          }
        },
        customerId,
        fetchOptions: { cache: 'no-store' },
      });

      currentWishlistId = createResponse.data?.wishlist?.createWishlist?.result?.entityId;

      if (!currentWishlistId) {
        throw new Error('Failed to create wishlist');
      }
    }

    // Add item to wishlist
    const addItemResponse = await client.fetch<AddWishlistItemsVariables>({
      document: ADD_WISHLIST_ITEMS_MUTATION,
      variables: {
        input: {
          entityId: currentWishlistId,
          items: [{
            productEntityId: productEntityId
          }]
        }
      },
      customerId,
      fetchOptions: { cache: 'no-store' },
    });

    const result = addItemResponse.data?.wishlist?.addWishlistItems?.result;

    if (!result) {
      throw new Error('Failed to add item to wishlist');
    }

    return result;
  } catch (error) {
    throw error;
  }
};