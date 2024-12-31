"use client";

import React from 'react';
import Link from 'next/link';
import { format } from 'date-fns';

interface Order {
  entityId: string;
  orderedAt: string;
  status: string;
}

const OrdersClient: React.FC<{ title: string; orders: Order[] }> = ({ title, orders }) => {
  
  
  return (
    <div className="mx-auto">
      <h2 className="mb-8 text-3xl font-black text-left text-gray-800 lg:text-4xl">{title}</h2>
      {orders.length === 0 ? (
        <p className="text-left text-gray-600">No orders found</p>
      ) : (
        <div className="space-y-4 order-lists">
          {orders.map((order) => (
            <OrderItem key={order.entityId} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

const OrderItem: React.FC<{ order: Order }> = ({ order }) => {
  const statusColors: { [key: string]: string } = {
    'COMPLETED': 'text-green-600',
    'PROCESSING': 'text-blue-600',
    'CANCELLED': 'text-red-600',
    'INCOMPLETE': 'text-yellow-600',
    'AWAITING FULFILLMENT': 'text-purple-600',
    'default': 'text-gray-600'
  };
  
  const statusColor = statusColors[order.status] || statusColors.default;

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg order-item">
      <div>
        <Link href={`/account/orders/${order.entityId}`} className="font-bold text-blue-600 hover:underline">
          Order #{order.entityId}
        </Link>
        <p className="mt-1 text-sm text-gray-600">
          Placed on {format(new Date(order.orderedAt), 'yyyy-MM-dd')}
        </p>
      </div>
      <div className={`font-medium ${statusColor}`}>
        {order.status}
      </div>
    </div>
  );
};

export default OrdersClient;