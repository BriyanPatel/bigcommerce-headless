import React from 'react';
import { TabType } from '../layout';



interface OrdersProps {
  heading: TabType | 'change_password';
}

export const Messages: React.FC<OrdersProps> = async () => {
  
  return (
 <span>Message</span>
  );
};

export default Messages;