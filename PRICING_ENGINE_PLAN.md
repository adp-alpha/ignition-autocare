# Plan: Revamp Pricing Engine

This document outlines a comprehensive 2-phase plan to implement the new pricing engine.

### **Phase 1: Data Model & Admin UI Foundation**

**Objective:** To restructure the core data model and update the Admin Panel. This creates the necessary foundation for the new pricing logic by ensuring the data captured from the admin is perfectly aligned with the requirements of the pricing engine.

**Task 1: Evolve the `adminData` Schema (`my-garage-app/app/admin/page.tsx`)**

The existing `zod` schemas will be evolved to support the new logic.

*   **`commonRepairItemSchema`:** This will be updated to include the `priceType` concept from the prompt.
    *   **Add:** `priceType: z.enum(['EXAMPLE', 'REVEAL'])`. This allows an admin to specify if a repair shows an example price or requires a custom quote.
*   **`motServiceSchema`:** The discount structure needs to be more explicit to match the logic. The current structure is good, but we will ensure the naming is clear and consistent.
    *   **Review:** The existing `discounts` object is well-structured. We will ensure the keys (`priceWithFullService`, etc.) are consistently used by the new pricing engine.
*   **`servicePricingSchema`:** The current engine size ranges are more granular than in the prompt's example (`0cc-1200cc`, `1201cc-1500cc`, etc.). This is a strength, as it provides more pricing flexibility. We will retain this granular structure. The pricing engine will be built to find the correct key (e.g., "1201cc-1500cc") from a given engine size (e.g., 1499cc).
*   **`singlePriceProductSchema`:** To handle discounts on additional products when bought with a service, we will formalize the schema.
    *   **Modify:** The `priceWithService` field will be used to store the discounted price, and `enableServicePrice` will control this logic, which is already present. We will ensure the new engine correctly interprets this.

**Task 2: Update the Admin Panel UI Components (`my-garage-app/app/admin/components/`)**

The schema changes from Task 1 must be reflected in the admin UI to allow administrators to manage the new data points.

*   **`CommonRepairsForm.tsx`:**
    *   For each repair item, add a **Dropdown/Select** input labeled "Price Type" with options "Example Price" and "Reveal Price". This will control the new `priceType` field in the schema.
*   **`MOTForm.tsx`:**
    *   The existing form for MOT discounts is already quite good. We will review it to ensure it's clear to the user that they are setting the *final, discounted price* (e.g., £19.99), not the discount amount.
*   **`ProductsForm.tsx`, `SinglePriceProductsForm.tsx`, `CustomProductsForm.tsx`:**
    *   These forms are largely sufficient. We will ensure the labels and descriptions are clear, especially around engine-size-based pricing, to prevent admin confusion.

**Task 3: Generate an Updated `adminData.json`**

After the schemas and forms are updated, we will need a new or updated `my-garage-app/data/adminData.json` file that reflects this new structure. This file will be the single source of truth for all pricing and service rules for the application.

---

### **Phase 2: Pricing Engine Implementation & Frontend Integration**

**Objective:** To build the core pricing calculation logic and integrate it into the customer-facing service page, ensuring a dynamic and responsive user experience.

**Task 1: Create the Core Pricing Engine (`my-garage-app/lib/pricing-engine.ts`)**

This new file will contain all the business logic for price calculation. It will export a primary function, `calculatePrices`, and will have no UI-specific code.

*   **`getEngineRangeKey(cc: number): string` function:**
    *   A helper function that takes a vehicle's engine size (e.g., `1499`) and iterates through the keys of `adminData.servicePricing.prices` to find and return the matching range key (e.g., `"1201cc-1500cc"`).
*   **`calculatePrices(engineSizeCC: number, adminData: AdminData): FormattedPricingData` function:**
    *   This will be the main function. It takes the vehicle's engine size and the entire `adminData` object as input.
    *   It will use `getEngineRangeKey` to determine the correct pricing tier.
    *   It will process each category of service (`motAndServicing`, `additionalWork`, `repairs`) by reading the relevant sections of the `adminData` object.
    *   It will transform the raw admin data into the clean, UI-friendly JSON structure outlined in "Part 3" of the prompt. This includes setting `basePrice`, `finalPrice` (initially same as base), and populating the `discounts` array for items like the MOT.
    *   The output of this function will be the structured JSON object that the frontend will consume.

**Task 2: Refactor the Service Page (`my-garage-app/app/service/[reg]/page.tsx`)**

This server component will be responsible for fetching all necessary data and performing the *initial* price calculation.

*   **Data Fetching:** It will continue to fetch `vehicleData` and `motHistory`. It will also fetch the `adminData` from the JSON file.
*   **Initial Price Calculation:**
    *   After fetching the data, it will call the new `calculatePrices` function from the pricing engine, passing in the vehicle's engine size (`vehicleData.engineCapacity`) and the `adminData`.
    *   The resulting structured pricing object will be passed as a prop to the `ServicePageClient` component. The old `getPricingData` function will be deprecated and removed.

**Task 3: Revamp the Client Component (`my-garage-app/components/services/ServicePageClient.tsx`)**

This component is where the user interaction and dynamic price updates will happen. It will be made more intelligent to handle the discount logic on the client side for a fast, responsive feel.

*   **State Management:** It will manage two key pieces of state:
    1.  The full pricing data object received from the server-side page.
    2.  A list of the `id`s of the currently selected services (e.g., `['mot', 'fullService']`).
*   **Client-Side Discount Logic:**
    *   When a user selects or deselects a service, the component will **not** make a new API call.
    *   Instead, it will run a client-side function that re-calculates the `finalPrice` for all services based on the current selection.
    *   **Example Flow:**
        1.  User checks "Full Service".
        2.  The component adds `"fullService"` to its list of selected services.
        3.  It then iterates through the pricing data. It finds the "MOT" service object.
        4.  It checks the MOT's `discounts` array for an entry where `condition` is `"WITH_FULL_SERVICE"`.
        5.  If found, and if `"fullService"` is in the selected list, it updates the MOT's `finalPrice` to the `discountedPrice` (e.g., £19.99). If "Full Service" is deselected, it reverts the `finalPrice` to the `basePrice`.
        6.  The total price is then re-calculated by summing the `finalPrice` of all selected services.
    *   This client-side approach ensures that the UI updates instantly as the user interacts with the service list.
