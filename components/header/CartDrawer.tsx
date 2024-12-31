import { cookies } from 'next/headers';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';

import { getSessionCustomerId } from '~/auth';
import { client } from '~/client';
import { graphql } from '~/client/graphql';
import { TAGS } from '~/client/tags';
import { LocaleType } from '~/i18n';

import { CartItem, CartItemFragment } from '~/app/[locale]/(default)/cart/_components/cart-item';
import { CheckoutButton } from '~/app/[locale]/(default)/cart/_components/checkout-button';
import { CheckoutSummary, CheckoutSummaryFragment } from '~/app/[locale]/(default)/cart/_components/checkout-summary';
import { EmptyCart } from '~/app/[locale]/(default)/cart/_components/empty-cart';
import Customscript from '~/app/[locale]/(default)/cart/_components/js/customScript';
import CartScript from './js/cartScript';
import { Link } from 'lucide-react';
export const metadata = {
title: 'Cart',
};

interface Props {
params: {
locale: LocaleType;
};
}

const CartPageQuery = graphql(
`
query CartPageQuery($cartId: String) {
site {
cart(entityId: $cartId) {
entityId
currencyCode
lineItems {
...CartItemFragment
}
}
checkout(entityId: $cartId) {
...CheckoutSummaryFragment
}
}
}
`,
[CartItemFragment, CheckoutSummaryFragment],
);

export default async function CartPage() {
const cartId = cookies().get('cartId')?.value;

if (!cartId) {
  return(
    <>
    <CartScript />
    <div id="cart-drawer" className='cart-drawer'>
      <div className="cart-main_wrapper">
        <div className="cart_heading">
          <h5>Your Cart</h5>
          <div id="close-cart">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 lucide lucide-x"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path><title>Close</title></svg>
          </div>
        </div>
        <div className="cart_wrap">
          <div className="empty_cart-text">
            <h2>Your cart is empty</h2>
            <p>Looks like you have not addded anything to your cart. Go ahead & explore top categories</p>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

const messages = await getMessages();
const Cart = messages.Cart ?? {};
const t = await getTranslations({ namespace: 'Cart' });

const customerId = await getSessionCustomerId();

const { data } = await client.fetch({
document: CartPageQuery,
variables: { cartId },
customerId,
fetchOptions: {
cache: 'no-store',
next: {
tags: [TAGS.cart, TAGS.checkout],
},
},
});

const cart = data.site.cart;
const checkout = data.site.checkout;

if (!cart) {
  return(
    <>
    <CartScript />
    <div id="cart-drawer" className='cart-drawer'>
      <div className="cart-main_wrapper">
        <div className="cart_heading">
          <h5>Your Cart</h5>
          <div id="close-cart">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 lucide lucide-x"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path><title>Close</title></svg>
          </div>
        </div>
        <div className="cart_wrap">
          <div className="empty_cart-text">
            <h2>Your cart is empty</h2>
            <p>Looks like you have not addded anything to your cart. Go ahead & explore top categories</p>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

const lineItems = [...cart.lineItems.physicalItems, ...cart.lineItems.digitalItems];

return (
  <>
  <Customscript />
  <CartScript />

  <div id="cart-drawer" className='cart-drawer'>
    <div className="cart-main_wrapper">
      <div className="cart_heading">
        <h5>Your Cart</h5>
        <div id="close-cart">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 lucide lucide-x"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path><title>Close</title></svg>
        </div>
      </div>
      <div className="cart_wrap">
        <ul className="cart-info">
          {lineItems.map((product) => (
            <CartItem currencyCode={cart.currencyCode} key={product.entityId} product={product} />
          ))}
        </ul>

        <div className="cart-totalinfo">
          {checkout &&
          <CheckoutSummary data={checkout} />}          
          <NextIntlClientProvider messages={{ Cart }}>
            <CheckoutButton  cartId={cartId} />
          </NextIntlClientProvider>
        </div>
      </div>
    </div>
  </div>
 
  </>
);
}

export const runtime = 'edge';