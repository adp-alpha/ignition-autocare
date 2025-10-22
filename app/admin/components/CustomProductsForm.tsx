
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { FormSection } from "./shared/FormSection";

export function CustomProductsForm() {
  const { control, watch } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "customProducts"
  });

  const addProduct = () => {
    append({
      enabled: false,
      name: "",
      extraDescription: "",
      below2000ccPrice: 0,
      above2000ccPrice: 0,
      petrol: false,
      diesel: false,
      electric: false,
    });
  };

  return (
    <FormSection title="Custom Products (including VAT)" collapsible className="bg-[var(--v3-mot-form-bg)]">
      <div className="mb-4">
        <Button
          type="button"
          onClick={addProduct}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Custom Product
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="bg-blue-900 text-white hover:bg-blue-900">
            <TableHead className="text-white">#</TableHead>
            <TableHead className="text-white">Enabled Name</TableHead>
            <TableHead className="text-white">Extra Description</TableHead>
            <TableHead className="text-white">Below 2000cc Price</TableHead>
            <TableHead className="text-white">Above 2000cc Price</TableHead>
            <TableHead className="text-white">Petrol</TableHead>
            <TableHead className="text-white">Diesel</TableHead>
            <TableHead className="text-white">Electric</TableHead>
            <TableHead className="text-white"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fields.map((field, index) => {
            const isEnabled = watch(`customProducts.${index}.enabled`);
            
            return (
            <TableRow key={field.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                <div className="space-y-2 flex items-center justify-center gap-2">
                  <FormField
                    control={control}
                    name={`customProducts.${index}.enabled`}
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
                  <FormField
                    control={control}
                    name={`customProducts.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input 
                            {...field} 
                            value={field.value || ""}
                            className="bg-white"
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
                  name={`customProducts.${index}.extraDescription`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          value={field.value || ""}
                          className="min-h-[60px] bg-white"
                          rows={3}
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
                  name={`customProducts.${index}.below2000ccPrice`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            value={field.value || ""}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            className="w-20 text-center bg-white"
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
                  name={`customProducts.${index}.above2000ccPrice`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            value={field.value || ""}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            className="w-20 text-center bg-white"
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
                  name={`customProducts.${index}.petrol`}
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
                  name={`customProducts.${index}.diesel`}
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
                  name={`customProducts.${index}.electric`}
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
                <Button 
                  type="button"
                  variant="ghost" 
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          );
          })}
        </TableBody>
      </Table>
    </FormSection>
  );
}
