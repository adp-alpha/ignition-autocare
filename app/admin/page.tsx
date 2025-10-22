'use client'

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from '@/components/ui/input';
import { CommonRepairsForm } from "./components/CommonRepairsForm";
import { CustomProductsForm } from "./components/CustomProductsForm";
import { DeliveryOptionsForm } from "./components/DeliveryOptionsForm";
import { MOTForm } from "./components/MOTForm";
import { OffersAndExtrasForm } from "./components/OffersAndExtrasForm";
import { OffersForm } from "./components/OffersForm";
import { ProductsForm } from "./components/ProductsForm";
import { ServicingForm } from "./components/ServicingForm";
import { SinglePriceProductsForm } from "./components/SinglePriceProductsForm";
import { VehicleSafetyCheckForm } from "./components/VehicleSafetyCheckForm";
import { SectionCollapseProvider, useSectionCollapse } from '@/lib/context/AdminPageContext';
import { adminDataSchema, type AdminDataInput } from '@/lib/validations/admin-data';

function AdminPageContent() {
  const { toggleAll } = useSectionCollapse();
  const form = useForm<AdminDataInput>({
    resolver: zodResolver(adminDataSchema),
    defaultValues: {
      defaultLeadTime: 0,
      motClass4: {
        enabled: false,
        standardPrice: 0,
        leadTime: 0,
        leadTimeEnabled: false,
        availability: [],
        discounts: {
          priceWithInterimService: { price: 0, enabled: false },
          priceWithFullService: { price: 0, enabled: false },
          priceWithMajorService: { price: 0, enabled: false },
        },
      },
      motClass7: {
        enabled: false,
        standardPrice: 0,
        leadTime: 0,
        leadTimeEnabled: false,
        availability: [],
        discounts: {
          priceWithInterimService: { price: 0, enabled: false },
          priceWithFullService: { price: 0, enabled: false },
          priceWithMajorService: { price: 0, enabled: false },
        },
      },
      deliveryOptions: [
        {
          enabled: false,
          name: "",
          availability: [],
          allowMOTs: false,
          priceWithMOT: 0,
          priceWithService: 0,
          leadTime: 0,
          leadTimeEnabled: false,
          maxDistance: "N/A" as const,
        },
        {
          enabled: false,
          name: "",
          availability: [],
          allowMOTs: false,
          priceWithMOT: 0,
          priceWithService: 0,
          leadTime: 0,
          leadTimeEnabled: false,
          maxDistance: 0,
        },
        {
          enabled: false,
          name: "",
          availability: [],
          allowMOTs: false,
          priceWithMOT: 0,
          priceWithService: 0,
          leadTime: 0,
          leadTimeEnabled: false,
          maxDistance: 0,
        },
      ],
      customProducts: [
        {
          enabled: false,
          name: "",
          extraDescription: "",
          below2000ccPrice: 0,
          above2000ccPrice: 0,
          petrol: false,
          diesel: false,
          electric: false,
        },
      ],
      singlePriceProducts: Array(7).fill(null).map(() => ({
        enabled: false,
        name: "",
        defaultPrice: 0,
        enableServicePrice: false,
        priceWithService: null,
      })),
      products: Array(6).fill(null).map(() => ({
        enabled: false,
        name: "",
        "0cc-1500cc": 0,
        "1501cc-2400cc": 0,
        "2401cc or above": 0,
      })),
      vehicleSafetyCheck: {
        isVehicleSafetyCheckEnabled: false,
        isFreeVehicleSafetyCheckEnabled: false,
        price: 0,
        priceWithMOT: { price: 0, enabled: false },
        priceWithInterimService: { price: 0, enabled: false },
        priceWithFullService: { price: 0, enabled: false },
        priceWithMajorService: { price: 0, enabled: false },
      },
      servicePricing: {
        prices: {
          "0cc-1200cc": { oilChange: 0, interim: 0, full: 0, major: 0 },
          "1201cc-1500cc": { oilChange: 0, interim: 0, full: 0, major: 0 },
          "1501cc-2000cc": { oilChange: 0, interim: 0, full: 0, major: 0 },
          "2001cc-2400cc": { oilChange: 0, interim: 0, full: 0, major: 0 },
          "2401cc-3500cc": { oilChange: 0, interim: 0, full: 0, major: 0 },
          "3501cc or above": { oilChange: 0, interim: 0, full: 0, major: 0 },
        },
        oilQty: {
          "0cc-1200cc": 0,
          "1201cc-1500cc": 0,
          "1501cc-2000cc": 0,
          "2001cc-2400cc": 0,
          "2401cc-3500cc": 0,
          "3501cc or above": 0,
        },
        partCosts: {
          airFilter: {
            "0cc-1200cc": 0,
            "1201cc-1500cc": 0,
            "1501cc-2000cc": 0,
            "2001cc-2400cc": 0,
            "2401cc-3500cc": 0,
            "3501cc or above": 0,
          },
          pollenFilter: {
            "0cc-1200cc": 0,
            "1201cc-1500cc": 0,
            "1501cc-2000cc": 0,
            "2001cc-2400cc": 0,
            "2401cc-3500cc": 0,
            "3501cc or above": 0,
          },
          oilFilter: {
            "0cc-1200cc": 0,
            "1201cc-1500cc": 0,
            "1501cc-2000cc": 0,
            "2001cc-2400cc": 0,
            "2401cc-3500cc": 0,
            "3501cc or above": 0,
          },
        },
        hourlyRates: {
          oilChange: {
            "0cc-1200cc": 0,
            "1201cc-1500cc": 0,
            "1501cc-2000cc": 0,
            "2001cc-2400cc": 0,
            "2401cc-3500cc": 0,
            "3501cc or above": 0,
          },
          interim: {
            "0cc-1200cc": 0,
            "1201cc-1500cc": 0,
            "1501cc-2000cc": 0,
            "2001cc-2400cc": 0,
            "2401cc-3500cc": 0,
            "3501cc or above": 0,
          },
          full: {
            "0cc-1200cc": 0,
            "1201cc-1500cc": 0,
            "1501cc-2000cc": 0,
            "2001cc-2400cc": 0,
            "2401cc-3500cc": 0,
            "3501cc or above": 0,
          },
          major: {
            "0cc-1200cc": 0,
            "1201cc-1500cc": 0,
            "1501cc-2000cc": 0,
            "2001cc-2400cc": 0,
            "2401cc-3500cc": 0,
            "3501cc or above": 0,
          },
        },
      },
      servicingRates: {
        servicingLeadTime: 0,
        servicingLeadTimeEnabled: false,
        serviceLabourRate: 0,
        electricalVehicleLabourRate: 0,
        standardOilPrice: 0,
        specialistOilPrice: 0,
      },
      offers: [],
      commonRepairs: {
        mechanicalLabourRate: 0,
        repairs: Array(3).fill(null).map(() => ({
          enabled: false,
          product: "",
          oemPartsPriceModifier: 0,
          oemPartsModifierIsIncrease: true,
          examplePrice: 0,
          leadTimeEnabled: false,
          leadTime: 0,
          priceType: "EXAMPLE" as const,
        })),
      },
      offersAndExtras: {
        manufacturerService: false,
        monthlyRepaymentOptions: false,
        servicePlanEligibilityCheck: false,
        videoAuthorisation: false,
      },
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/admin-data");
        if (!response.ok) {
          throw new Error("Failed to fetch admin data");
        }
        const data = await response.json();
        form.reset(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [form]);

  const onSubmit = async (data: AdminDataInput) => {
    try {
      const response = await fetch("/api/admin-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to save admin data");
      }

      alert("Admin data saved successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to save admin data.");
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <Button
          variant="outline"
          onClick={toggleAll}
        >
          Expand / Collapse All Sections
        </Button>
      </div>
      <Form {...form}>
        <div className="bg-white p-4 rounded-md shadow-md mb-6">
          <FormField
            control={form.control}
            name="defaultLeadTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Default Lead Time (Working Days)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    value={field.value || ''}
                    onChange={(e) =>
                      field.onChange(parseFloat(e.target.value) || 0)
                    }
                    className="w-32 h-10"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <MOTForm name="motClass4" title="MOT (Class 4)" />
          <MOTForm name="motClass7" title="MOT (Class 7)" />
          <DeliveryOptionsForm />
          <CustomProductsForm />
          <SinglePriceProductsForm />
          <ProductsForm />
          <VehicleSafetyCheckForm />
          <ServicingForm />
          {/* <OffersForm /> */}
          <CommonRepairsForm />
          <OffersAndExtrasForm />

          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-v3-green text-white hover:bg-v3-green-dark"
            >
              Update
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default function AdminPage() {
  return (
    <SectionCollapseProvider>
      <AdminPageContent />
    </SectionCollapseProvider>
  );
}
