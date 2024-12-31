import React from 'react';
import dynamic from 'next/dynamic';
import OrderComp from './Order'

interface OrderDetailsProps {
  order: {
    entityId: string;
    status: string;
    orderedAt: string;
    totalIncTax: { value: number; currencyCode: string };
    paymentMethod: string;
    items: Array<{
      name: string;
      price: number;
      quantity: number;
      customMessage?: string;
      imageUrl?: string;
      currency: string;
      productOptions: any;
    }>;
    subTotal: { value: number; currencyCode: string };
    shippingDetails: {
      shippingCost: { value: number; currencyCode: string };
    };
    shippingAddress: Address;
    billingAddress: Address;
    comments?: string;
  };
}

interface Address {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  stateOrProvince: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
}


const OrderDetails: React.FC<OrderDetailsProps> = (order: any) => {

  return (
     <OrderComp order={order} />
  );
};

export default OrderDetails;