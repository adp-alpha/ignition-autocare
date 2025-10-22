'use client';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';
import { FormSection } from './shared/FormSection';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { InfoIcon } from './shared/InfoIcon';

interface MOTFormProps {
  title: string;
  name: 'motClass4' | 'motClass7';
}

const days = [
  { key: 'Mo', label: 'Mo' },
  { key: 'Tu', label: 'Tu' },
  { key: 'We', label: 'We' },
  { key: 'Th', label: 'Th' },
  { key: 'Fr', label: 'Fr' },
  { key: 'Sa', label: 'Sa' },
  { key: 'Su', label: 'Su' },
];

export function MOTForm({ title, name }: MOTFormProps) {
  const { control, watch } = useFormContext();
  const isEnabled = watch(`${name}.enabled`);

  const renderDiscountField = (
    service: 'priceWithInterimService' | 'priceWithFullService' | 'priceWithMajorService',
    label: string
  ) => (
    <div className="flex items-center justify-between">
      <div className="flex flex-col">
        <FormLabel className="text-sm font-normal text-gray-500">
          {label}
        </FormLabel>
        <FormField
          control={control}
          name={`${name}.discounts.${service}.price`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    £
                  </span>
                  <Input
                    type="number"
                    {...field}
                    value={field.value || ''}
                    onChange={(e) =>
                      field.onChange(parseFloat(e.target.value) || 0)
                    }
                    className="pl-8 w-32 h-10 bg-white"
                    disabled={!isEnabled}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="flex items-center gap-2">
        <FormField
          control={control}
          name={`${name}.discounts.${service}.enabled`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={!isEnabled}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormLabel className="text-sm font-normal">Enabled</FormLabel>
      </div>
    </div>
  );

  return (
    <FormSection
      title={title}
      isEnabled={isEnabled}
      collapsible
      className="bg-[var(--v3-mot-form-bg)]"
    >
      <div className="flex gap-6">
        <div className="w-1/2 space-y-4">
          <FormField
            control={control}
            name={`${name}.enabled`}
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">Enabled</FormLabel>
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <FormLabel>Standard Price</FormLabel>
            <FormField
              control={control}
              name={`${name}.standardPrice`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                        £
                      </span>
                      <Input
                        type="number"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                        className="pl-8 w-32 h-10 bg-white"
                        disabled={!isEnabled}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FormLabel>
                {name === 'motClass4'
                  ? 'Class 4 MOT Lead Time (Working Days)'
                  : 'Class 7 MOT Lead Time (Working Days)'}
              </FormLabel>
              <InfoIcon />
            </div>
            <div className="flex items-center gap-4">
              <FormField
                control={control}
                name={`${name}.leadTime`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                        className="w-32 h-10 bg-white"
                        disabled={!isEnabled}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`${name}.leadTimeEnabled`}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={!isEnabled}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">Enabled</FormLabel>
                  </FormItem>
                )}
              />
            </div>
            <p className="text-xs text-gray-500">
              Pre-MOT Settings have been moved under the "Single Price
              Products (including VAT)" section
            </p>
          </div>

          <div className="space-y-2">
            <FormLabel>
              {name === 'motClass4'
                ? 'Class 4 Availability'
                : 'Class 7 Availability'}
            </FormLabel>
            <FormField
              control={control}
              name={`${name}.availability`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex gap-1">
                      {days.map((day) => (
                        <Button
                          key={day.key}
                          type="button"
                          variant="outline"
                          size="sm"
                          className={`w-10 h-10 rounded-md p-0 ${
                            field.value?.includes(day.key)
                              ? 'bg-green-500 text-white border-green-500 hover:bg-green-600'
                              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                          }`}
                          onClick={() => {
                            const currentValue = field.value || [];
                            if (currentValue.includes(day.key)) {
                              field.onChange(
                                currentValue.filter((d: string) => d !== day.key)
                              );
                            } else {
                              field.onChange([...currentValue, day.key]);
                            }
                          }}
                          disabled={!isEnabled}
                        >
                          {day.label}
                        </Button>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="w-1/2 space-y-4">
          <h3 className="text-lg font-medium">Discounts</h3>
          <p className="text-sm text-gray-500">
            The price of an {name === 'motClass4' ? 'Class 4' : 'Class 7'} MOT
            when it is purchased with the relevant service.
          </p>
          <div className="space-y-4">
            {renderDiscountField(
              'priceWithInterimService',
              'Price with Interim Service'
            )}
            {renderDiscountField(
              'priceWithFullService',
              'Price with Full Service'
            )}
            {renderDiscountField(
              'priceWithMajorService',
              'Price with Major Service'
            )}
          </div>
        </div>
      </div>
    </FormSection>
  );
}
