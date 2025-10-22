# High-Level Implementation Plan: My Garage App

This document outlines the steps to build the "My Garage App" using Next.js and Tailwind CSS.

## 1. Project Setup & Styling

- Initialize a new Next.js project named `my-garage-app` using `create-next-app`.
- Ensure Tailwind CSS is selected during the setup process for styling.

## 2. Folder Structure

Create the following directory structure within the project root:

```
my-garage-app/
├── app/
│   ├── api/
│   │   ├── vehicle-lookup/
│   │   │   └── route.ts
│   │   ├── services/
│   │   │   └── route.ts
│   │   └── create-booking/
│   │       └── route.ts
│   ├── service/
│   │   └── [reg]/
│   │       └── page.tsx
│   ├── confirm/
│   │   └── page.tsx
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── shared/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── home/
│   │   └── RegistrationForm.tsx
│   ├── services/
│   │   ├── VehicleDetailsCard.tsx
│   │   └── ServiceSelector.tsx
│   └── confirm/
│       ├── BookingSummary.tsx
│       └── CustomerForm.tsx
│
├── lib/
│   └── api.ts
│
├── data/
│   ├── service-pricing.json
│   └── bookings.json
│
└── .env.local
```

## 3. Pages & Routing (The Workflow)

### Step 1: Homepage (`app/page.tsx`)

- **UI**: A server component rendering a centered heading and a registration form.
- **Component**: `components/home/RegistrationForm.tsx`
  - A client component (`'use client'`).
  - Contains an input field for the registration number and a "Get Prices" button.
  - On submission, it will redirect to `/service/{registrationNumber}`.

### Step 2: Service & Pricing Page (`app/service/[reg]/page.tsx`)

- A server component to fetch data before rendering.
- **Logic**:
  - Get the registration number from the page parameters.
  - Fetch vehicle data from an external API via `/api/vehicle-lookup`.
  - Fetch service prices from `service-pricing.json` via `/api/services`.
  - Pass the fetched data as props to client components.
- **Components**:
  - `components/services/VehicleDetailsCard.tsx`: Displays vehicle information.
  - `components/services/ServiceSelector.tsx`: A client component (`'use client'`) to manage service selection, calculate the total price, and navigate to the confirmation page on booking.

### Step 3: Confirmation Page (`app/confirm/page.tsx`)

- A client component (`'use client'`) to read URL query parameters.
- **Logic**:
  - Use `useSearchParams` to get booking details from the URL.
  - Display the booking summary.
- **Components**:
  - `components/confirm/BookingSummary.tsx`: Shows the selected car, service, and price.
  - `components/confirm/CustomerForm.tsx`: A form to collect customer details and submit them to `/api/create-booking`.

## 4. Backend API Routes (`app/api/...`)

### GET `/api/vehicle-lookup?reg=[number]`

- Receives a registration number.
- Reads the secret API key from `.env.local`.
- Calls the external UK Vehicle Data API.
- Returns the vehicle data as JSON.

### GET `/api/services?engineCC=[cc]`

- Receives the engine size.
- Reads `data/service-pricing.json`.
- Finds the matching price tier based on the engine CC.
- Returns the service prices.

### POST `/api/create-booking`

- Receives booking details in the request body.
- Reads `data/bookings.json`.
- Appends the new booking.
- Writes the updated data back to `data/bookings.json`.
- Returns a success message.
