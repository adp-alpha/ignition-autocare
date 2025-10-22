
import { useFormContext } from "react-hook-form";
import { FormSection } from "./shared/FormSection";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

const offersAndExtras = [
  { key: "manufacturerService", label: "Manufacturer Service" },
  { key: "monthlyRepaymentOptions", label: "Monthly Repayment Options" },
  { key: "servicePlanEligibilityCheck", label: "Service Plan Eligibility Check" },
  { key: "videoAuthorisation", label: "Video Authorisation" }
];

export function OffersAndExtrasForm() {
  const { control } = useFormContext();

  return (
    <FormSection title="Offers & Extras" collapsible className="bg-[var(--v3-mot-form-bg)]">
      <Table>
        <TableHeader>
          <TableRow className="bg-blue-900 text-white hover:bg-blue-900">
            <TableHead className="text-white">Enabled Products</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {offersAndExtras.map((item) => (
            <TableRow key={item.key}>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <FormField
                    control={control}
                    name={`offersAndExtras.${item.key}`}
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
                  <span className="text-sm">{item.label}</span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </FormSection>
  );
}
