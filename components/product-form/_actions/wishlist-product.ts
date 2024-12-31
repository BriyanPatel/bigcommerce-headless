'use server';

import { graphql } from '~/client/graphql';
import { addWishlistProduct } from '~/client/mutations/wishlist-product';
import { deleteWishlistItems } from "~/client/mutations/delete-wishlist-items";
import { getWishlistItems } from "~/client/queries/get-wishlist-items"
import { ProductFormData } from '../use-product-form';

export async function handleAddToWishlist(
  product: ProductFormData,
  wishlistId,
  customerId
) {
    
  const productEntityId = product.entityId;

  try {
        
        let cart = await addWishlistProduct(
            productEntityId,
            wishlistId,
            customerId
      );

      if (!cart?.entityId) {
        return { status: 'error', error: 'Failed to add product to wishlist.' };
      }

      //revalidateTag(TAGS.cart);

      return { status: 'success', data: cart };

  } catch (error: unknown) {
    if (error instanceof Error) {
      return { status: 'error', error: error.message };
    }

    return { status: 'error', error: 'Something went wrong. Please try again.' };
  }
}


//remove products from wishlist
export async function handleRemoveFromWishlist(
  wishlistEntityId,
  wishlistId,
  customerId
) {
    

  try {
    const input = {
      "entityId": wishlistId,
      "itemEntityIds": [wishlistEntityId]
    }
        let cart = await deleteWishlistItems({input, customerId});

      if (!cart?.entityId) {
        return { status: 'error', error: 'Failed to remove product to wishlist.' };
      }

      //revalidateTag(TAGS.cart);

      return { status: 'success', data: cart };

  } catch (error: unknown) {
    if (error instanceof Error) {
      return { status: 'error', error: error.message };
    }

    return { status: 'error', error: 'Something went wrong. Please try again.' };
  }
}

//get wishlistData
export async function getWishlistsData(
customerId
) {

  try {
   
        let wishlist = await getWishlistItems(customerId);

      return wishlist;

  } catch (error: unknown) {
    if (error instanceof Error) {
      return { status: 'error', error: error.message };
    }

    return { status: 'error', error: 'Something went wrong. Please try again.' };
  }
}