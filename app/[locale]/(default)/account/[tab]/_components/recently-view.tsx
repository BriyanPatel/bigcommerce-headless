import { getLocale, getTranslations, getMessages, unstable_setRequestLocale } from 'next-intl/server';
import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import { NextIntlClientProvider } from 'next-intl';
import { client } from '~/client';
import { graphql } from '~/client/graphql';
import {
    ProductCardCarousel,
    ProductCardCarouselFragment,
} from '~/components/product-card-carousel';
import { getSessionCustomerId } from '~/auth';
import { revalidate } from '~/client/revalidate-target';
import { cookies } from 'next/headers';

const RecentlyViewedProductsQuery = graphql(`
  query RecentlyViewedProductsQuery($productIds: [Int!]!) {
    site {
      products(entityIds: $productIds, first: 15) {
        edges {
          node {
            ...ProductCardCarouselFragment
          }
        }
      }
    }
  }
`, [ProductCardCarouselFragment]);

export const RecentlyView = async ({ heading }: { heading: string }) => {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'Account.Home' });
  const messages = await getMessages({ locale });
  const tab = heading === 'recently-viewed' ? 'recentlyViewed' : heading;
  const title = tab;

  const customerId = await getSessionCustomerId();

  unstable_setRequestLocale(locale);

  // Server-side code to get recently viewed product IDs
  const cookieStore = cookies();
  const recentlyViewedCookie = cookieStore.get('recentlyViewedProducts');
  const recentlyViewedProducts = recentlyViewedCookie ? JSON.parse(recentlyViewedCookie.value) : [];

  // Fetch recently viewed products using GraphQL
  const { data } = await client.fetch({
    document: RecentlyViewedProductsQuery,
    variables: { productIds: recentlyViewedProducts },
    customerId,
    fetchOptions: customerId ? { cache: 'no-store' } : { next: { revalidate } },
  });

  const recentProducts = removeEdgesAndNodes(data.site.products);

  // Sort the products based on the order in the cookie
  const sortedRecentProducts = recentlyViewedProducts
  .map((id: number) => recentProducts.find(product => product.entityId === id))
  .filter(Boolean);

  return (
    <div className="mx-auto my-10 2xl:container">
      <NextIntlClientProvider locale={locale} messages={{ Product: messages.Product ?? {} }}>
        <ProductCardCarousel
          products={sortedRecentProducts}
          showCart={false}
          showCompare={false}
          showReviews={false}
          title={t(title)}
        />
      </NextIntlClientProvider>
    </div>
  ); 
};