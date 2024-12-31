import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import Disbanner from './discount-banner-new.png';

export const DiscountBanner = () => {
  return (
    <div className="home-banner">
      <div className="banners" data-banner-location="bottom">
        <div className="banner" data-event-type="promotion" data-entity-id="2" data-name="Home Banner" data-position="bottom">
          <div data-event-type="promotion-click">
            <p>
              <Link href="https://www.incognitoconcealment.com/discounts-on-gun-holsters" passHref>
                  <Image
                    className="__mce_add_custom__ lazyloaded"
                    title="Discount Banner"
                    alt="Discount Banner"
                    width={2001}
                    height={358}
                    src={Disbanner}
                  />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

