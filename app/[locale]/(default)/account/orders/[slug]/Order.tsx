"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import comingSoon from './comingSoon.jpg';
import AddressComponent from './AddressComponent';

const ActionButtons = dynamic(() => import('./ActionButtons'), { ssr: false });

interface ProductOption {
  name: string;
  value: string;
  optionEntityId: number;
  valueEntityId: number;
}

interface ProductOption {
  displayName: string;
  value: string;
}

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  customMessage?: string;
  imageUrl?: string;
  currency: string;
  selectedProductOptions: ProductOption[];
  productOptions: ProductOption[];
  valueIds: string;
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

interface OrderDetailsProps {
  order: {
    entityId: string;
    status: string;
    orderedAt: string;
    totalIncTax: { value: number; currencyCode: string };
    paymentMethod: string;
    items: OrderItem[];
    subTotal: { value: number; currencyCode: string };
    shippingDetails: {
      shippingCost: { value: number; currencyCode: string };
    };
    shippingAddress: Address;
    billingAddress: Address;
    comments?: string;
  };
}

const statusColors: { [key: string]: string } = {
  'Awaiting fulfillment': 'bg-yellow-100 text-yellow-800',
  'Processing': 'bg-blue-100 text-blue-800',
  'Completed': 'bg-green-100 text-green-800',
  'Cancelled': 'bg-red-100 text-red-800',
};

const OrderComp: React.FC<OrderDetailsProps> = (order: any) => {
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: boolean }>({});
  const [selectedItemOptions, setSelectedItemOptions] = useState<{ [key: string]: ProductOption[] }>({});

  const statusColor = statusColors[order.status] || 'bg-gray-100 text-gray-800';

  const formatPrice = (price: number, currencyCode: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(price);
  };

  const handleItemSelect = (item: OrderItem) => {
    
    const itemKey = item.valueIds 
  ? `${item.valueIds}-${item.name}` 
  : `${item.id}-${item.name}`;
    
    // Toggle item selection
    setSelectedItems(prev => ({
      ...prev,
      [itemKey]: !prev[itemKey]
    }));

    // If item is now selected, capture its product options
    if (!selectedItems[itemKey]) {
      setSelectedItemOptions(prev => ({
        ...prev,
        [itemKey]: item.selectedProductOptions || []
      }));
    } else {
      // If unselected, remove its options
      const newSelectedOptions = {...selectedItemOptions};
 
      delete newSelectedOptions[itemKey];
      
      
      setSelectedItemOptions(newSelectedOptions);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <nav className="text-sm font-medium mb-6" aria-label="Breadcrumb">
        <ol className="list-none p-0 inline-flex bg-white shadow-md rounded-lg">
          <li className="flex items-center">
            <Link href="/account" className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out">
              <span className="px-3 py-2">Account</span>
            </Link>
            <svg className="fill-current w-3 h-3 mx-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
              <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
            </svg>
          </li>
          <li className="flex items-center">
            <Link href="/account/orders" className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out">
              <span className="px-3 py-2">Orders</span>
            </Link>
            <svg className="fill-current w-3 h-3 mx-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
              <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
            </svg>
          </li>
          <li className="flex items-center">
            <span className="text-gray-800 px-3 py-2" aria-current="page">Order #{order.entityId}</span>
          </li>
        </ol>
      </nav>
      
      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Order #{order.entityId}</h1>
          <span className={`${statusColor} px-4 py-2 rounded-full text-sm font-semibold shadow-md`}>
            {order.status}
          </span>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Side */}
            <div className="lg:col-span-2 space-y-8">
              <section className="bg-gray-50 p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Order Contents</h2>
                <div className="space-y-6">
                  {order.items.map((item: any) => {
                    const itemKey = item.valueIds 
                    ? `${item.valueIds}-${item.name}` 
                    : `${item.id}-${item.name}`;
                    return (
                      <div key={itemKey} className="flex items-center bg-white p-4 rounded-lg shadow-sm">
                        <input
                          type="checkbox"
                          checked={selectedItems[itemKey] || false}
                          onChange={() => handleItemSelect(item)}
                          className="mr-4 h-5 w-5 text-blue-600"
                        />
                        <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                          <Image 
                            src={item.imageUrl || comingSoon} 
                            alt={item.name} 
                            width={96} 
                            height={96} 
                            className="object-cover" 
                          />
                        </div>
                        <div className="ml-6 flex-grow">
                          <h3 className="font-semibold text-xl text-gray-800">{item.name}</h3>
                          <p className="text-gray-600">Quantity: {item.quantity}</p>
                          <p className="text-gray-600">Price: {formatPrice(item.price, item.currency)}</p>
                          
                          {/* Display Product Options */}
                          {item.selectedProductOptions && item.selectedProductOptions.length > 0 && (
                            <div className="mt-2">
                              {item.selectedProductOptions.map((option: any, index: any) => (
                                <p key={index} className="text-gray-600">
                                  {option.name}: {option.value}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className="bg-gray-50 p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Order Summary</h2>
                <div className="bg-white p-4 rounded-lg">
                  <div className="space-y-3">
                    <p className="flex justify-between text-lg">
                      <span>Subtotal:</span> 
                      <span className="font-medium">{formatPrice(order.subTotal.value, order.subTotal.currencyCode)}</span>
                    </p>
                    <p className="flex justify-between text-lg">
                      <span>Shipping:</span> 
                      <span className="font-medium">{formatPrice(order.shippingDetails.shippingCost.value, order.shippingDetails.shippingCost.currencyCode)}</span>
                    </p>
                    <div className="border-t-2 border-gray-200 my-3 pt-3">
                      <p className="flex justify-between font-bold text-xl text-blue-600">
                        <span>Grand Total:</span> 
                        <span>{formatPrice(order.totalIncTax.value, order.totalIncTax.currencyCode)}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Side */}
            <div className="space-y-8">
              <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Order Details</h2>
                <p className="mb-2"><span className="font-medium">Order Date:</span> {order.orderedAt}</p>
                <p className="mb-2"><span className="font-medium">Order Total:</span> {formatPrice(order.totalIncTax.value, order.totalIncTax.currencyCode)}</p>
                {order?.paymentMethod && <p><span className="font-medium">Payment Method:</span> {order?.paymentMethod}</p>}
              </div>
              
              <section className="bg-gray-50 p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Shipping Address</h2>
                <AddressComponent address={order.shippingAddress} />
              </section>

              <section className="bg-gray-50 p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Billing Address</h2>
                <AddressComponent address={order.billingAddress} />
              </section>

              <section className="mt-8">
                <ActionButtons 
                  orderId={order.entityId} 
                  orderData={order} 
                  selectedItems={selectedItems}
                  selectedItemOptions={selectedItemOptions}
                />
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderComp;