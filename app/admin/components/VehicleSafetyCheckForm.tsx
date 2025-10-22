
import { useFormContext } from "react-hook-form";
import { FormSection } from "./shared/FormSection";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

export function VehicleSafetyCheckForm() {
  const { control, watch } = useFormContext();
  const isVSCEnabled = watch("vehicleSafetyCheck.isVehicleSafetyCheckEnabled");
  const isFreeVSCEnabled = watch("vehicleSafetyCheck.isFreeVehicleSafetyCheckEnabled");

  return (
    <FormSection title="Vehicle Safety Check" collapsible className="bg-[var(--v3-mot-form-bg)]">
      <div className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={control}
            name="vehicleSafetyCheck.isVehicleSafetyCheckEnabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Is Vehicle Safety Check Enabled</FormLabel>
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="vehicleSafetyCheck.isFreeVehicleSafetyCheckEnabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Is Free Vehicle Safety Check (Discount Card) Enabled</FormLabel>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name="vehicleSafetyCheck.price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">£</span>
                  <Input 
                    type="number" 
                    {...field} 
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    className="pl-8 w-32 bg-white"
                    disabled={!isVSCEnabled}
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <FormLabel>Price with MOT</FormLabel>
                <FormField
                  control={control}
                  name="vehicleSafetyCheck.priceWithMOT.enabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={!isVSCEnabled}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">Enabled</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={control}
                name="vehicleSafetyCheck.priceWithMOT.price"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">£</span>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          className="pl-8 w-32 bg-white"
                          disabled={!isVSCEnabled || !watch("vehicleSafetyCheck.priceWithMOT.enabled")}
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <FormLabel>Price with Interim Service</FormLabel>
                <FormField
                  control={control}
                  name="vehicleSafetyCheck.priceWithInterimService.enabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={!isVSCEnabled}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">Enabled</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={control}
                name="vehicleSafetyCheck.priceWithInterimService.price"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">£</span>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          className="pl-8 w-32 bg-white"
                          disabled={!isVSCEnabled || !watch("vehicleSafetyCheck.priceWithInterimService.enabled")}
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <FormLabel>Price with Full Service</FormLabel>
                <FormField
                  control={control}
                  name="vehicleSafetyCheck.priceWithFullService.enabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={!isVSCEnabled}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">Enabled</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={control}
                name="vehicleSafetyCheck.priceWithFullService.price"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">£</span>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          className="pl-8 w-32 bg-white"
                          disabled={!isVSCEnabled || !watch("vehicleSafetyCheck.priceWithFullService.enabled")}
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <FormLabel>Price with Major Service</FormLabel>
                <FormField
                  control={control}
                  name="vehicleSafetyCheck.priceWithMajorService.enabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={!isVSCEnabled}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">Enabled</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={control}
                name="vehicleSafetyCheck.priceWithMajorService.price"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">£</span>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          className="pl-8 w-32 bg-white"
                          disabled={!isVSCEnabled || !watch("vehicleSafetyCheck.priceWithMajorService.enabled")}
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </FormSection>
  );
}
