'use client';

import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';

import { FragmentOf } from '~/client/graphql';
import { BcImage } from '~/components/bc-image';
import {
  Gallery as ComponentsGallery,
  GalleryContent,
  GalleryControls,
  GalleryImage,
  GalleryThumbnail,
  GalleryThumbnailItem,
  GalleryThumbnailList,
} from '~/components/ui/gallery';

import { GalleryFragment } from './fragment';
import {ZoomableImage} from '~/components/product-zoom/zoomableImage';
interface Props {
  product: FragmentOf<typeof GalleryFragment>;
  noImageText?: string;
}

export const Gallery = ({ product, noImageText }: Props) => {
  
  const images = removeEdgesAndNodes(product?.images?.edges);
 
  let imagess = product?.images?.edges || [];

// Filter out entries without a node
imagess = imagess.filter(image => image && image.node);

  // Pick the top-level default image
  
  const topLevelDefaultImg = imagess.findIndex((image) => {
    if(image.node)
    return image.node.isDefault;
  });
  // If product.defaultImage exists, and product.defaultImage.url is not equal to the url of the isDefault image in images,
  // mark the existing isDefault image to "isDefault = false" and append the correct default image to images
  if (product.defaultImage && topLevelDefaultImg?.url !== product.defaultImage.url) {
    imagess.forEach((image) => {
      if(image.node)
      image.node.isDefault = false;
    });
  }

  const defaultImageIndex = imagess.findIndex((image) => {
    
    if (image.node && image.node.url) {
      const validExtensions = ['.png', '.jpg', '.jpeg'];
      const hasValidExtension = validExtensions.some(ext => image.node.url.toLowerCase().endsWith(ext));
      return image.node.isDefault && hasValidExtension;
    }
    return false;
  });
  
  const effectiveDefaultIndex = defaultImageIndex !== -1 ? defaultImageIndex : 0;

    // If you need to actually modify the images array:
    if (defaultImageIndex === -1 && imagess.length > 0) {
      imagess[0].node.isDefault = true;
    }
    
  return (
    <div className="pr_left">
      <div className="lg:sticky lg:top-0">
     
        <ComponentsGallery defaultImageIndex={effectiveDefaultIndex} images={imagess}>
          <GalleryContent>
            <GalleryImage>
              {({ selectedImage }) =>
                selectedImage ? (
                  <>
                   <BcImage
                     alt={selectedImage.node.altText}
                     className="object-contain w-full h-full test"
                     fill
                     priority={true}
                     sizes="(min-width: 1024px) 50vw, 100vw"
                     src={selectedImage.node.url}
                  />
                  <ZoomableImage
                    src={selectedImage.node.url}
                    alt={selectedImage.node.altText || product.name}
                 
                  />
             
                  </>
                ) : (
                  <div className="flex items-center justify-center bg-gray-200 aspect-square no-image">
                    <div className="text-base font-semibold text-center text-gray-500">
                      {noImageText ?? 'Coming soon'}
                    </div>
                  </div>
                )
              }
            </GalleryImage>
            <GalleryControls />
          </GalleryContent>
          <GalleryThumbnailList className="px-6 sm:px-1">
          {imagess.map((image, index) => {
            if (image.node) {
              return (
                <GalleryThumbnailItem imageIndex={index} key={image.node.url}>
                  <GalleryThumbnail asChild>
                    <BcImage 
                      alt={image.node.altText} 
                      priority={true} 
                      src={image.node.url} 
                    />
                  </GalleryThumbnail>
                </GalleryThumbnailItem>
              );
            }
            return null; // Return null for items without a node
          })}
          </GalleryThumbnailList>
        </ComponentsGallery>
      </div>
    </div>
  );
};
