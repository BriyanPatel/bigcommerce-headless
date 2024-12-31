import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { PropsWithChildren } from 'react';

import { LocaleType } from '~/i18n';

import { AccountStatusProvider } from './_components/account-status-provider';
import { AccountTabs } from './_components/account-tabs';

const tabList = [
  'orders',
  'addresses',
  'wishlists',
  'recently-viewed',
  'settings',
] as const;

export type TabType = (typeof tabList)[number];

interface Props extends PropsWithChildren {
  params: { locale: LocaleType; tab?: TabType };
}

export default async function AccountTabLayout({ children, params: { locale, tab } }: Props) {
  unstable_setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'Account.Home' });

  const messages = await getMessages();

  return (
    <>
    <div className="pdp_breadcrumb">
      <div className="container"></div>
    </div>
    <div className="account-inner">
      <div className="container">
        <NextIntlClientProvider locale={locale} messages={{ Account: messages.Account ?? {} }}>
          <AccountStatusProvider>
            <h1 className="page-heading">{t('heading')}</h1>
            <AccountTabs activeTab={tab} tabs={[...tabList]}>
              {children}
            </AccountTabs>
          </AccountStatusProvider>
        </NextIntlClientProvider>
      </div>
    </div>
    </>
  );
}
