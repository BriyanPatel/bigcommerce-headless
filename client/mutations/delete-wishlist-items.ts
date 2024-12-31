import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';

import { client } from '..';
import { graphql, VariablesOf } from '../graphql';

const DELETE_WISHLIST_ITEMS_MUTATION = graphql(`
  mutation deleteWishlistItems($input: DeleteWishlistItemsInput!) {
    wishlist {
      deleteWishlistItems(input: $input) {
        result {
          entityId
          name
          items {
            edges {
              node {
                entityId
                product {
                  name
                  entityId
                }
              }
            }
          }
        }
      }
    }
  }
`);

type Variables = VariablesOf<typeof DELETE_WISHLIST_ITEMS_MUTATION>;
type Input = Variables['input'];

export interface DeleteWishlistItems {
  input: Input;
  customerId : string;
}

export const deleteWishlistItems = async ({
  input,
  customerId,
}: DeleteWishlistItems) => {
 
  console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",  {variables: { input },
    customerId});
  
  const response = await client.fetch({
    document: DELETE_WISHLIST_ITEMS_MUTATION,
    variables: { input },
    customerId,
    fetchOptions: { cache: 'no-store' },
  });
console.log("response", response);
  const wishlist = response.data.wishlist.deleteWishlistItems?.result;
   
  if (!wishlist) {
    return undefined;
  }

  return {
    ...wishlist,
    items: removeEdgesAndNodes(wishlist.items),
  };
};
