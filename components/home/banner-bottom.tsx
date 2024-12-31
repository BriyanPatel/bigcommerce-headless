// components/BannerBottom.tsx
"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Slider from 'react-slick';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import banner1 from './banner-bottom-img/custom-holsters.png';
import banner2 from './banner-bottom-img/quick-shipping.png';
import banner3 from './banner-bottom-img/lifetime-warranty.png';
import banner4 from './banner-bottom-img/law-enforcement.png';

interface BannerItem {
  image: any;
  alt: string;
  title: string;
  subtitle: string;
  className: string;
}

const BannerBottom: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: false,
    accessibility: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 568,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const bannerData: BannerItem[] = [
    { image: banner1, alt: "Custom holster", title: "CUSTOM HOLSTERS", subtitle: "HAND CRAFTED IN AMERICA", className: "custom-holsters" },
    { image: banner2, alt: "Quick shipping", title: "QUICK SHIPPING", subtitle: "Fast Shipping On All Orders", className: "quick-shipping" },
    { image: banner3, alt: "Lifetime warranty", title: "Lifetime Warranty", subtitle: "ON ALL PRODUCTS", className: "lifetime-warranty" },
    { image: banner4, alt: "Law enforcement", title: "Used by Law-enforcement", subtitle: "Military and Governments worldwide", className: "law-enforcement" }
  ];

  if (!isClient) {
    return null;  // or return a loading indicator
  }

  return (
    <div className="banner-btm">
      <div className="container">
        {isMobile ? (
          <Slider {...settings} className="banner-outer">
            {bannerData.map((item, index) => (
              <div key={index} className={`banner-box ${item.className}`}>
                <figure className="figure">
                  <span className="span">
                    <Image
                      src={item.image}
                      alt={item.alt}
                      width={40}
                      height={40}
                      layout="responsive"
                    />
                  </span>
                </figure>
                <h5>{item.title}</h5>
                <p>{item.subtitle}</p>
              </div>
            ))}
          </Slider>
        ) : (
          <div className="banner-outer">
            {bannerData.map((item, index) => (
              <div key={index} className={`banner-box ${item.className}`}>
                <figure className="figure">
                  <span className="span">
                    <Image
                      src={item.image}
                      alt={item.alt}
                      width={40}
                      height={40}
                      layout="responsive"
                    />
                  </span>
                </figure>
                <h5>{item.title}</h5>
                <p>{item.subtitle}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BannerBottom;
