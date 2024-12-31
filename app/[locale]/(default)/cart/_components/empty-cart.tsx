import { getTranslations } from 'next-intl/server';

interface Props {
  locale: string;
}

export const EmptyCart = async ({ locale }: Props) => {
  const t = await getTranslations({ locale, namespace: 'Cart' });

  return (
    <div className="flex flex-col h-full">
      <h1 className="pb-6 text-4xl font-black lg:pb-10 lg:text-5xl">{t('heading')}</h1>
      <div className="flex flex-col items-center justify-center gap-6 py-20 border-t grow border-t-gray-200">
        <h2 className="text-xl font-bold lg:text-2xl">{t('empty')}</h2>
        <p className="text-center">{t('emptyDetails')}</p>
      </div>
    </div>
  );
};
