"use client";
import React, { useState } from 'react';

interface SelectBoxProps {
   itemName: string;
  }

const SelectBox: React.FC<SelectBoxProps> = ({ itemName }) => {
    const [selectedItems, setSelectedItems] = useState<{ [key: string]: boolean }>({});

    const handleItemSelect = (itemId: string) => {
        setSelectedItems(prev => ({
          ...prev,
          [itemId]: !prev[itemId]
        }));
      };


    return (
        <input
                      type="checkbox"
                      checked={selectedItems[itemName] || false}
                      onChange={() => handleItemSelect(itemName)}
                      className="mr-4 h-5 w-5 text-blue-600"
                    />
    );
}

export default SelectBox;