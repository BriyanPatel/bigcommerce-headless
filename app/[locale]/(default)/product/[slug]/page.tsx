import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { Suspense, useEffect } from 'react';
import { Breadcrumbs } from '~/components/breadcrumbs';
import { LocaleType } from '~/i18n';

import { Description } from './_components/description';
import { Details } from './_components/details';
import { Gallery } from './_components/gallery';
import { RelatedProducts } from './_components/related-products';
import { Reviews } from './_components/reviews';
import { Warranty } from './_components/warranty';
import { getProduct } from './page-data';
import { ProductForm } from '~/components/product-form';
import { ProductPopUpForm } from '~/components/product-popup-form';
import CustomScript from './_components/js/customScript';
import ReviewsWidget from './_components/review-widget';
import BannerBottom from '~/components/home/banner-bottom';
 

interface ProductPageProps {
  params: { slug: string; locale: LocaleType };
  searchParams: Record<string, string | string[] | undefined>;
}

export async function generateMetadata({
  params,
  searchParams,
}: ProductPageProps): Promise<Metadata> {
  const productId = Number(params.slug);
  const optionValueIds = getOptionValueIds({ searchParams });

  const product = await getProduct({ entityId: productId, optionValueIds });

  if (!product) {
    return {};
  }

  const { pageTitle, metaDescription, metaKeywords } = product.seo;
  const { url, altText: alt } = product.defaultImage || {};

  return {
    title: pageTitle || product.name,
    description: metaDescription || `${product.plainTextDescription.slice(0, 150)}...`,
    keywords: metaKeywords ? metaKeywords.split(',') : null,
    openGraph: url
      ? {
          images: [
            {
              url,
              alt,
            },
          ],
        }
      : null,
  };
}

export default async function Product({ params, searchParams }: ProductPageProps) {
  const { locale } = params;
  unstable_setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'Product' });
  const messages = await getMessages({ locale });

  const productId = Number(params.slug);

  const optionValueIds = getOptionValueIds({ searchParams });

  const product = await getProduct({ entityId: productId, optionValueIds });

  const formatPrice = (price: number | undefined, currencyCode: string | undefined) => {
    if (price === undefined || currencyCode === undefined) {
      return '';
    }
  
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode,
      }).format(price);
    } catch (error) {
      console.error('Error formatting price:', error);
      return `${price} ${currencyCode}`;
    }
  };
  
  const getPriceDisplay = (product) => {
    
    if (product?.prices?.salePrice) {
      return (
        <>
       
          <span className="line-through original-price">
            {formatPrice(product.prices.basePrice?.value, product.prices.price?.currencyCode)}
          </span>
          <span className="text-red-600 sale-price">
            {formatPrice(product.prices.salePrice?.value, product.prices.price?.currencyCode)}
          </span>
        </>
      );
    }else{
      return (
          <span className="line-through original-price">
            {formatPrice(product.prices.price?.value, product.prices.price?.currencyCode)}
          </span>
         
      );
    }
    
  };

  if (!product) {
    return notFound();
  }
 
  const category = removeEdgesAndNodes(product.categories).at(0);
 
  return (
    <>
     <CustomScript />
     <div className="pdp_breadcrumb">
        <div className='container'>
          {category && <Breadcrumbs category={category} />}
        </div>
      </div>
      <div className="container mt-4 mb-12 lg:grid lg:grid-cols-2 lg:gap-8 pdp-main-wrapper">
        <NextIntlClientProvider locale={locale} messages={{ Product: messages.Product ?? {} }}>
          <Gallery noImageText={t('noGalleryText')} product={product} />
          <Details product={product} />
          <div className="lg:col-span-2">
            <Description product={product} />
            <Warranty product={product} />
            <Suspense fallback={t('loading')}>
              {/* <Reviews productId={product.entityId} /> */}
              <ReviewsWidget sku={product.sku} />

            </Suspense>
          </div>
        </NextIntlClientProvider>
      </div>
      {/* PDP pages Sticky Poduct Information START*/}
     
      <div id="stick-pr-info" className="fixed top-0 left-0 z-50 w-full pt-1 transition-all duration-500 bg-white shadow-md">
        <div className="container">
          <div className='flex justify-between mb-3 gap-x-8 stick-wrapper'>
            <div className='inline-flex items-center'>
              <div className='w-[100px] pr_img'> 
                <Gallery noImageText={t('noGalleryText')} product={product} />
              </div>
              <h2 className='font-bold text-[26px] font-oswald ml-4'>{product.name}</h2>
            </div>
            <div className='inline-flex flex-wrap items-center right-content'>
              <div className='inline-flex items-end btn-price-wrap'>  
                <div className="text-[#b80d0d] font-semibold text-[25px] leading-[1] mr-5">{getPriceDisplay(product)} </div>
                <button className="inline-flex items-center justify-center primary-btn open-pr-model" type="submit" id={product.entityId} value="Add to Cart"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-2 lucide lucide-shopping-cart" aria-hidden="true"><circle cx="8" cy="21" r="1"></circle><circle cx="19" cy="21" r="1"></circle><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path></svg> Add to Cart</button>
              </div>
              <div id="open-pr-model-form" className='hidden'>
                <div className="modal-wrapper">
                  <button id="modal-close"><svg aria-hidden="true" fill="none" focusable="false" height="1em" role="presentation" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="1em"><path d="M18 6L6 18M6 6l12 12"></path></svg></button>
                  <ProductPopUpForm product={product} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#eee] shadow-lg pdp-infobar-nav">
          <div className='container'>
            <ul className='flex flex-wrap items-center infobar-tabs tabs_wrapper'>
              <li data-title="description" className="tab">
                <a href="#tab-description" className='tab-title inline-flex py-3 px-6 text-[#888] text-[17px] font-bold transition-all duration-500 hover:bg-[#ddd] border-b-2 border-solid border-transparent'>Product Description</a>
              </li>
              <li data-title="tab-review-widget" className="tab-review">
                <a href="#ReviewsWidget" className='tab-title inline-flex py-3 px-6 text-[#888] text-[17px] font-bold transition-all duration-500 hover:bg-[#ddd] border-b-2 border-solid border-transparent'>Reviews</a>
              </li>
              <li data-title="tab-faq" className="tab">
                <a href="#tab-faq" className='tab-title inline-flex py-3 px-6 text-[#888] text-[17px] font-bold transition-all duration-500 hover:bg-[#ddd] border-b-2 border-solid border-transparent'>FAQs</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* PDP pages Sticky Poduct Information END*/}

      <div className="related_product">
      <Suspense fallback={t('loading')}>
        <RelatedProducts productId={product.entityId} />
      </Suspense>
      </div>
      <BannerBottom />

      
    </>
  );
}

function getOptionValueIds({ searchParams }: { searchParams: ProductPageProps['searchParams'] }) {
  const { slug, ...options } = searchParams;

  return Object.keys(options)
    .map((option) => ({
      optionEntityId: Number(option),
      valueEntityId: Number(searchParams[option]),
    }))
    .filter(
      (option) => !Number.isNaN(option.optionEntityId) && !Number.isNaN(option.valueEntityId),
    );
}

export const runtime = 'edge';
