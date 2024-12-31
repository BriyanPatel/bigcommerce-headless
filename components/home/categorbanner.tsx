import Image from 'next/image';
import Link from 'next/link';

import slidebg1 from './cate-img/iwb-holsters.webp';
import slidebg2 from './cate-img/owb-holsters.webp';
import slidebg3 from './cate-img/pistol-accessories.webp';
import slidebg4 from './cate-img/pistol-lights.webp';
import slidebg5 from './cate-img/edc.webp';
import slidebg6 from './cate-img/body-armor.webp';
import slidebg7 from './cate-img/mag-carriers.webp';
import slidebg8 from './cate-img/gun-belts-apparel.webp';
import slidebg9 from './cate-img/attachments.webp';
import slidebg10 from './cate-img/body-armor-alt.webp';

export default function Catebane() {
  return (
    <div className='cat-banner container'>
      <div className="grid-wrap" id="categoriesbanner">
        <div className="grid-row-outer">
          <div className="grid-item">
            <div className="grid-content">
              <Link href="/products/iwb-holsters">
                
                  <Image
                    src={slidebg1}
                    alt="IWB Holsters"
                    width={740}
                    height={280}
                    className="categoryImage"
                  />
              </Link>
              <div className="categoryText">
                <h5 className="categoryName">IWB Holsters</h5>
                <Link className="categoryShop" href="/products/iwb-holsters">
                  Shop Now
                </Link>
              </div>
            </div>
          </div>
          <div className="grid-item">
            <div className="grid-content">
              <Link href="/products/owb-holsters">
                
                  <Image
                    src={slidebg2}
                    alt="OWB Holsters"
                    width={740}
                    height={280}
                    className="categoryImage"
                  />
              </Link>
              <div className="categoryText">
                <h5 className="categoryName">OWB Holsters</h5>
                <Link className="categoryShop" href="/products/owb-holsters">
                  Shop Now
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="grid-row-outer">
          <div className="grid-row-inner">
            <div className="grid-inner-top">
              <div className="grid-item">
                <div className="grid-content">
                  <Link href="/pistol-optics">
                    
                      <Image
                        src={slidebg3}
                        alt="Pistol Accessories"
                        width={280}
                        height={280}
                        className="categoryImage"
                      />
                  </Link>
                  <div className="categoryText-top">
                    <h5 className="categoryName">Pistol Accessories</h5>
                    <Link className="categoryShop" href="/pistol-optics">
                      Shop Now
                    </Link>
                  </div>
                </div>
              </div>
              <div className="grid-item">
                <div className="grid-content">
                  <Link href="/products/streamlight-tlr-7a.html">
                    
                      <Image
                        src={slidebg4}
                        alt="Pistol Lights"
                        width={280}
                        height={280}
                        className="categoryImage"
                      />
                    
                  </Link>
                  <div className="categoryText-top">
                    <h5 className="categoryName">Pistol Lights</h5>
                    <Link className="categoryShop" href="/products/streamlight-tlr-7a.html">
                      Shop Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid-item">
              <div className="grid-content">
                <Link href="/edc">
                  
                    <Image
                      src={slidebg5}
                      alt="EDC"
                      width={580}
                      height={280}
                      className="categoryImage"
                    />
                  
                </Link>
                <div className="categoryText">
                  <h5 className="categoryName">EDC</h5>
                  <Link className="categoryShop" href="/edc">
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="grid-row-inner">
            <div className="grid-item body-armor-desktop">
              <div className="grid-content">
                <Link href="/products/body-armor">
                  
                    <Image
                      src={slidebg6}
                      alt="Body Armor"
                      width={300}
                      height={580}
                      className="categoryImage"
                    />
                  
                </Link>
                <div className="categoryText-top">
                  <h5 className="categoryName">Body Armor</h5>
                  <Link className="categoryShop" href="/products/body-armor">
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
            <div className="grid-item body-armor-mobile">
              <div className="grid-content">
                <Link href="/products/body-armor">
                  
                    <Image
                      src={slidebg10}
                      alt="Body Armor"
                      width={580}
                      height={280}
                      className="categoryImage"
                    />
                  
                </Link>
                <div className="categoryText">
                  <h5 className="categoryName">Body Armor</h5>
                  <Link className="categoryShop" href="/products/body-armor">
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="grid-row-inner">
            <div className="grid-item">
              <div className="grid-content">
                <Link href="/products/mag-carriers">
                  
                    <Image
                      src={slidebg7}
                      alt="Mag Carriers"
                      width={580}
                      height={280}
                      className="categoryImage"
                    />
                  
                </Link>
                <div className="categoryText">
                  <h5 className="categoryName">Mag Carriers</h5>
                  <Link className="categoryShop" href="/products/mag-carriers">
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
            <div className="grid-inner-top">
              <div className="grid-item">
                <div className="grid-content">
                  <Link href="/products/gun-belts-and-apparel">
                    
                      <Image
                        src={slidebg8}
                        alt="Gun Belts and Apparel"
                        width={280}
                        height={280}
                        className="categoryImage"
                      />
                    
                  </Link>
                  <div className="categoryText-top">
                    <h5 className="categoryName">Gun Belts and Apparel</h5>
                    <Link className="categoryShop" href="/products/gun-belts-and-apparel">
                      Shop Now
                    </Link>
                  </div>
                </div>
              </div>
              <div className="grid-item">
                <div className="grid-content">
                  <Link href="/products/attachments">
                    
                      <Image
                        src={slidebg9}
                        alt="Attachments"
                        width={280}
                        height={280}
                        className="categoryImage"
                      />
                    
                  </Link>
                  <div className="categoryText-top">
                    <h5 className="categoryName">Attachments</h5>
                    <Link className="categoryShop" href="/products/attachments">
                      Shop Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
