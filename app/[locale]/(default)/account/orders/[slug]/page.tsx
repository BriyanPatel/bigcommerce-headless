import React from 'react';
import { getLocale } from 'next-intl/server';
import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import { client } from '~/client';
import { graphql } from '~/client/graphql';
import { getSessionCustomerId } from '~/auth';
import { revalidate } from '~/client/revalidate-target';
import { LocaleType } from '~/i18n';
import OrderDetailsClient from './OrderDetailsClient';
import { Connection } from '@bigcommerce/catalyst-client';

// Updated GraphQL query removing displayName and adjusting product options
const OrderQuery = graphql(`
  query Order($filter: OrderFilterInput!) {
      site {
        order(filter: $filter) {
          entityId
          orderedAt {
            utc
          }
          updatedAt {
            utc
          }
          status {
            value
          }
          subTotal {
            value
            currencyCode
          }
          totalIncTax {
            value
            currencyCode
          }
          consignments {
            shipping(first: 10) {
              edges {
                node {
                  shippingCost {
                    value
                    currencyCode
                  }
                  handlingCost {
                    value
                    currencyCode
                  }
                  lineItems(first: 10) {
                    edges {
                      node {
                        productEntityId
                        entityId
                        quantity
                        name
                        image {
                          urlOriginal
                        }
                        productOptions {
                          name
                          value
                        }
                        subTotalSalePrice {
                          value
                          currencyCode
                        }
                      }
                    }
                  }
                  shippingAddress {
                    firstName
                    lastName
                    address1
                    address2
                    email
                    phone
                    postalCode
                    company
                    country
                    stateOrProvince
                  }
                }
              }
            }
          }
          billingAddress {
            firstName
            lastName
            address1
            address2
            email
            phone
            postalCode
            company
            country
            stateOrProvince
          }
        }
      }
    }
  `);
  
  // Updated ProductOptionsQuery to match available fields
  const ProductOptionsQuery = graphql(`
 query ProductOptions($productIds: [Int!]!) {
    site {
      products(entityIds: $productIds) {
        edges {
          node {
            entityId
            name
            productOptions {
              edges {
                node {
                  __typename
                  entityId
                  displayName
                  isVariantOption
                  ... on MultipleChoiceOption {
                   
                    values {
                      edges {
                        node {
                          entityId
                          label
                          isDefault
                        }
                      }
                    }
                  }
                }
              }
            }
            variants{
              edges{
                node{
                id
                  entityId
                  productOptions{
                    edges{
                      node{
                         entityId
                  isVariantOption
                  ... on MultipleChoiceOption {
                   
                    values {
                      edges {
                        node {
                          entityId
                          label
                          isDefault
                        }
                      }
                    }
                  }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  `);

// Base interfaces for the order data structure
interface Address {
  firstName: string | null;
  lastName: string | null;
  address1: string | null;
  address2: string | null;
  email: string | null;
  phone: string | null;
  postalCode: string;
  company: string | null;
  country: string;
  city: string;
  stateOrProvince: string | null;
}

interface Money {
  value: number;
  currencyCode: string;
}

interface ProductOption {
  displayName: string;
  value: string;
}

interface LineItem {
  productEntityId: number;  // Changed to number
  entityId: number;         // Changed to number
  quantity: number;
  name: string;
  image: {
    urlOriginal: string | null;
  } | null;
  productOptions: ProductOption[];
  subTotalSalePrice: Money;
}

interface ShippingNode {
  
  shippingCost: Money;
  handlingCost: Money;
  lineItems: Connection<LineItem>;
  shippingAddress: Address;
}

interface OrderData {
  site?: {
    order?: {
      entityId: number;        // Changed to number
      orderedAt: { utc: string };
      updatedAt: { utc: string };
      status: { value: string };
      paymentMethod: { value: string };
      subTotal: Money;
      totalIncTax: Money;
      consignments?: {
        shipping?: Connection<ShippingNode>;
      };
      billingAddress: Address;
    };
  };
}

// Helper function to safely process consignments
const processConsignments = (orderData: OrderData) => {
  const shipping = orderData.site?.order?.consignments?.shipping;
  
  if (!shipping || !('edges' in shipping)) {
    return [];
  }

  return removeEdgesAndNodes(shipping);
};

// Helper function to safely process line items
const processLineItems = (shippingConsignments: ShippingNode[]) => {
  return shippingConsignments.flatMap(shipping => {
    if (!shipping.lineItems || !('edges' in shipping.lineItems)) {
      return [];
    }
    return removeEdgesAndNodes(shipping.lineItems);
  });
};

// Main order processing code
export default async function Product(params: any) {
  const orderId = Number(params.slug);
  const locale = await getLocale();
  const customerId = await getSessionCustomerId();

  // Fetch order details
  const { data: orderData } = await client.fetch({
    document: OrderQuery,
    variables: { filter: { entityId: orderId } },
    customerId,
    fetchOptions: customerId ? { cache: 'no-store' } : { next: { revalidate } },
  });

  const rawOrderData = orderData as OrderData;

  if (!rawOrderData?.site?.order) {
    return <div>Order not found</div>;
  }

  // Process shipping consignments
  const shippingConsignments = processConsignments(rawOrderData);
  
  // Process line items with type safety
  const lineItems = processLineItems(shippingConsignments);
  
  // Extract unique product IDs
  const productIds = [...new Set(lineItems.map(item => 
    Number(item.productEntityId)
  ))].filter(Boolean);

// Fetch product options for these product IDs
const { data: productOptionsData } = await client.fetch({
  document: ProductOptionsQuery,
  variables: { productIds },
  customerId,
  fetchOptions: customerId ? { cache: 'no-store' } : { next: { revalidate } },
});


// Create a map of product options by product ID
type ProductOption = 
| {
    __typename: 'MultipleChoiceOption';
    entityId: number;
    name: string;
    isVariantOption: boolean;
    values: {
      entityId: number;
      label: string;
      name: string;
      isDefault: boolean;
    }[];
  }
| {
    __typename: 'CheckboxOption';
    entityId: number;
    name: string;
    isVariantOption: boolean;
  }
// ... other option types

const productOptionsMap = new Map(
removeEdgesAndNodes(productOptionsData?.site?.products)
  .map(product => {
    const productOptions = removeEdgesAndNodes(product.productOptions)
      .map(option => {
        // Type-safe handling of different option types
        if (option.__typename === 'MultipleChoiceOption') {
          const optionValues = removeEdgesAndNodes(option.values || []).map(value => ({
            entityId: value.entityId,
            label: value.label,
            isDefault: value.isDefault
          }));

          return {
            entityId: option.entityId,
            name: option.displayName,
            isVariantOption: option.isVariantOption,
            values: optionValues,
            __typename: option.__typename
          };
        }

        // For other option types that don't have values
        return {
          entityId: option.entityId,
          name: option.displayName,
          isVariantOption: option.isVariantOption,
          values: [],
          __typename: option.__typename
        };
      });

    return [
      Number(product.entityId),
      {
        entityId: product.entityId,
        name: product.name,
        options: productOptions
      }
    ];
  })
);

// Enhanced line items processing with more robust matching
const items = lineItems.map(item => {
  const productId = Number(item.productEntityId);
  const productInfo = productOptionsMap.get(productId);
  
  // Match selected options with full product options
  const enhancedProductOptions = item.productOptions.map(selectedOption => {
    // Normalize selected option name and value
    const normalizedName = selectedOption.displayName?.toLowerCase().trim();
    const normalizedValue = selectedOption.value?.toLowerCase().trim();

    // Find the matching option in the product's full options
    const matchingOption = productInfo?.options.find(opt => {
      // Normalize option name
      const optionNameNormalized = opt.name?.toLowerCase().trim();

      // Multiple matching strategies
      return (
        // Exact name match
        optionNameNormalized === normalizedName ||
        
        // Partial name match
        (normalizedName && optionNameNormalized?.includes(normalizedName)) ||
        
        // Value match within option
        opt.values.some(val => 
          val.label?.toLowerCase().trim() === normalizedValue
        )
      );
    });

    // Find the matching value within that option
    const matchingValue = matchingOption?.values.find(val => 
      val.label?.toLowerCase().trim() === normalizedValue
    );

    return {
      name: selectedOption.displayName,
      value: selectedOption.value,
      optionEntityId: matchingOption?.entityId || null,
      valueEntityId: matchingValue?.entityId || null,
      // Detailed debug information
      debugInfo: {
        originalName: selectedOption.displayName,
        originalValue: selectedOption.value,
        matchedOptionName: matchingOption?.name || 'No match',
        matchedOptionEntityId: matchingOption?.entityId || 'N/A',
        matchedValueLabel: matchingValue?.label || 'No match',
        matchedValueEntityId: matchingValue?.entityId || 'N/A'
      }
    };
  });

  const valueIds = enhancedProductOptions.map(item => item.valueEntityId).join('_');

  return {
    id: productId,
    productName: productInfo?.name || '',
    imageUrl: String(item?.image?.urlOriginal || ''),
    name: String(item.name || ''),
    quantity: Number(item.quantity || 0),
    price: Number(item?.subTotalSalePrice?.value || 0),
    currency: String(item?.subTotalSalePrice?.currencyCode),
    selectedProductOptions: enhancedProductOptions,
    fullProductOptions: productInfo?.options || [],
    valueIds: valueIds
  };
});


const orderDetails = {
  entityId: String(rawOrderData.site?.order?.entityId || ''),
  orderedAt: String(rawOrderData.site?.order?.orderedAt?.utc || ''),
  updatedAt: String(rawOrderData.site?.order?.updatedAt?.utc || ''),
  status: String(rawOrderData.site?.order?.status?.value || ''),
  paymentMethod: String(rawOrderData?.site?.order?.paymentMethod || 'Not specified'),  // Added payment method
  subTotal: {
    value: Number(rawOrderData.site?.order?.subTotal?.value || 0),
    currencyCode: String(rawOrderData.site?.order?.subTotal?.currencyCode || '')
  },
  totalIncTax: {
    value: Number(rawOrderData.site?.order?.totalIncTax?.value || 0),
    currencyCode: String(rawOrderData.site?.order?.totalIncTax?.currencyCode || '')
  },
  items,
  shippingAddress: (rawOrderData?.site?.order?.consignments?.shipping?.edges?.length ? 
    rawOrderData.site.order.consignments.shipping.edges[0]?.node?.shippingAddress : null) || null,
  shippingDetails: (rawOrderData?.site?.order?.consignments?.shipping?.edges?.length ? 
    rawOrderData.site.order.consignments.shipping.edges[0]?.node : null) || null,
  billingAddress: rawOrderData.site?.order?.billingAddress || null,
};
function toSerializable<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}
const serializedOrderData = toSerializable(orderDetails);
const transformedOrderData = {
  entityId: serializedOrderData.entityId,
  status: serializedOrderData.status,
  orderedAt: serializedOrderData.orderedAt,
  totalIncTax: serializedOrderData.totalIncTax,
  paymentMethod: serializedOrderData.paymentMethod,
  subTotal: serializedOrderData.subTotal,
  items: serializedOrderData.items.map(item => ({
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    imageUrl: item.imageUrl,
    currency: item.currency,
    productOptions: item.selectedProductOptions
  })),
  shippingDetails: {
    shippingCost: serializedOrderData.shippingDetails?.shippingCost || {
      value: 0,
      currencyCode: serializedOrderData.totalIncTax.currencyCode
    }
  },
  shippingAddress: {
    firstName: serializedOrderData.shippingAddress?.firstName || '',
    lastName: serializedOrderData.shippingAddress?.lastName || '', 
    address1: serializedOrderData.shippingAddress?.address1 || '',
    address2: serializedOrderData.shippingAddress?.address2 || '',
    email: serializedOrderData.shippingAddress?.email || '',
    phone: serializedOrderData.shippingAddress?.phone || '',
    postalCode: serializedOrderData.shippingAddress?.postalCode || '',
    city: serializedOrderData.shippingAddress?.city || '',
    company: serializedOrderData.shippingAddress?.company || '',
    country: serializedOrderData.shippingAddress?.country || '',
    stateOrProvince: serializedOrderData.shippingAddress?.stateOrProvince || ''
  },
  billingAddress: {
    firstName: serializedOrderData.billingAddress?.firstName || '',
    lastName: serializedOrderData.billingAddress?.lastName || '',
    address1: serializedOrderData.billingAddress?.address1 || '',
    address2: serializedOrderData.billingAddress?.address2 || '',
    email: serializedOrderData.billingAddress?.email || '',
    phone: serializedOrderData.billingAddress?.phone || '',
    postalCode: serializedOrderData.billingAddress?.postalCode || '',
    city: serializedOrderData.billingAddress?.city || '',
    company: serializedOrderData.billingAddress?.company || '',
    country: serializedOrderData.billingAddress?.country || '',
    stateOrProvince: serializedOrderData.billingAddress?.stateOrProvince || ''
  }
 };

  return <OrderDetailsClient order={transformedOrderData} />;
}