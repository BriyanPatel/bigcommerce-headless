import React from 'react';
import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';

interface CustomField {
  entityId: number;
  name: string;
  value: string;
}

interface CustomFieldsProps {
  customFields: {
    edges: Array<{
      node: CustomField;
    }>;
  };
}

const CustomFields: React.FC<CustomFieldsProps> = ({ customFields }) => {
  const fields = removeEdgesAndNodes(customFields);

  if (!fields || fields.length === 0) {
    return null;
  }

  const holsterType = fields.find(field => field.name === 'Holster Type')?.value;

  const getBenefits = (type: string) => {
    switch (type) {
      case 'Standard IWB':
        return ['Comfortable Minimal Design', 'Full Sweat Shield', 'Adjustable Retention', 'Durable', 'Secure'];
      case 'Standard OWB':
        return ['Curved to fit flush with hip', 'Extremely concealable', 'Low profile design', 'Comfortable', 'Adjustable Retention'];
      case 'Quick Draw OWB':
        return ['Perfect for IDPA, USPSA or 3 gun.', 'Speed cut for a faster draw', 'Equipped with a Tek-Lok', 'Ridged durable design'];
      case 'Single IWB Mag Carrier':
      case 'Single IWB Mag':
        return ['Minimal design', 'Adjustable Retention', 'Comfortable'];
      case 'Single OWB Mag Carrier':
      case 'Single OWB Mag':
        return ['One extra backup magazine', 'Low profile', 'Comfortable', 'Adjustable retention'];
      case 'Double OWB Mag Carrier':
      case 'Double OWB Mag':
        return ['Increases carrying capacity', 'Curves to shape of hip', 'Adjustable retention'];
      case 'Paddle':
        return ['Easy on and off', 'Extremely comfortable'];
      case 'Level 2 OWB':
        return ['Extremely durable and secure', 'multiple attachment options', 'Works well with carrying a rifle and wearing a plate carrier'];
      default:
        return [];
    }
  };

  const benefits = holsterType ? getBenefits(holsterType) : [];

  return (
    <>
    <div>
      {benefits.length > 0 &&    (
        <ul className="pdp-custom-fields">
          {benefits.map((benefit, index) => (
            <li key={index}>{benefit}</li>
          ))}
        </ul>
      )}
      </div>
    </>
  );
};

export default CustomFields;