
import { useFormContext } from "react-hook-form";
import { FormSection } from "./shared/FormSection";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

const products = [
  "Air Conditioning Re-gas R1234YF",
  "Air Conditioning Re-gas R134A",
  "Brake Fluid Replacement",
  "Coolant Change",
  "Diagnostic Check",
  "Front Wheel Alignment"
];

export function ProductsForm() {
  const { control, watch } = useFormContext();

  return (
    <FormSection title="Products (Including VAT)" collapsible className="bg-[var(--v3-mot-form-bg)]">
      <Table>
        <TableHeader>
          <TableRow className="bg-blue-900 text-white hover:bg-blue-900">
            <TableHead className="text-white">Enabled Products</TableHead>
            <TableHead className="text-white">0cc - 1500cc</TableHead>
            <TableHead className="text-white">1501cc - 2400cc</TableHead>
            <TableHead className="text-white">2401cc or above</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((productName, index) => {
            const isEnabled = watch(`products.${index}.enabled`);
            
            return (
            <TableRow key={index}>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <FormField
                    control={control}
                    name={`products.${index}.enabled`}
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
                  <span className="text-sm">{productName}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">£</span>
                  <FormField
                    control={control}
                    name={`products.${index}.0cc-1500cc`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            className="pl-8 w-20 bg-white"
                            disabled={!isEnabled}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </TableCell>
              <TableCell>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">£</span>
                  <FormField
                    control={control}
                    name={`products.${index}.1501cc-2400cc`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            className="pl-8 w-20 bg-white"
                            disabled={!isEnabled}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </TableCell>
              <TableCell>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">£</span>
                  <FormField
                    control={control}
                    name={`products.${index}.2401cc or above`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            className="pl-8 w-20 bg-white"
                            disabled={!isEnabled}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </TableCell>
            </TableRow>
          );
          })}
        </TableBody>
      </Table>
    </FormSection>
  );
}
