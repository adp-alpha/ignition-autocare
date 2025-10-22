
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext } from "react-hook-form";
import { FormSection } from "./shared/FormSection";

export function OffersForm() {
  const { control } = useFormContext();

  return (
    <FormSection title="Offers" collapsible className="bg-[var(--v3-mot-form-bg)]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <FormField
            control={control}
            name="offers.product"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Please select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Please select...</SelectItem>
                      <SelectItem value="product1">Product 1</SelectItem>
                      <SelectItem value="product2">Product 2</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
          
          <Button variant="outline" className="w-fit">
            Reset
          </Button>
        </div>
        
        <div className="space-y-4">
          <FormField
            control={control}
            name="offers.offerContent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Offer Content</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    className="bg-white"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="offers.tooltipContent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tooltip Content</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    className="bg-white"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>
    </FormSection>
  );
}
