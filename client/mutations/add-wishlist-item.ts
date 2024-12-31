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

export const addWishlistItem = async (
  productEntityId: Input['productEntityId'],
  customerId: Input['customerId'],
  wishlistId?: Input['wishlistId']
): Promise<AddWishlistItemResult> => {
  try {
    console.log("Starting addWishlistItem function");
    console.log("Inputs:", { productEntityId, customerId, wishlistId });

    if (!customerId) {
      throw new Error('Customer ID is required');
    }

    let currentWishlistId = wishlistId;

    console.log("Current Wishlist ID:", currentWishlistId);

    // Create wishlist if it doesn't exist
    if (!currentWishlistId) {
      console.log("Creating new wishlist");
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

      console.log("Create wishlist response:", createResponse);

      currentWishlistId = createResponse.data?.wishlist?.createWishlist?.result?.entityId;

      if (!currentWishlistId) {
        throw new Error('Failed to create wishlist');
      }

      console.log("New wishlist created with ID:", currentWishlistId);
    }

    // Add item to wishlist
    console.log("Adding item to wishlist");
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

    console.log("Add item response:", addItemResponse);

    const result = addItemResponse.data?.wishlist?.addWishlistItems?.result;

    if (!result) {
      throw new Error('Failed to add item to wishlist');
    }

    console.log("Item successfully added to wishlist");
    return result;
  } catch (error) {
    console.error("Error in addWishlistItem:", error);
    throw error;
  }
};
