import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import { FragmentOf, graphql } from '~/client/graphql';
import { ProductForm } from '~/components/product-form';
import { ProductFormFragment } from '~/components/product-form/fragment';
import { ProductSchema, ProductSchemaFragment } from './product-schema';
import { ReviewSummary, ReviewSummaryFragment } from './review-summary';
import SocialShare from './social-share';
import { getSessionCustomerId } from '~/auth';
import { revalidate } from '~/client/revalidate-target';
import { client } from '~/client';
import CustomFields from './custom-fields';

export const DetailsFragment = graphql(
  `
    fragment DetailsFragment on Product {
      ...ReviewSummaryFragment
      ...ProductSchemaFragment
      ...ProductFormFragment
      entityId
      name
      sku
      upc
      minPurchaseQuantity
      maxPurchaseQuantity
      condition
      weight {
        value
        unit
      }
      availabilityV2 {
        description
      }
      customFields {
        edges {
          node {
            entityId
            name
            value
          }
        }
      }
      brand {
        name
      }
      prices {
        priceRange {
          min {
            value
          }
          max {
            value
          }
        }
        retailPrice {
          value
        }
        salePrice {
          value
        }
        basePrice {
          value
        }
        price {
          value
          currencyCode
        }
      }
    }
  `,
  [ReviewSummaryFragment, ProductSchemaFragment, ProductFormFragment],
);

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

interface Props {
  product: FragmentOf<typeof DetailsFragment>;
}

export const Details = async({ product }: Props) => {
  const customerId = await getSessionCustomerId();
  
  let wishlists = [];
  if(customerId) {
    const { data } = await client.fetch({
      document: GetWishlistsQuery,
      customerId,
      fetchOptions: customerId ? { cache: 'no-store' } : { next: { revalidate } },
    });

    wishlists = removeEdgesAndNodes(data?.customer?.wishlists) || [];
  }

  const customFields = removeEdgesAndNodes(product?.customFields);
  const showPriceRange = product?.prices?.priceRange?.min?.value !== product?.prices?.priceRange?.max?.value;
  const shareUrl = `https://incognito7.mybigcommerce.com/products/${product?.slug}`;
  const title = product?.name;
  const media = product?.imageUrl;

  const formatPrice = (price: number, currencyCode: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(price);
  };

  return (
    <div className="pr_right">
      {/* Brand Name */}
      {product?.brand && (
        <p className="mb-2 font-semibold text-gray-500 uppercase">{product?.brand?.name}</p>
      )}

      {/* Product Name */}
      <h1 className="mb-4 font-bold text-[26px]">{product?.name}</h1>

      {/* Pricing Section */}
      {product?.prices && (
        <div className="mb-5 text-2xl font-bold lg:text-3xl text-[#B80D0D] price_wrapper">
          {showPriceRange ? (
            <span>
              {formatPrice(product?.prices?.priceRange?.min?.value, product?.prices?.price?.currencyCode)}
              {' - '}
              {formatPrice(product?.prices?.priceRange?.max?.value, product?.prices?.price?.currencyCode)}
            </span>
          ) : (
            <>
              {product?.prices?.retailPrice?.value !== undefined && (
                <span>
                  Prices.msrp:{' '}
                  <span className="line-through">
                    {formatPrice(product?.prices?.retailPrice?.value, product?.prices?.price?.currencyCode)}
                  </span>
                  <br />
                </span>
              )}
              {product?.prices?.salePrice?.value !== undefined &&
                product?.prices?.basePrice?.value !== undefined ? (
                <>
                  <span>
                    Prices.was:{' '}
                    <span className="line-through">
                      {formatPrice(product?.prices?.basePrice?.value, product?.prices?.price?.currencyCode)}
                    </span>
                  </span>
                  <br />
                  <span>
                    Prices.now:{' '}
                    {formatPrice(product?.prices?.salePrice?.value, product?.prices?.price?.currencyCode)}
                  </span>
                </>
              ) : (
                product?.prices?.price?.value && (
                  <span>
                    {formatPrice(product?.prices?.price?.value, product?.prices?.price?.currencyCode)}
                  </span>
                )
              )}
            </>
          )}
        </div>
      )}

      <ReviewSummary data={product} />

      {/* Product Info Section */}
      <div className="mt-3 mb-5 pr_info">
        <div className="flex flex-wrap gap-x-3 gap-y-2 pr-info">
          {/* Product Details */}
          {Boolean(product?.sku) && (
            <div className="pdp_sku">
              <h3 className="font-semibold">sku:</h3>
              <p>{product?.sku}</p>
            </div>
          )}
          {Boolean(product?.upc) && (
            <div className="pdp_upc">
              <h3 className="font-semibold">upc:</h3>
              <p>{product?.upc}</p>
            </div>
          )}
          {Boolean(product?.minPurchaseQuantity) && (
            <div className="pdp_purchase">
              <h3 className="font-semibold">minPurchase:</h3>
              <p>{product?.minPurchaseQuantity}</p>
            </div>
          )}
          {Boolean(product?.maxPurchaseQuantity) && (
            <div className="pdp_purchase">
              <h3 className="font-semibold">maxPurchase:</h3>
              <p>{product?.maxPurchaseQuantity}</p>
            </div>
          )}
          {Boolean(product?.availabilityV2?.description) && (
            <div className="pdp_availability">
              <h3 className="font-semibold">availability:</h3>
              <p>{product?.availabilityV2?.description}</p>
            </div>
          )}
          {Boolean(product?.condition) && (
            <div className="pdp_condition hide">
              <h3 className="font-semibold">condition:</h3>
              <p>{product?.condition}</p>
            </div>
          )}
          {Boolean(product?.weight) && (
            <div className="pdp_weight hide">
              <h3 className="font-semibold">weight:</h3>
              <p>
                {product?.weight?.value} {product?.weight?.unit}
              </p>
            </div>
          )}
          {Boolean(customFields) &&
            customFields.map((customField) => (
              <div key={customField?.entityId} className="pdp_customfields hide">
                <h3 className="font-semibold">{customField?.name}:</h3>
                <p>{customField?.value}</p>
              </div>
            ))}
        </div>
      </div>

      <ProductForm 
        product={product} 
        wishlists={wishlists} 
        customerId={customerId} 
      />

      {/* Free Shipping Banner */}
      <p className="free-shipping-text">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" className="svg-icon" viewBox="0 0 1024 1024" version="1.1">
          <path d="M853.333333 341.333333h-128V170.666667H128c-47.146667 0-85.333333 38.186667-85.333333 85.333333v469.333333h85.333333c0 70.613333 57.386667 128 128 128s128-57.386667 128-128h256c0 70.613333 57.386667 128 128 128s128-57.386667 128-128h85.333333V512l-128-170.666667zM256 789.333333c-35.413333 0-64-28.586667-64-64s28.586667-64 64-64 64 28.586667 64 64-28.586667 64-64 64z m576-384l83.84 106.666667H725.333333v-106.666667h106.666667z m-64 384c-35.413333 0-64-28.586667-64-64s28.586667-64 64-64 64 28.586667 64 64-28.586667 64-64 64z"></path>
        </svg>
        FREE SHIPPING ON ORDERS OVER $99 (USA Only)
      </p>

      <CustomFields customFields={product.customFields} />

      {/* Info Boxes */}
      <div className="info-wrapper">
        <a href="#" className="info-box return-box">
          <img src="https://cdn11.bigcommerce.com/s-aat79ztzer/content/images/return1.png" height="45" width="45" alt="Refunds/Returns" />
          <p>Refunds/Returns</p>
        </a>
        <a href="#" className="info-box warranty-box">
          <img src="https://cdn11.bigcommerce.com/s-aat79ztzer/content/images/warranty.png" height="49" width="42" alt="Lifetime Warranty" />
          <p>Lifetime Warranty</p>
        </a>
        <a href="#" className="info-box verified-box">
          <img src="https://cdn11.bigcommerce.com/s-aat79ztzer/content/images/money-back.png" height="49" width="45" alt="30 Day Money Back Guarantee" />
          <p>30 Day Money Back Guarantee</p>
        </a>
      </div>

      <SocialShare url={shareUrl} title={title} media={media} />
      <ProductSchema product={product} />
    </div>
  );
};