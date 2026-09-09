# Property Rental Platform — Complete Simple MERN Backend

Backend-only implementation based on the supplied PRD. Stack: **Node.js, Express, MongoDB/Mongoose, JWT, bcryptjs**.

## API map

### Auth
- POST `/api/v1/auth/register`
- POST `/api/v1/auth/login`
- POST `/api/v1/auth/logout`
- POST `/api/v1/auth/forgot-password`
- POST `/api/v1/auth/reset-password/:token`
- GET `/api/v1/auth/me`

### Properties
- GET `/api/v1/properties`
- GET `/api/v1/properties/:id`
- GET `/api/v1/properties/owner/my` (owner)
- POST `/api/v1/properties` (owner)
- PATCH `/api/v1/properties/:id` (owner)
- DELETE `/api/v1/properties/:id` (owner)

Filters: `city`, `type`, `minRent`, `maxRent`, `bedrooms`, `available`, `page`, `limit`.

### Saved Properties
- GET `/api/v1/properties/saved/my` (tenant)
- POST `/api/v1/properties/:id/save` (tenant)
- DELETE `/api/v1/properties/:id/save` (tenant)

### Applications
- GET `/api/v1/applications`
- GET `/api/v1/applications/:id`
- POST `/api/v1/applications/property/:propertyId` (tenant)
- PATCH `/api/v1/applications/:id/status` (owner)

Statuses: `draft`, `submitted`, `under_review`, `approved`, `rejected`.

### Payments
- GET `/api/v1/payments`
- GET `/api/v1/payments/:id`
- POST `/api/v1/payments`
- PATCH `/api/v1/payments/:id`

Types: `rent`, `deposit`; statuses: `pending`, `success`, `failed`.

### Owner Earnings
- GET `/api/v1/payments/owner/earnings` (owner) — total & pending earnings from `success`/`pending` payments received by the logged-in owner, plus a per-property breakdown.

### Reviews
- POST `/api/v1/reviews` (eligible tenant)
- GET `/api/v1/reviews/property/:propertyId`
- DELETE `/api/v1/reviews/:id`

### Reports
- POST `/api/v1/reports`
- GET `/api/v1/reports`
- PATCH `/api/v1/reports/:id` (admin)

### Admin
- GET `/api/v1/admin/users`
- PATCH `/api/v1/admin/users/:id`
- GET `/api/v1/admin/properties`
- PATCH `/api/v1/admin/properties/:id`
- GET `/api/v1/admin/reports`
- GET `/api/v1/admin/analytics`

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Set `MONGO_URI` and `JWT_SECRET` in `.env`.

> Password reset returns a development reset token in the API response. In production, send the token through email instead. Payment routes are record-based and do not store card data.
