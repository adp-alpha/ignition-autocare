
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Toggle } from "@/components/ui/toggle";
import { useFormContext } from "react-hook-form";

const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

interface FormDayPickerProps {
  name: string;
  label: string;
}

export function FormDayPicker({ name, label }: FormDayPickerProps) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="flex items-center space-x-1">
              {DAYS.map((day) => (
                <Toggle
                  key={day}
                  variant="outline"
                  pressed={field.value?.includes(day)}
                  onPressedChange={(pressed) => {
                    const currentValue = field.value || [];
                    if (pressed) {
                      field.onChange([...currentValue, day]);
                    } else {
                      field.onChange(currentValue.filter((d: string) => d !== day));
                    }
                  }}
                >
                  {day}
                </Toggle>
              ))}
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
}
