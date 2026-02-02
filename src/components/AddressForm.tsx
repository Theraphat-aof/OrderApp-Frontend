'use client';

import React from 'react';
import { ThailandAddressTypeahead } from 'react-thailand-address-typeahead';

interface ShippingInfo {
  name: string;
  phone: string;
  address: string;
  subdistrict: string;
  district: string;
  province: string;
  postalCode: string;
}

interface Props {
  shippingInfo: ShippingInfo;
  setShippingInfo: React.Dispatch<React.SetStateAction<ShippingInfo>>;
}

export default function AddressForm({ shippingInfo, setShippingInfo }: Props) {
  return (
    <ThailandAddressTypeahead
      value={{
        subdistrict: shippingInfo.subdistrict,
        district: shippingInfo.district,
        province: shippingInfo.province,
        postalCode: shippingInfo.postalCode,
      }}
      onValueChange={(val) => setShippingInfo(prev => ({ ...prev, ...val }))}
    >
      <div className="space-y-4">
        {/* House No / Street */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            House No. / Building / Street
          </label>
          <input
            type="text"
            value={shippingInfo.address}
            onChange={(e) => setShippingInfo(prev => ({ ...prev, address: e.target.value }))}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder="123/45 Village No. 8"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Sub-district */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sub-district (Tambon)
            </label>
            <ThailandAddressTypeahead.SubdistrictInput
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Type Sub-district..."
            />
          </div>
          {/* District */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              District (Amphoe)
            </label>
            <ThailandAddressTypeahead.DistrictInput
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Type District..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Province */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Province
            </label>
            <ThailandAddressTypeahead.ProvinceInput
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Type Province..."
            />
          </div>
          {/* Postal Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Postal Code
            </label>
            <ThailandAddressTypeahead.PostalCodeInput
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Type Postal Code..."
            />
          </div>
        </div>
      </div>
      
      <ThailandAddressTypeahead.Suggestion
        containerProps={{
          className: "bg-white border text-black border-gray-200 rounded-lg shadow-xl absolute z-50 max-h-60 overflow-y-auto w-full max-w-sm mt-1"
        }}
        optionItemProps={{
          className: "px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm text-gray-700 border-b border-gray-100 last:border-0"
        }}
      />
    </ThailandAddressTypeahead>
  );
}