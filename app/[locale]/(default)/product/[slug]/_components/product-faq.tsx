// components/ProductFAQ.tsx
import React from 'react';
import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';

interface CustomField {
  entityId: number;
  name: string;
  value: string;
}

interface ProductFAQProps {
  customFields: {
    edges: Array<{
      node: CustomField;
    }>;
  };
}

const ProductFAQ: React.FC<ProductFAQProps> = ({ customFields }) => {
  const fields = removeEdgesAndNodes(customFields);
  const holsterType = fields.find(field => field.name === 'Holster Type')?.value;

  const getFAQContent = (type: string) => {
    switch (type) {
        case 'Standard IWB':
          return (
            <div className="faq">
              <p><b>Q: What is the appendix modwing?</b><br/>A: It puts tension on the back of the belt or pants, drawing the grip of the gun into the body tighter, reducing printing. It is most effective when carried appendix or at the 5 o'clock position.</p>
              <p><b>Q: What is the difference between the Discreet clip and the 1.5/1.75 belt clips?</b><br/>A: The Discreet clip is our go to for any IWB holster. It is much lower profile than any plastic clip, it bites way harder and even works without a belt.</p>
            </div>
          );
        case 'Standard OWB':
          return (
            <div className="faq">
              <p><b>Q: Is this holster concealable?</b><br/> A: Yes, it is the most concealable OWB holster on the market.</p>
              <p><b>Q: Should I run clips or loops?</b> <br/> A: It comes down to preference</p>
            </div>
          );
        case 'Quick Draw OWB':
          return (
            <div className="faq">
              <p><b>Q: What is the purpose of the quick draw holster?</b><br/>A: It is often used by IDPA & USPA shooters that want to be able to conceal while draw as fast as possible.</p>
              <p><b>Q: What is the Tek-Lok?</b><br/>A: It is a belt attachment that can accommodate belts up to 2.25" with adjustable shims.</p>
            </div>
          );
        case 'Single IWB Mag Carrier':
          return (
            <div className="faq">
              <p><b>Q: Can it be worn on the outside as well?</b><br/> A: Yes.</p>
            </div>
          );
        case 'Single OWB Mag Carrier':
        case 'Double OWB Mag Carrier':
          return (
            <div className="faq">
              <p><b>Q: Should I run clips or loops?</b><br/> A: We prefer clips for mag carriers due to the convenience factor of daily on and off.</p>
            </div>
          );
        case 'Paddle':
          return (
            <div className="faq">
              <p><b>Q: Is the paddle secure?</b> <br/> A: Yes, it has teeth that catch under the belt or waistline.</p>
              <p><b>Q: Is the paddle concealable?</b><br/> A: Yes, with the correct clothing. Button down shirts help considerably.</p>
            </div>
          );
        case 'Level 2 OWB':
          return (
            <div className="faq">
              <p><b>Q: What does Level 2 mean?</b><br/>A: Two levels of retention being the passive retention of the holster and an additional locking mechanism such as a hood, thumb release etc. Level 2 is often required for Security and Law Enforcement purposes.</p>
              <p><b>Q: What is the QLS for?</b><br/>A: It is a Quick Locking System designed by Safariland to allow the interchange of holsters between different attachments such as Belt to Drop Leg.</p>
              <p><b>Q: Which attachment should I use?</b><br/>A: It depends on the draw height you desire. If you did desire a lower height then go with the drop leg. Medium height go with UBL Low. Highest height go with the UBL Mid.</p>
            </div>
          );
        default:
          return null;
    }
  };

  if (!holsterType) {
    return null;
  }

  const faqContent = getFAQContent(holsterType);

  return faqContent ? (
    <>
    <div className="tab-content" id="tab-faq">
    <div className="product-faq">
      {faqContent}
    </div>
    </div>
    </>
  ) : null;
};

export default ProductFAQ;