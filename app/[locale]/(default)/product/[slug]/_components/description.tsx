import { useTranslations } from 'next-intl';

import { FragmentOf, graphql } from '~/client/graphql';
import ProductFAQ from './product-faq';

export const DescriptionFragment = graphql(`
  fragment DescriptionFragment on Product {
    description
  }
`);

interface Props {
  product: FragmentOf<typeof DescriptionFragment>;
}

export const Description = ({ product }: Props) => {
  const t = useTranslations('Product.DescriptionAndReviews');

  if (!product.description) {
    return null;
  }

  return (
    <>
      <div id="tab-descriptions">
        <ul id="tabs" className="tabs_wrapper">
          <li data-title="description" className="tab is-active">
            <a className="tab-title" href="#tab-description">{t('description')}</a> 
          </li>
          <li data-title="tab-faq" className="tab">
            <a className="tab-title" href="#tab-faq">FAQs</a> 
          </li>
        </ul>
        <div className="tab-contents">
          <div className="tab-content is-active" id="tab-description">
            <h3>{t('description')}</h3>
            <div dangerouslySetInnerHTML={{ __html: product.description }} />
          </div>
          <ProductFAQ customFields={product.customFields} />
        </div>
        
      </div>
    </>
  );
};
