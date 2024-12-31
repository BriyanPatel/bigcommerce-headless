import React from 'react';
import { getLocale, getTranslations, getMessages, unstable_setRequestLocale } from 'next-intl/server';
import { Connection } from '@bigcommerce/catalyst-client';
import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import { NextIntlClientProvider } from 'next-intl';
import { client } from '~/client';
import { graphql } from '~/client/graphql';
import { getSessionCustomerId } from '~/auth';
import { revalidate } from '~/client/revalidate-target';
import { TabType } from '../layout';
import OrdersClient from './OrdersClient';

const OrdersQuery = graphql(`
  query Order {
    customer {
      orders {
        edges {
          node {
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
            consignments {
              shipping(first: 10) {
                edges {
                  node {
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

interface OrdersProps {
  heading: TabType | 'change_password';
}

interface LineItem {
  productEntityId: number;
  entityId: number;
  quantity: number;
  name: string;
  image?: {
    urlOriginal: string;
  } | null;
}

interface ShippingNode {
  lineItems: Connection<LineItem>;
}

interface ConsignmentShipping {
  shipping: Connection<ShippingNode>;
}

interface Order {
  entityId: number;
  orderedAt: {
    utc: string;
  };
  updatedAt: {
    utc: string;
  };
  status: {
    value: string;
  };
  subTotal: {
    value: number;
    currencyCode: string;
  };
  consignments: ConsignmentShipping | null;
}

interface ProcessedOrder {
  entityId: string;
  orderedAt: string;
  updatedAt: string;
  status: string;
  subTotal: {
    value: number;
    currencyCode: string;
  };
  items: Array<{
    imageUrl: string;
    name: string;
    quantity: number;
  }>;
}

function toSerializable<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export const Orders: React.FC<OrdersProps> = async ({ heading }) => {
  const locale = await getLocale();
  const t = await getTranslations('Account.Home');
  const messages = await getMessages();
  const tab = heading === 'recently-viewed' ? 'recentlyViewed' : heading;
  const title = String(t(tab));

  const customerId = await getSessionCustomerId();

  unstable_setRequestLocale(locale);

  const { data } = await client.fetch({
    document: OrdersQuery,
    customerId,
    fetchOptions: customerId ? { cache: 'no-store' } : { next: { revalidate } },
  });

  const orders = data?.customer?.orders;
  const rawOrdersData = orders ? removeEdgesAndNodes(orders as Connection<Order>) : [];

  const ordersData: ProcessedOrder[] = rawOrdersData.map((order) => {
    const items = order.consignments?.shipping
      ? removeEdgesAndNodes(order.consignments.shipping).flatMap((shipping) =>
          removeEdgesAndNodes(shipping.lineItems).map((item) => ({
            imageUrl: item?.image?.urlOriginal ?? '',
            name: item.name,
            quantity: item.quantity,
          }))
        )
      : [];

    return {
      entityId: String(order.entityId),
      orderedAt: order.orderedAt?.utc ?? '',
      updatedAt: order.updatedAt?.utc ?? '',
      status: order.status?.value ?? '',
      subTotal: {
        value: order.subTotal?.value ?? 0,
        currencyCode: order.subTotal?.currencyCode ?? '',
      },
      items,
    };
  });

  const serializedOrdersData = toSerializable(ordersData);
  const serializedMessages = toSerializable(messages);

  return (
    <NextIntlClientProvider locale={locale} messages={serializedMessages}>
      <OrdersClient title={title} orders={serializedOrdersData} />
    </NextIntlClientProvider>
  );
};

export default Orders;