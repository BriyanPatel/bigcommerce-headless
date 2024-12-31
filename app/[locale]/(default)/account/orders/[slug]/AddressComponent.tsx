import React from 'react';

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

interface AddressComponentProps {
  address: Address;
}

const AddressComponent: React.FC<AddressComponentProps> = ({ address }) => (
  <div className="p-4 text-gray-600 rounded-lg  bg-gray-50">
    <p className="font-semibold text-gray-800">{address.firstName} {address.lastName}</p>
    <p>{address.address1}</p>
    {address.address2 && <p>{address.address2}</p>}
    {address.city ? (
    <p>{address.city}, {address.stateOrProvince} {address.postalCode}</p>
  ):(
    <p>{address.stateOrProvince} {address.postalCode}</p>
  )}
    <p>{address.country}</p>
    <p>{address.phone}</p>
    <p>{address.email}</p>
  </div>
);

export default AddressComponent;