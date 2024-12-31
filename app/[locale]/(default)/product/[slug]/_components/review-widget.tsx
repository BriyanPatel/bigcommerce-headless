"use client";
import React, { useEffect } from 'react';

interface ReviewsWidgetProps {
  sku: string;
}

const ReviewsWidget: React.FC<ReviewsWidgetProps> = ({ sku }) => {
  useEffect(() => {
    // Load the external script
    const script = document.createElement('script');
    script.src = 'https://widget.reviews.co.uk/combined/dist.js?v1';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      // Initialize the widget once the script is loaded
      if ((window as any).ReviewsWidget) {
        new (window as any).ReviewsWidget('#ReviewsWidget', {
          store: 'www.incognitoconcealment.com',
          widget: 'combined-widget',
          color: "#fec600",
          options: {
            types: 'product_review',
            per_page: 20,
            product_review: {
              sku: sku,
            }
          }
        });
      }
    };

    // Clean up
    return () => {
      document.body.removeChild(script);
    };
  }, [sku]);

  return <div id="ReviewsWidget"></div>;
};

export default ReviewsWidget;