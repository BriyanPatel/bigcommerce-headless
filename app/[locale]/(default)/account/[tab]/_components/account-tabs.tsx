'use client';

import { useTranslations } from 'next-intl';
import { PropsWithChildren } from 'react';

import { Link } from '~/components/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';

import { TabType } from '../layout';

interface Props extends PropsWithChildren {
  tabs: TabType[];
  activeTab?: TabType;
}

export const AccountTabs = ({ children, activeTab, tabs }: Props) => {
  const t = useTranslations('Account.Home');

  return (
    <Tabs activationMode="manual" defaultValue={activeTab}>
      <TabsList aria-label={t('accountTabsLabel')} className="justify-start pt-1 pb-3 mb-5 md:justify-center">
        {tabs.map((tab) => (
          <TabsTrigger asChild key={tab} value={tab}>
            <Link
              className="font-semibold whitespace-nowrap"
              href={`/account/${tab}`}
              prefetch="viewport"
              prefetchKind="full"
            >
              {tab === 'recently-viewed' ? t('recentlyViewed') : t(tab)}
            </Link>
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value={activeTab ?? ''}>{children}</TabsContent>
    </Tabs>
  );
};
