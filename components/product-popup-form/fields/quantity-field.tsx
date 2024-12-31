import { useTranslations } from 'next-intl';

import { Counter } from '~/components/ui/counter';
import { Label } from '~/components/ui/label';

import { useProductFieldController } from '../use-product-form';

export const QuantityField = () => {
  const { field } = useProductFieldController({
    name: 'quantity',
    rules: { required: true, min: 1 },
    defaultValue: 1,
  });
  const t = useTranslations('Product.Form');

  return (
    <div className="@md:w-32 qty">
      <Label className="inline-block mb-2 font-semibold" htmlFor="quantity">
        Quantity
      </Label>
      <Counter
        id="quantity"
        min={1}
        name={field.name}
        onChange={field.onChange}
        value={Number(field.value)}
      />
    </div>
  );
};
