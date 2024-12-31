import { client } from '..';
import { graphql } from '../graphql';

const GetWishlistsQuery = graphql(`
    query GetWishlists {
      customer {
        wishlists {
          edges {
            node {
              entityId
              name
              token
               items{
                edges{
                  node{
                    productEntityId
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
  

export const getWishlistItems = async (customerId: any) => {
    const { data } = await client.fetch({
        document: GetWishlistsQuery,
        customerId,
        fetchOptions: { cache: 'no-store' },
      });

  const wishlists = data?.customer?.wishlists;
  return wishlists;
};
