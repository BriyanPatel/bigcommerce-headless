import Link from 'next/link';
import React from 'react';

export const AboutUs = () => {
  return (
    <div className="home-top">
      <div className="container">
        <div className="banners">
          <div className="banner">
            <div className="home-text-full">
              <div className="home-video-txt">
                <h2 className="page-heading">About Our Products</h2>
                <p>
                  Incognito Concealment was founded to fulfill one mission: To create the best concealed carry gun holsters and magazine carriers on the market. Every gun holster we sell is built to offer the best combination of durability, concealability, and comfort for people of all body types.
                </p>
                <h3>A Holster For Any Situation</h3>
                <p>
                  Whether you're looking for a concealment holster for your carry pistols or a duty holster for a full-size handgun, we have suitable holsters for men &amp; women.
                </p>
                <p>
                  Our Kydex holsters are made according to the company's three guiding principles: Dependable, Practical, Incognito. Our product range consists of a wide variety of holsters and mag carriers. All of which are hand-crafted here in the United States at our state-of-the-art facility.
                </p>
                <p>
                  We make our holsters out of Kydex, an affordable yet lightweight and highly durable thermoplastic material. This material allows us to produce gun holsters with superior security, protection, and retention for your handguns and magazines.
                </p>
              </div>
            </div>
            <div className="video-text-box">
              <div className="home-video">
                <iframe
                  id="player"
                  type="text/html"
                  width="611"
                  height="570"
                  frameBorder="0"
                  title="Incognito Concealment Brand Video"
                  webkitAllowFullScreen
                  mozAllowFullScreen
                  allowFullScreen
                  className="lazyloaded"
                  loading="lazy"
                  src="https://www.youtube.com/embed/xuqkUQDgmck?rel=0&loop=1"
                ></iframe>
              </div>
              <div className="home-video-txt">
                <h3>Firearm Holsters - Over 100 Handgun Models to Choose From</h3>
                <p>
                  Browse our gun holster inventory and choose from an extensive selection of models compatible with <Link href="https://www.incognitoconcealment.com/search-by-gun" target="_blank">over 100 handgun models</Link> by more than 15 popular manufacturers, including Beretta, FN Herstal, Glock, Heckler &amp; Koch, Sig Sauer, Smith &amp; Wesson, Taurus, and many more. We also offer a wide range of compatibility for pistols with lights, lasers, and optics.
                </p>
                <p>
                  If we don't offer gun holsters for the handgun model you're looking for on our site, we can make it for you. Send us a request using our <Link href="https://www.incognitoconcealment.com/gun-model-request">gun model request form</Link>, or give us a call and we can write it up over the phone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
