import { FragmentOf, graphql } from '~/client/graphql';
import { Footer as ComponentsFooter, FooterSection } from '~/components/ui/footer';

import { StoreLogo, StoreLogoFragment } from '../store-logo';

import { ContactInformation, ContactInformationFragment } from './contact-information';
import { Copyright, CopyrightFragment } from './copyright';
import {
  // BrandFooterMenu,
  BrandsFooterMenuFragment,
  CategoryFooterMenu,
  CategoryFooterMenuFragment,
} from './footer-menus';
import { WebPageFooterMenu, WebPageFooterMenuFragment } from './footer-menus/web-page-footer-menu';
import { PaymentMethods } from './payment-methods';
import { SocialIcons, SocialIconsFragment } from './social-icons';
import { Link } from 'lucide-react';
import FooterUserLinks from './footer-menus/footer-user-links'
import FooterNewsletter from './footer-menus/footernewsletter'

export const FooterFragment = graphql(
  `
    fragment FooterFragment on Site {
      settings {
        ...ContactInformationFragment
        ...CopyrightFragment
        ...SocialIconsFragment
        ...StoreLogoFragment
      }
      content {
        ...WebPageFooterMenuFragment
      }
      brands(first: 5) {
        ...BrandsFooterMenuFragment
      }
      ...CategoryFooterMenuFragment
    }
  `,
  [
    BrandsFooterMenuFragment,
    CategoryFooterMenuFragment,
    ContactInformationFragment,
    CopyrightFragment,
    SocialIconsFragment,
    StoreLogoFragment,
    WebPageFooterMenuFragment,
  ],
);

interface Props {
  data: FragmentOf<typeof FooterFragment>;
}

export const Footer = ({ data }: Props) => {
  return (
    <ComponentsFooter>
      <FooterSection className="flex flex-col gap-8 py-10 md:flex-row lg:gap-4">
        <div className="ftr_wrapper">
         
          <div className="ftr_column ftr_column-1">
            <h4 className='ftr_title'>Social Media</h4>
              {data.settings && <SocialIcons data={data.settings} />}
            </div>

            <div className="ftr_column ftr_column-2">
              <CategoryFooterMenu data={data.categoryTree} />
            </div>

            <div className="ftr_column ftr_column-3">
                <WebPageFooterMenu data={data.content} />
            </div>

            <div className="ftr_column ftr_column-4">
              <FooterUserLinks />
              <h4 className='ftr_title ftr_titlt_add'>Address</h4>
              {data.settings && <ContactInformation data={data.settings} />}
            </div>

            <div className="ftr_column ftr_column-5">
                <FooterNewsletter />
                <PaymentMethods />
            </div>
          </div>
         



        {/* <nav className="grid flex-auto auto-cols-fr gap-8 sm:grid-flow-col">
          
          <BrandFooterMenu data={data.brands} />
          <WebPageFooterMenu data={data.content} />
        </nav> */}
     
      </FooterSection>

      <FooterSection className="flex flex-col justify-between gap-10 sm:flex-row sm:gap-8 sm:py-6">
      <div className='footer-copyright'>
          <div className="footer-logo">

              {data.settings && (
                <figure>
                  <StoreLogo data={data.settings} />
                </figure>
              )}
          </div>
          {data.settings && <Copyright data={data.settings} />}
      </div>
      </FooterSection>
    </ComponentsFooter>
  );
};
