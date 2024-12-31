import { NextIntlClientProvider } from 'next-intl';
import { getMessages, unstable_setRequestLocale } from 'next-intl/server';
import { PropsWithChildren, Suspense } from 'react';

import { getSessionCustomerId } from '~/auth';
import { client } from '~/client';
import { graphql } from '~/client/graphql';
import { revalidate } from '~/client/revalidate-target';
import { Footer, FooterFragment } from '~/components/footer/footer';
import { Header, HeaderFragment } from '~/components/header';
import { Cart } from '~/components/header/cart';
import { ProductSheet } from '~/components/product-sheet';
import { LocaleType } from '~/i18n';

interface Props extends PropsWithChildren {
  params: { locale: LocaleType };
}

const LayoutQuery = graphql(
  `
    query LayoutQuery {
      site {
        ...HeaderFragment
        ...FooterFragment
      }
    }
  `,
  [HeaderFragment, FooterFragment],
);

export default async function DefaultLayout({ children, params: { locale } }: Props) {
  const customerId = await getSessionCustomerId();

  const { data } = await client.fetch({
    document: LayoutQuery,
    fetchOptions: customerId ? { cache: 'no-store' } : { next: { revalidate } },
  });

  unstable_setRequestLocale(locale);

  const messages = await getMessages({ locale });

  return (
    <>
      <Header cart={<Cart />} data={data.site} />
      <link rel="stylesheet" href="https://d1azc1qln24ryf.cloudfront.net/40686/revsglobal-pr-mod/style-cf.css?-c0avz5" />
      <link rel="stylesheet" href="https://widget.reviews.co.uk/combined/style.css?v1" />
      <main className="flex-1 w-full lg:px-0 2xl:mx-auto 2xl:px-0 main_body">
        {children}
      </main>

      <Suspense fallback={null}>
        <NextIntlClientProvider locale={locale} messages={{ Product: messages.Product ?? {} }}>
          <ProductSheet />
        </NextIntlClientProvider>
      </Suspense>

      <Footer data={data.site} />
    </>
  );
}
