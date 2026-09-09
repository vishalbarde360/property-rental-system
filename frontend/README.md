# RentNest React + Vite Frontend

Frontend for the Property Rental Platform backend. Built with React, Vite, React Router and Axios.

## Run
1. `npm install`
2. Copy `.env.example` to `.env`
3. Set `VITE_API_URL=http://localhost:5000/api/v1`
4. `npm run dev`

## Included
- Tenant/Owner registration and login
- Property search and filters
- Property details and applications
- Owner property listing and application review
- Payment history
- Admin analytics, user moderation, property moderation, reports
- Responsive mobile/tablet/desktop UI

The UI follows the supplied PRD's core journeys and screens. The backend already exposes the APIs consumed here. Image upload/payment gateway are intentionally kept as URL/record-based MVP flows because the current backend does not expose Cloudinary/Stripe/Razorpay upload or checkout endpoints.
