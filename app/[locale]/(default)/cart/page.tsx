import { cookies } from 'next/headers';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';

import { getSessionCustomerId } from '~/auth';
import { client } from '~/client';
import { graphql } from '~/client/graphql';
import { TAGS } from '~/client/tags';
import { LocaleType } from '~/i18n';

import { CartItem, CartItemFragment } from './_components/cart-item';
import { CheckoutButton } from './_components/checkout-button';
import { CheckoutSummary, CheckoutSummaryFragment } from './_components/checkout-summary';
import { EmptyCart } from './_components/empty-cart';
import CustomScript from './_components/js/customScript';

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

export default async function CartPage({ params: { locale } }: Props) {
const cartId = cookies().get('cartId')?.value;

if (!cartId) {
return(
  <>
  <EmptyCart locale={locale} />;
  </>
)

}

const messages = await getMessages({ locale });
const Cart = messages.Cart ?? {};
const t = await getTranslations({ locale, namespace: 'Cart' });

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
    <EmptyCart locale={locale} />;
    </>
  )
}

const lineItems = [...cart.lineItems.physicalItems, ...cart.lineItems.digitalItems];

return (
  <>
<div className='cart_wrapper'>
  <p className="urgency-text">
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24">
      <path
        d="M12 0c-4.87 7.197-8 11.699-8 16.075 0 4.378 3.579 7.925 8 7.925s8-3.547 8-7.925c0-4.376-3.13-8.878-8-16.075zm5.696 14h-11.392c.723-2.816 2.779-6.094 5.696-10.429 2.917 4.335 4.973 7.613 5.696 10.429z">
      </path>
    </svg>
    Hurry up! Your cart is reserved for <span>09:14s</span>
  </p>
  <CustomScript />
  <div className="progress-box">
    <h2 className="threshold-text">
      You are only <span className="amount-left"></span> away from getting a <span style={{ color: '#83B993' }}>free
        delivery!</span>
    </h2>
    <div className="progress-bar">
      <div className="progress">
        <p className="start">0</p>
        <div className="bar" style={{ width: '65%' }}>
          <p className="percent">65%</p>
        </div>
        <p className="end">$99</p>
      </div>
    </div>
  </div>
  <div className="container">
  <nav aria-label="Breadcrumb">
      <ul className="flex flex-wrap items-center breadcrumbs">
        <li className="breadcrumb">
          <a
            className="hover:text-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 breadcrumb-link"
            href="/"
          >
            Home
          </a>
        </li>
        <span className="arrw-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={20}
            height={20}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-chevron-right"
            aria-hidden="true"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </span>
        <li className="breadcrumb">
          <a
            className="hover:text-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 breadcrumb-link"
            aria-current="page"
            href="/cart/"
          >
            Your Cart
          </a>
        </li>
      </ul>
  </nav>

    <div className="title-contact-box">
      <h1 className="page-heading">{t('heading')}</h1>
      <div className="contact-box">Have a question? Call us <br />
        <a href='tel:+15862571686'><svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 18 18"
            width="18px" fill="currentColor">
            <title>Phone Icon</title>
            <path
              d="M3.6,7.8 C5,10.6 7.4,12.9 10.2,14.4 L12.4,12.2 C12.7,11.9 13.1,11.8 13.4,12 C14.5,12.4 15.7,12.6 17,12.6 C17.6,12.6 18,13 18,13.6 L18,17 C18,17.6 17.6,18 17,18 C7.6,18 0,10.4 0,1 C0,0.4 0.4,0 1,0 L4.5,0 C5.1,0 5.5,0.4 5.5,1 C5.5,2.2 5.7,3.4 6.1,4.6 C6.2,4.9 6.1,5.3 5.9,5.6 L3.6,7.8 L3.6,7.8 Z" />
          </svg>586-257-1686</a>
      </div>
    </div>
    <div className="bottom-title">
      <p className="shipping-text">{t('shippingText')}</p>
      <div className="cart-actions checkout-btn top-checkout-btn">
        <a className='button button--primary checkout-btn' href="/checkout"><svg xmlns="http://www.w3.org/2000/svg"
            fill="#000000" viewBox="0 0 50 50" width="50px" height="50px">
            <path
              d="M 25 3 C 18.363281 3 13 8.363281 13 15 L 13 20 L 9 20 C 7.300781 20 6 21.300781 6 23 L 6 47 C 6 48.699219 7.300781 50 9 50 L 41 50 C 42.699219 50 44 48.699219 44 47 L 44 23 C 44 21.300781 42.699219 20 41 20 L 37 20 L 37 15 C 37 8.363281 31.636719 3 25 3 Z M 25 5 C 30.566406 5 35 9.433594 35 15 L 35 20 L 15 20 L 15 15 C 15 9.433594 19.433594 5 25 5 Z M 25 30 C 26.699219 30 28 31.300781 28 33 C 28 33.898438 27.601563 34.6875 27 35.1875 L 27 38 C 27 39.101563 26.101563 40 25 40 C 23.898438 40 23 39.101563 23 38 L 23 35.1875 C 22.398438 34.6875 22 33.898438 22 33 C 22 31.300781 23.300781 30 25 30 Z">
            </path>
          </svg>Proceed to secure checkout</a>
      </div>
    </div>

    <div className="pb-12 md:grid md:grid-cols-2 md:gap-8 lg:grid-cols-3 cart_wrap">
      <ul className="col-span-2">
        {lineItems.map((product) => (
          <CartItem currencyCode={cart.currencyCode} key={product.entityId} product={product} />
        ))}
      <div className="cart-actions continue-shopping-btn">
        <a
          className="whatever-your-class-is"
          href="{{urls.home}}"
          title="{{lang 'cart.continue_shopping'}}"
          onClick={() => window.location.href = 'https://www.incognitoconcealment.com/'}
        >
          continue shopping
        </a>
      </div>
      </ul>

      <div className="col-span-1 col-start-2 lg:col-start-3 rgt_cart_panel">
        {checkout &&
        <CheckoutSummary data={checkout} />}

        <NextIntlClientProvider locale={locale} messages={{ Cart }}>
          <CheckoutButton cartId={cartId} />
        </NextIntlClientProvider>

        <div className="info-wrapper">
          <a href="javascript:;" className="info-box return-box">
            <img src="https://cdn11.bigcommerce.com/s-jmxj53crq/content/images/return1.png" />
            <p>Refunds/Returns</p>
          </a>
          <a href="javascript:;" className="info-box warranty-box">
            <img src="https://cdn11.bigcommerce.com/s-jmxj53crq/content/images/warranty.png" />
            <p>Lifetime Warranty</p>
          </a>
          <a href="javascript:;" className="info-box verified-box">
            <img src="https://cdn11.bigcommerce.com/s-jmxj53crq/content/images/money-back.png" />
            <p>30 Day Money Back Guarantee</p>
          </a>
        </div>

      </div>
    </div>
  </div>
  

</div>

  {/*cart page popup*/}
  <div className="returns-popup popup-box">
    <div className="popup-content">
      <a href="javascript:;" className="close">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>

      </a>
      <h3>Refunds/Returns</h3>
      <p>
        <span id="docs-internal-guid-d7a63f67-7fff-79b5-9f3c-e7d7ab5c3f08">
          <span>
            The majority of Incognito Concealment holsters are made at the time
            of order to the exact specifications and preferences chosen by the
            customer. Because of this, we do not accept returns or issue refunds
            on items that were made correctly according to the customer's order
            form. An order may be canceled up to 24 hours after it is placed,
            provided that production has not already begun. If you would like to
            cancel an order, the request must be sent in writing via email.
            Please include your name, phone number, order number, and reason for
            cancelation in the email.&nbsp; Cancelation requests must be emailed
            to:{" "}
          </span>
          <a href="mailto:sales@incognitoconcealment.com">
            <span>sales@incognitoconcealment.com</span>
          </a>
          <span>. Custom orders returned or canceled after the 24 hour period are
            done so at our discretion and may be subject to a 50% restocking
            fee. Shipping will be arranged and paid for by the customer. By
            placing an order with us, you are consenting to our terms and
            conditions, to include our return and cancelation policy.
          </span>
        </span>
      </p>
      <ul>
        <li>
          Gift Cards, Apparel, Body Armor and not eligible for refunds or
          returns.
        </li>
      </ul>
    </div>
  </div>
  <div className="warranty-popup popup-box">
    <div className="popup-content">
      <a href="javascript:;" className="close">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>

      </a>
      <h3>Lifetime Warranty</h3>
      <p>
        Incognito Concealment offers a Lifetime Warranty on all of our holsters
        for the original owner for manufacturer defects. If you feel your
        product is defective, broken, or does not fit correctly, please contact
        us via phone at <a href="tel:(586) 257-1686">(586) 257-1686</a> or email
        at{" "}
        <a href="mailto:sales@incognitoconcealment.com">
          <span>sales@incognitoconcealment.com</span>
        </a>
        . We may request photos or videos for further clarification of the
        issue. If we deem the product to be damaged or defective from the
        factory, we will issue repairs as necessary, up to and including
        completely replacing your product as well as paying return shipping.
      </p>
    </div>
  </div>
  <div className="verified-popup popup-box">
    <div className="popup-content">
      <a href="javascript:;" className="close">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>

      </a>
      <h3>30 Day Money Back Guarantee</h3>
      <p>
        We offer a 30 day money back guarantee on our quick ship inventory items
        because we believe in our products. Reference our page of quick ship
        items <a href="/quick-ship-products">here</a>. These items are eligible
        for return or exchange if you are dissatisfied with them for any reason.
        This does not include shipping to or from shipping costs. We do not sell
        used holsters so if the product has been damaged it will not be eligible
        for return.{" "}
      </p>
    </div>
  </div>

</>
);
}

export const runtime = 'edge';