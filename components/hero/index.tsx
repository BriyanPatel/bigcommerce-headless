import Image from 'next/image';
import { Button } from '~/components/ui/button';
import {
  Slideshow,
  SlideshowContent,
  SlideshowControls,
  SlideshowNextIndicator,
  SlideshowPreviousIndicator,
  SlideshowSlide,
} from '~/components/ui/slideshow';

import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import { client } from '~/client';
import { graphql } from '~/client/graphql';
import { revalidate } from '~/client/revalidate-target';

const OrdersQuery = graphql(`
  query {
    site {
      content {
        banners {
          homePage {
            edges {
              node {
                entityId
                name
                content
                location
              }
            }
          }
        }
      }
    }
  }
`);

export const Hero = async () => {
  const { data } = await client.fetch({
    document: OrdersQuery,
    fetchOptions: { next: { revalidate } },
  });

  const rawOrdersData = data?.site?.content?.banners?.homePage
    ? removeEdgesAndNodes(data.site.content.banners.homePage)
    : [];

  return (
    <Slideshow>
      <SlideshowContent>
        {rawOrdersData.map((imageData) => (
          <SlideshowSlide key={imageData.entityId}>
            <div className="relative">
              <div
                className="slider-content flex flex-col px-12 pb-48 pt-36"
                dangerouslySetInnerHTML={{ __html: imageData.content }}
              />
            </div>
          </SlideshowSlide>
        ))}
      </SlideshowContent>
      <SlideshowControls>
        <SlideshowPreviousIndicator />
        <SlideshowNextIndicator />
      </SlideshowControls>
    </Slideshow>
  );
};
