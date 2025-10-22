### **High-Level Strategy**

We will build the admin interface as a single, comprehensive page, leveraging a powerful form library to manage the complex state and validation requirements. The UI will be broken down into modular, reusable components, each corresponding to a distinct section of the admin panel (e.g., "MOT (Class 4)," "Delivery Options," etc.).

For data persistence, we will start with a local `adminData.json` file and create API endpoints to read and write to this file. This will allow us to build and test the UI independently of a database, with a clear path for future integration.

### **1. Technology Stack**

*   **UI Framework:** Next.js (already in use)
*   **Styling:** Tailwind CSS (already in use)
*   **Form Management:** We will use **React Hook Form** for its performance and ease of use with complex forms.
*   **Schema Validation:** **Zod** will be integrated with React Hook Form to ensure type-safe and robust validation.
*   **UI Components:** We will use **Shadcn/UI** to create a consistent and accessible component library. This will help us build the UI faster while maintaining a high-quality look and feel.

### **2. Project Structure**

We will create a new `admin` directory inside the `app` folder to house the new admin page. The component structure will be as follows:

```
my-garage-app/
├── app/
│   ├── admin/
│   │   ├── page.tsx               # Main admin page component
│   │   └── components/
│   │       ├── MOTForm.tsx
│   │       ├── DeliveryOptionsForm.tsx
│   │       ├── CustomProductsForm.tsx
│   │       ├── SinglePriceProductsForm.tsx
│   │       ├── ProductsForm.tsx
│   │       ├── VehicleSafetyCheckForm.tsx
│   │       ├── PricingForm.tsx
│   │       ├── ServicingForm.tsx
│   │       ├── OffersForm.tsx
│   │       ├── CommonRepairsForm.tsx
│   │       ├── OffersAndExtrasForm.tsx
│   │       └── shared/
│   │           ├── FormSection.tsx      # Wrapper for each form section
│   │           ├── FormInput.tsx        # Reusable input component
│   │           ├── FormCheckbox.tsx     # Reusable checkbox component
│   │           └── FormDayPicker.tsx    # Reusable day picker component
├── data/
│   └── adminData.json             # Initial data for the admin panel
└── types/
    └── adminData.ts               # TypeScript interfaces for the admin data
```

### **3. Data Handling**

1.  **`adminData.json`:** We will create a new file at `my-garage-app/data/adminData.json` that will store the initial state of the admin panel. The structure of this file will be based on the `AdminData` interface defined in `my-garage-app/types/adminData.ts`.

2.  **API Endpoints:** We will create two API endpoints:
    *   `GET /api/admin-data`: This endpoint will read the `adminData.json` file and return its contents.
    *   `POST /api/admin-data`: This endpoint will receive the updated admin data from the client and write it to the `adminData.json` file.

### **4. Implementation Plan**

#### **Step 1: Setup and Dependencies**

1.  Install the required libraries:
    ```bash
    npm install react-hook-form @hookform/resolvers zod shadcn-ui
    ```
2.  Initialize Shadcn/UI and select the necessary components (e.g., `Input`, `Checkbox`, `Button`, `Card`).

#### **Step 2: Create the Main Admin Page**

1.  Create the main admin page at `my-garage-app/app/admin/page.tsx`.
2.  This page will be responsible for fetching the initial data from the `/api/admin-data` endpoint.
3.  We will use the `useForm` hook from React Hook Form to manage the entire form state.
4.  The page will render each of the form section components, passing the necessary form control and data down as props.

#### **Step 3: Build Reusable Form Components**

1.  Create the shared form components in `my-garage-app/app/admin/components/shared/`.
2.  These components will be wrappers around the Shadcn/UI components, integrating them with React Hook Form.

#### **Step 4: Implement Each Form Section**

For each section of the admin UI, we will create a dedicated component. Below are the detailed UI specifications for each component based on the provided images.

**`MOTForm.tsx` (MOT (Class 4) & (Class 7))**

*   **Layout:** The section will be a `Card` component from Shadcn/UI. The title (e.g., "MOT (Class 4)") will be in a `CardHeader`. The content will be in the `CardContent` using a two-column layout (CSS Grid `grid-cols-2`). This component will be reused for both MOT Class 4 and Class 7, differentiated by props.
*   **Components & Styling:**
    *   **Enabled Checkbox:** A `Checkbox` with a `Label` "Enabled".
    *   **Standard Price:** A `Label` "Standard Price" above an `Input` component with a "£" prefix.
    *   **Lead Time:** A `Label` "Class 4 MOT Lead Time (Working Days)" with a tooltip icon. Below it, an `Input` for the number of days and a `Checkbox` with a `Label` "Enabled".
    *   **Availability:** A `Label` "Class 4 Availability". Below it, a group of `Toggle` components for each day of the week. Active days will have a green background (`bg-green-500`) and white text (`text-white`).
    *   **Discounts:** A `div` on the right column containing a description and fields for each service discount (Interim, Full, Major). Each discount will have a `Label`, an `Input` with a "£" prefix, and a `Checkbox` with a `Label` "Enabled".

**`DeliveryOptionsForm.tsx`**

*   **Layout:** A `Card` component containing a `Table` from Shadcn/UI.
*   **Components & Styling:**
    *   **Table Header:** `TableHeader` with a dark blue background (`bg-blue-900`) and white text (`text-white`). Columns: "Enabled", "Name", "Availability", "Allow MOTs", "Price with MOT (£)", "Price with Service (£)", "Lead Time (Working Days)", and "Max Distance (Miles)".
    *   **Table Body:** `TableBody` where each row represents a delivery option. The row will contain `Checkbox`, plain text, day `Toggle` group, and `Input` components as required.

**`CustomProductsForm.tsx`**

*   **Layout:** A `Card` with a `Table`.
*   **Components & Styling:**
    *   **Table Header:** Dark blue background, white text. Columns: "#", "Enabled Name", "Extra Description", "Below 2000cc Price", "Above 2000cc Price", "Petrol", "Diesel", "Electric".
    *   **Table Body:** Each row will contain `Checkbox`, `Input`, `Textarea`, and a delete icon `Button`.

**`SinglePriceProductsForm.tsx`**

*   **Layout:** A `Card` with a `Table`.
*   **Components & Styling:**
    *   **Table Header:** Dark blue background, white text. Columns: "Enabled Products", "Default Price", "Enable Service Price", "Price With Service".
    *   **Table Body:** Each row will contain a `Checkbox` with a `Label`, and `Input` fields.

**`ProductsForm.tsx`**

*   **Layout:** A `Card` with a `Table`.
*   **Components & Styling:**
    *   **Table Header:** Dark blue background, white text. Columns: "Enabled Products", "0cc - 1500cc", "1501cc - 2400cc", "2401cc or above".
    *   **Table Body:** Each row will have a `Checkbox` with a `Label` and `Input` fields for each price category.

**`VehicleSafetyCheckForm.tsx`**

*   **Layout:** A `Card` with a main `flex-col` layout and a two-column grid (`grid-cols-2`) for the discounted prices.
*   **Components & Styling:**
    *   Two `Checkbox` components at the top for enabling the safety check and the free discount card option.
    *   `Label` and `Input` for the base "Price".
    *   The grid will contain fields for "Price with MOT", "Price with Interim Service", etc., each with a `Label`, `Input`, and `Checkbox`.

**`PricingForm.tsx`**

*   **Layout:** A `Card` containing two separate `Table` components.
*   **Components & Styling:**
    *   **First Table (Prices):** Columns for service type and engine size. Each row starts with a `Checkbox` and `Label`. Cells contain prices.
    *   **Second Table (Data Points):** Rows for "Oil Qty.", "Air Filter", etc., and columns for engine sizes. Cells contain `Input` components.

**`ServicingForm.tsx`**

*   **Layout:** A `Card` with a two-column grid layout.
*   **Components & Styling:**
    *   **Left Column:** `Input` fields for "Servicing Lead Time", "Service Labour Rate", and "Electrical Vehicle Labour Rate", with associated `Label`s and a `Checkbox`.
    *   **Right Column:** `Input` fields for "Standard Oil" and "Specialist Oil" prices with `Label`s.

**`OffersForm.tsx`**

*   **Layout:** A `Card` with a simple two-column form layout.
*   **Components & Styling:**
    *   `Label` "Product" and a `Select` component.
    *   A `Reset` `Button`.
    *   `Label` "Offer Content" and an `Input`.
    *   `Label` "Tooltip Content" and an `Input`.

**`CommonRepairsForm.tsx`**

*   **Layout:** A `Card` containing a form section followed by a `Table`.
*   **Components & Styling:**
    *   An `Input` for "Mechanical Labour Rate".
    *   Descriptive text paragraphs.
    *   A `Table` with a dark blue header. Columns: "Enabled", "Product", "OEM Parts Price Modifier %", "Example Price", "Lead Time (Working Days)".
    *   Table body rows will contain a `Checkbox`, product name, an `Input` for percentage, `Switch` toggles for "Decrease"/"Increase", example price text, and a `Checkbox` with an `Input` for lead time.

**`OffersAndExtrasForm.tsx`**

*   **Layout:** A `Card` with a `Table`.
*   **Components & Styling:**
    *   **Table Header:** Dark blue background, white text. Column: "Enabled Products".
    *   **Table Body:** Each row will have a `Checkbox` and a `Label`.

### **5. Completed Steps**

The following items have been completed:

1.  **`adminData.json` Created:** The file has been created at `my-garage-app/data/adminData.json` with an initial data structure that aligns with the `AdminData` interface in `my-garage-app/types/adminData.ts`.
2.  **`GET` API Endpoint Created:** The `GET /api/admin-data` endpoint has been created to read and serve the contents of the `adminData.json` file.

This concludes the planned work for now. The project is set up for the next phase of development, which will involve creating the UI components and the `POST` API endpoint with Zod validation.
