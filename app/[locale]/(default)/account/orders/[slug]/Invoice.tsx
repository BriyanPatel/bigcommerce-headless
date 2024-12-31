import React, { useRef } from 'react';
import Image from 'next/image';

interface InvoiceProps {
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
    }>;
    subTotal: { value: number; currencyCode: string };
    shippingDetails: {
      shippingCost: { value: number; currencyCode: string };
    };
    shippingAddress: Address;
    billingAddress: Address;
  };
  onClose: () => void;
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

const Invoice: React.FC<InvoiceProps> = ({ order, onClose }) => {
  const invoiceRef = useRef<HTMLDivElement>(null);

  const formatPrice = (price: number, currencyCode: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handlePrint = () => {
    const printContent = invoiceRef.current;
    if (printContent) {
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContent.innerHTML;
      window.print();
      document.body.innerHTML = originalContents;
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold">Invoice</h1>
          <p className="text-gray-600">Order #{order.entityId}</p>
        </div>
        <div>
          <button 
            onClick={handlePrint}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200 mr-2"
          >
            Print Invoice
          </button>
          <button 
            onClick={onClose}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition duration-200"
          >
            Close
          </button>
        </div>
      </div>

      <div ref={invoiceRef}>
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-xl font-semibold mb-2">Bill To:</h2>
            <AddressDisplay address={order.billingAddress} />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Ship To:</h2>
            <AddressDisplay address={order.shippingAddress} />
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Order Details:</h2>
          <p><strong>Order Date:</strong> {formatDate(order.orderedAt)}</p>
          <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
          <p><strong>Order Status:</strong> {order.status}</p>
        </div>

        <table className="w-full mb-8">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left p-2">Item</th>
              <th className="text-right p-2">Quantity</th>
              <th className="text-right p-2">Price</th>
              <th className="text-right p-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="p-2">
                  <div className="flex items-center">
                    {item.imageUrl && (
                      <Image src={item.imageUrl} alt={item.name} width={50} height={50} className="mr-2" />
                    )}
                    <div>
                      <p>{item.name}</p>
                      {item.customMessage && (
                        <p className="text-sm text-gray-600">Message: {item.customMessage}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="text-right p-2">{item.quantity}</td>
                <td className="text-right p-2">{formatPrice(item.price, item.currency)}</td>
                <td className="text-right p-2">{formatPrice(item.price * item.quantity, item.currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end">
          <div className="w-64">
            <div className="flex justify-between mb-2">
              <span>Subtotal:</span>
              <span>{formatPrice(order.subTotal.value, order.subTotal.currencyCode)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping:</span>
              <span>{formatPrice(order.shippingDetails.shippingCost.value, order.shippingDetails.shippingCost.currencyCode)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>{formatPrice(order.totalIncTax.value, order.totalIncTax.currencyCode)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AddressDisplay: React.FC<{ address: Address }> = ({ address }) => (
  <div>
    <p>{address.firstName} {address.lastName}</p>
    <p>{address.address1}</p>
    {address.address2 && <p>{address.address2}</p>}
    <p>{address.city}, {address.stateOrProvince} {address.postalCode}</p>
    <p>{address.country}</p>
    <p>{address.phone}</p>
    <p>{address.email}</p>
  </div>
);

export default Invoice;