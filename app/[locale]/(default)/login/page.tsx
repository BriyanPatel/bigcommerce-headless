import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { client } from '~/client';
import { graphql } from '~/client/graphql';
import { revalidate } from '~/client/revalidate-target';
import { Link } from '~/components/link';
import { Button } from '~/components/ui/button';
import { LocaleType } from '~/i18n';

import { ChangePasswordForm } from './_components/change-password-form';
import { LoginForm } from './_components/login-form';
import { ResetPasswordForm } from './_components/reset-password-form';
import { ResetPasswordFormFragment } from './_components/reset-password-form/fragment';

import BannerBottom from '~/components/home/banner-bottom';
export const metadata = {
  title: 'Login',
};

const LoginPageQuery = graphql(
  `
    query LoginPageQuery {
      site {
        settings {
          reCaptcha {
            ...ResetPasswordFormFragment
          }
        }
      }
    }
  `,
  [ResetPasswordFormFragment],
);

interface Props {
  params: {
    locale: LocaleType;
  };
  searchParams: {
    [key: string]: string | string[] | undefined;
    action?: 'create_account' | 'reset_password' | 'change_password';
    c?: string;
    t?: string;
  };
}

export default async function Login({ params: { locale }, searchParams }: Props) {
  const messages = await getMessages({ locale });
  const Account = messages.Account ?? {};
  const t = await getTranslations({ locale, namespace: 'Account.Login' });
  const action = searchParams.action;
  const customerId = searchParams.c;
  const customerToken = searchParams.t;

  const { data } = await client.fetch({
    document: LoginPageQuery,
    fetchOptions: { next: { revalidate } },
  });

  if (action === 'change_password' && customerId && customerToken) {
    return (
      <div className="max-w-4xl mx-auto my-6">
        <h2 className="page-heading">{t('changePasswordHeading')}</h2>
        <NextIntlClientProvider locale={locale} messages={{ Account }}>
          <ChangePasswordForm customerId={customerId} customerToken={customerToken} />
        </NextIntlClientProvider>
      </div>
    );
  }

  if (action === 'reset_password') {
    return (
      <div className="forgotpassword-page">
        <div className="container">
          <h2 className="page-heading">{t('resetPasswordHeading')}</h2>
          <NextIntlClientProvider locale={locale} messages={{ Account }}>
            <ResetPasswordForm reCaptchaSettings={data.site.settings?.reCaptcha} />
          </NextIntlClientProvider>
        </div>
        <BannerBottom />
      </div>
    );
  }

  return (
    <>
    <div className="login-page">
      <div className="container">
        <h2 className="page-heading">{t('heading')}</h2>
        <div className="login-row">
          <NextIntlClientProvider locale={locale} messages={{ Account }}>
            <LoginForm />
          </NextIntlClientProvider>
          <div className="new-customer">
            <div className="panel">
              <div className="panel-header">
                <h2 className="panel-title">{t('CreateAccount.heading')}</h2>
              </div>
              <p className="new-customer-intro">{t('CreateAccount.accountBenefits')}</p>
              <ul className="new-customer-fact-list">
                <li className='new-customer-fact'>{t('CreateAccount.fastCheckout')}</li>
                <li className='new-customer-fact'>{t('CreateAccount.multipleAddresses')}</li>
                <li className='new-customer-fact'>{t('CreateAccount.ordersHistory')}</li>
                <li className='new-customer-fact'>{t('CreateAccount.ordersTracking')}</li>
                <li className='new-customer-fact'>{t('CreateAccount.wishlists')}</li>
              </ul>
              <Button asChild className="items-center px-8 py-2 w-fit hover:text-white">
                <Link className='button' href="/login/register-customer">{t('CreateAccount.createLink')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <BannerBottom />
    </>
  );
}

export const runtime = 'edge';
