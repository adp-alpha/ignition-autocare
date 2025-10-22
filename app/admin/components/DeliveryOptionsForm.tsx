
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useFormContext } from "react-hook-form";
import { FormSection } from "./shared/FormSection";

const days = [
  { key: "Mo", label: "Mo" },
  { key: "Tu", label: "Tu" },
  { key: "We", label: "We" },
  { key: "Th", label: "Th" },
  { key: "Fr", label: "Fr" },
  { key: "Sa", label: "Sa" },
  { key: "Su", label: "Su" }
];

export function DeliveryOptionsForm() {
  const { control, watch } = useFormContext();

  return (
    <FormSection title="Delivery Options (Including VAT)" collapsible className="">
      <Table>
        <TableHeader>
          <TableRow className="bg-blue-900 text-white hover:bg-blue-900">
            <TableHead className="text-white">Enabled</TableHead>
            <TableHead className="text-white">Name</TableHead>
            <TableHead className="text-white">Availability</TableHead>
            <TableHead className="text-white">Allow MOTs</TableHead>
            <TableHead className="text-white">Price with MOT (£)</TableHead>
            <TableHead className="text-white">Price with Service (£)</TableHead>
            <TableHead className="text-white">Lead Time (Working Days)</TableHead>
            <TableHead className="text-white">Max Distance (Miles)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[0, 1, 2].map((index) => {
            const isEnabled = watch(`deliveryOptions.${index}.enabled`);
            
            return (
            <TableRow key={index}>
              <TableCell>
                <FormField
                  control={control}
                  name={`deliveryOptions.${index}.enabled`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </TableCell>
              <TableCell>
                <FormField
                  control={control}
                  name={`deliveryOptions.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <span className="text-sm">{field.value || "Unnamed Option"}</span>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </TableCell>
              <TableCell>
                <FormField
                  control={control}
                  name={`deliveryOptions.${index}.availability`}
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
                              className={`w-8 h-8 rounded-full p-0 text-xs ${
                                field.value?.includes(day.key) 
                                  ? 'bg-green-500 text-white border-green-500 hover:bg-green-600'
                                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                              }`}
                              onClick={() => {
                                const currentValue = field.value || [];
                                if (currentValue.includes(day.key)) {
                                  field.onChange(currentValue.filter((d: string) => d !== day.key));
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
                    </FormItem>
                  )}
                />
              </TableCell>
              <TableCell>
                <FormField
                  control={control}
                  name={`deliveryOptions.${index}.allowMOTs`}
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
              </TableCell>
              <TableCell>
                <FormField
                  control={control}
                  name={`deliveryOptions.${index}.priceWithMOT`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          value={field.value || ""}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          className="w-16 h-8 text-center bg-white"
                          disabled={!isEnabled}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </TableCell>
              <TableCell>
                <FormField
                  control={control}
                  name={`deliveryOptions.${index}.priceWithService`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          value={field.value || ""}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          className="w-16 h-8 text-center bg-white"
                          disabled={!isEnabled}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <FormField
                    control={control}
                    name={`deliveryOptions.${index}.leadTime`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            className="w-12 h-8 text-center bg-white"
                            disabled={!isEnabled}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name={`deliveryOptions.${index}.leadTimeEnabled`}
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
                </div>
              </TableCell>
              <TableCell>
                <FormField
                  control={control}
                  name={`deliveryOptions.${index}.maxDistance`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input 
                          {...field} 
                          value={field.value || ""}
                          className="w-16 h-8 text-center bg-white"
                          disabled={!isEnabled}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </TableCell>
            </TableRow>
          );
          })}
        </TableBody>
      </Table>
    </FormSection>
  );
}
