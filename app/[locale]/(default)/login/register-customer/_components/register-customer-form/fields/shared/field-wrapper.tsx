'use client';

import { PropsWithChildren } from 'react';

import { FieldNameToFieldId } from '../utils';

const LAYOUT_SINGLE_LINE_FIELDS = [
  FieldNameToFieldId.email,
  FieldNameToFieldId.company,
  FieldNameToFieldId.phone,
];

export const FieldWrapper = ({ children, fieldId }: { fieldId: number } & PropsWithChildren) => {
  if (LAYOUT_SINGLE_LINE_FIELDS.includes(fieldId)) {
    return (
      <div className="single-field layout-field">
        {children}
      </div>
    );
  }

  return children;
};
