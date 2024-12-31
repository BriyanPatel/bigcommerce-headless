"use client";
import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import { addToCart } from '../../../../(default)/compare/_actions/add-to-cart';

interface ProductOption {
  name: string;
  value: string;
  optionEntityId: number;
  valueEntityId: number;
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

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  customMessage?: string;
  imageUrl?: string;
  currency: string;
  selectedProductOptions: ProductOption[];
  valueIds: string;
}

interface ActionButtonsProps {
  orderId: string;
  orderData: {
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
  selectedItems: { [key: string]: boolean };
  selectedItemOptions: { [key: string]: ProductOption[] };
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  orderId, 
  orderData, 
  selectedItems, 
  selectedItemOptions 
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [invoiceWindow, setInvoiceWindow] = useState<Window | null>(null);

  const handleReorder = async () => {
    setIsLoading(true);
    
    const selectedProducts = orderData.items.filter(item => {
      const key = item.valueIds 
        ? `${item.valueIds}-${item.name}` 
        : `${item.id}-${item.name}`;
      
      return selectedItems[key];
    });
    
    let successCount = 0;
    let errorCount = 0;

    for (const item of selectedProducts) {
      const formData = new FormData();
      formData.append('product_id', item.id.toString());
      formData.append('quantity', item.quantity.toString());

      // If there are selected product options, append them
      const optionsKey = `${item.valueIds}-${item.name}`;
      const itemOptions = selectedItemOptions[optionsKey];

      if (itemOptions && itemOptions.length > 0) {
        itemOptions.forEach((option) => {
          formData.append(`attribute_${option.optionEntityId}`, `${option.valueEntityId}`);
        });
      }

      try {
        const result = await addToCart(formData);
        if (result.status === 'error') {
          console.error(`Failed to add ${item.name} to cart:`, result.error);
          errorCount++;
        } else {
          successCount++;
        }
      } catch (error) {
        console.error(`Error adding ${item.name} to cart:`, error);
        errorCount++;
      }
    }

    setIsLoading(false);

    // Show toast based on success/error counts
    if (successCount > 0 && errorCount === 0) {
      toast.success(`Successfully added ${successCount} item(s) to cart`, {
        description: `All ${successCount} selected items have been added to your cart.`,
        duration: 3000,
      });
    } else if (successCount > 0 && errorCount > 0) {
      toast.warning(`Partially added to cart`, {
        description: `${successCount} item(s) added successfully, ${errorCount} item(s) failed.`,
        duration: 3000,
      });
    } else {
      toast.error('Failed to add items to cart', {
        description: 'None of the selected items could be added to the cart.',
        duration: 3000,
      });
    }
  };

  const handlePrintInvoice = () => {
    const invoiceContent = generateInvoiceContent(orderData);
    const newWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes');
    
    if (newWindow) {
      newWindow.document.write(invoiceContent);
      newWindow.document.close();
      setInvoiceWindow(newWindow);
    }
  };

  useEffect(() => {
    return () => {
      if (invoiceWindow) {
        invoiceWindow.close();
      }
    };
  }, [invoiceWindow]);

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

  const generateInvoiceContent = (orderData: any) => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice - Order #${orderData.entityId}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
          
          body {
            font-family: 'Roboto', sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f7f9;
            margin: 0;
            padding: 20px;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 40px;
          }
          .logo {
            max-width: 150px;
            margin-bottom: 20px;
            background-color: #000000;
          }
          h1 {
            color: #2c3e50;
            margin-bottom: 10px;
            font-weight: 500;
          }
          .invoice-number {
            font-size: 1.2em;
            color: #3498db;
            margin-bottom: 30px;
          }
          .address-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 40px;
          }
          .address-box {
            width: 48%;
            background-color: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          }
          .address-box h2 {
            color: #2c3e50;
            margin-top: 0;
            margin-bottom: 15px;
            font-weight: 500;
          }
          .order-details {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            margin-bottom: 30px;
            background-color: #e8f4fd;
            border-radius: 8px;
            padding: 20px;
          }
          .order-details > div {
            flex-basis: 48%;
          }
          table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            margin-bottom: 30px;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          }
          th, td {
            padding: 15px;
            text-align: left;
          }
          th {
            background-color: #3498db;
            color: white;
            font-weight: 500;
          }
          tr:nth-child(even) {
            background-color: #f8f9fa;
          }
          .total {
            font-size: 1.1em;
            margin-top: 30px;
            text-align: right;
          }
          .total p {
            margin: 5px 0;
          }
          .total .grand-total {
            font-size: 1.3em;
            font-weight: 700;
            color: #3498db;
          }
          .print-button {
            background-color: #3498db;
            color: white;
            padding: 12px 24px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 500;
            transition: background-color 0.3s ease;
            display: block;
            margin: 30px auto 0;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .print-button:hover {
            background-color: #2980b9;
          }
          @media print {
            body {
              background-color: #ffffff;
            }
            .container {
              box-shadow: none;
              padding: 0;
            }
            .print-button {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="https://cdn11.bigcommerce.com/s-aat79ztzer/images/stencil/256w/download_1593426143__40558.original_1658307869.original.png?compression=lossy" alt="Company Logo" class="logo">
            <h1>Invoice</h1>
            <div class="invoice-number">Order #${orderData.entityId}</div>
          </div>
          
          <div class="address-section">
            <div class="address-box">
              <h2>Bill To:</h2>
              ${generateAddressHTML(orderData.billingAddress)}
            </div>
            
            <div class="address-box">
              <h2>Ship To:</h2>
              ${generateAddressHTML(orderData.shippingAddress)}
            </div>
          </div>
          
          <div class="order-details">
            <div>
              <p><strong>Order Date:</strong> ${formatDate(orderData.orderedAt)}</p>
              
            </div>
            <div>
              <p><strong>Order Status:</strong> ${orderData.status}</p>
              
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${orderData.items.map((item: any) => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>${formatPrice(item.price, item.currency)}</td>
                  <td>${formatPrice(item.price * item.quantity, item.currency)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="total">
            <p><strong>Subtotal:</strong> ${formatPrice(orderData.subTotal.value, orderData.subTotal.currencyCode)}</p>
            <p><strong>Shipping:</strong> ${formatPrice(orderData.shippingDetails.shippingCost.value, orderData.shippingDetails.shippingCost.currencyCode)}</p>
            <p class="grand-total"><strong>Total:</strong> ${formatPrice(orderData.totalIncTax.value, orderData.totalIncTax.currencyCode)}</p>
          </div>
          
          <button class="print-button" onclick="window.print()">Print Invoice</button>
        </div>
      </body>
      </html>
    `;
  };

  const generateAddressHTML = (address: Address) => {
    return `
      <p>${address.firstName} ${address.lastName}</p>
      <p>${address.address1}</p>
      ${address.address2 ? `<p>${address.address2}</p>` : ''}
      ${address.city ? `<p>${address.city}, ${address.stateOrProvince} ${address.postalCode}</p>` : `<p>${address.stateOrProvince} ${address.postalCode}</p>`}
      <p>${address.country}</p>
      <p>${address.phone}</p>
      <p>${address.email}</p>
    `;
  };

  return (
    <>
      <Toaster 
        position="top-right" 
        richColors 
        expand={true} 
        closeButton 
      />
      <div className="p-6 rounded-lg shadow-md bg-gray-50">
        <h2 className="mb-4 text-2xl font-semibold text-gray-800">Order Actions</h2>
        <div className="flex flex-col gap-4">
          <button 
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition duration-300 ease-in-out flex items-center justify-center shadow-md"
            onClick={handlePrintInvoice}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
            </svg>
            Print Invoice
          </button>
          <button 
            className={` secondary-btn ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleReorder}
            disabled={isLoading || Object.values(selectedItems).every(v => !v)}
          >
            {isLoading ? (
              <svg className="w-5 h-5 mr-2 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
            )}
            {isLoading ? 'Processing...' : 'Reorder Selected'}
          </button>
        </div>
      </div>
    </>
  );
};

export default ActionButtons;