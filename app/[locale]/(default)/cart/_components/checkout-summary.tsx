import { NextIntlClientProvider } from 'next-intl';
import { getFormatter, getLocale, getMessages, getTranslations } from 'next-intl/server';

import { FragmentOf, graphql } from '~/client/graphql';

import { CouponCode } from './coupon-code';
import { CouponCodeFragment } from './coupon-code/fragment';
import { ShippingEstimator } from './shipping-estimator';
import { ShippingEstimatorFragment } from './shipping-estimator/fragment';
import { getShippingCountries } from './shipping-estimator/get-shipping-countries';

const MoneyFieldsFragment = graphql(`
  fragment MoneyFields on Money {
    currencyCode
    value
  }
`);

export const CheckoutSummaryFragment = graphql(
  `
    fragment CheckoutSummaryFragment on Checkout {
      ...ShippingEstimatorFragment
      ...CouponCodeFragment
      subtotal {
        ...MoneyFields
      }
      grandTotal {
        ...MoneyFields
      }
      taxTotal {
        ...MoneyFields
      }
      cart {
        currencyCode
        discountedAmount {
          ...MoneyFields
        }
      }
    }
  `,
  [MoneyFieldsFragment, ShippingEstimatorFragment, CouponCodeFragment],
);

interface Props {
  data: FragmentOf<typeof CheckoutSummaryFragment>;
}

export const CheckoutSummary = async ({ data }: Props) => {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'Cart.CheckoutSummary' });
  const format = await getFormatter({ locale });
  const messages = await getMessages({ locale });

  const shippingCountries = await getShippingCountries();
  const { cart, grandTotal, subtotal, taxTotal } = data;

  return (
    <>
      <div className="flex justify-between py-4 border-t border-t-gray-200 subtotal">
        <span className="font-semibold label">{t('subTotal')}</span>
        <span className="value">
          {format.number(subtotal?.value || 0, {
            style: 'currency',
            currency: cart?.currencyCode,
          })}
        </span>
      </div>

      <NextIntlClientProvider locale={locale} messages={{ Cart: messages.Cart ?? {} }}>
        {shippingCountries.length > 0 ? (
          <ShippingEstimator checkout={data} shippingCountries={shippingCountries} />
        ) : (
          <div className="py-4 text-red-600 ship-unavailabel">
            {t('shippingCountriesUnavailable')}
          </div>
        )}
      </NextIntlClientProvider>

      {cart?.discountedAmount && (
        <div className="flex justify-between py-4 border-t border-t-gray-200 discount">
          <span className="font-semibold label">{t('discounts')}</span>
          <span className="value">
            -
            {format.number(cart.discountedAmount.value, {
              style: 'currency',
              currency: cart.currencyCode,
            })}
          </span>
        </div>
      )}

      <NextIntlClientProvider locale={locale} messages={{ Cart: messages.Cart ?? {} }}>
        <CouponCode checkout={data} />
      </NextIntlClientProvider>

      {taxTotal && (
        <div className="flex justify-between py-4 border-t border-t-gray-200 tax">
          <span className="font-semibold label">{t('tax')}</span>
          <span className="value">
            {format.number(taxTotal.value, {
              style: 'currency',
              currency: cart?.currencyCode,
            })}
          </span>
        </div>
      )}

      <div className="flex justify-between py-4 text-xl font-bold border-t border-t-gray-200 lg:text-2xl cart-total-grandTotal">
        <span className="label">{t('grandTotal')}</span>
        <span className='value'>
          {format.number(grandTotal?.value || 0, {
            style: 'currency',
            currency: cart?.currencyCode,
          })}
        </span>
      </div>
    </>
  );
};
