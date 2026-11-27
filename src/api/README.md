# Frontend API integration

Set `VITE_API_BASE_URL` in `.env.local` to the API origin only (the default in `.env.example` is `http://localhost:8080`); do not append `/api` or `/api/v1`, because each API module supplies its complete `/api/v1/...` path. `VITE_AUTH_MODE=api` enables the Spring Boot authentication flow; set it to `demo` to use the existing mock-account login instead.

## Connected endpoints

| Feature | Method | Endpoint | Frontend behavior |
| --- | --- | --- | --- |
| Health | GET | `/api/v1/health` | Calls the Spring Boot health controller. |
| Register | POST | `/api/v1/auth/register` | Sends `fullName`, `email`, `phone`, and `password`; returns the created customer. |
| Login | POST | `/api/v1/auth/login` | Stores access and refresh tokens for the current browser tab. |
| Current profile | GET | `/api/v1/auth/me` | Adds the bearer token and restores the signed-in user after reload. |
| Update profile | PUT | `/api/v1/auth/profile` | Persists the supported `fullName` and `phone` fields. |
| Refresh token | POST | `/api/v1/auth/refresh-token` | Automatically refreshes an expired access token and retries the request. |
| Product listing, search, filters, sorting, pagination | GET | `/api/v1/products` | Home and category screens use the database-backed page response; available-only is the backend default. |
| Product detail | GET | `/api/v1/products/{idOrSlug}` | Loads product data, image URLs, category/subcategory, stock and usage details. |
| Related products | GET | `/api/v1/products/{idOrSlug}/related` | Loads related products for the detail page. |
| Categories | GET | `/api/v1/categories` | Loads active categories for browse filters and resolves route slugs to IDs. |
| Checkout | POST | `/api/v1/order/check-out` | Sends product IDs and quantities; displays the total calculated by Spring Boot. |
| My orders | GET | `/api/v1/order/my-orders` | Owner-scoped backend endpoint; order history screens have not yet been switched to it. |
| Order detail / cancellation | GET / PATCH | `/api/v1/order/my-orders/{id}` | Backend verifies ownership for both operations. |

The API client stores tokens in `sessionStorage`, never stores the submitted password, and clears the session on logout or failed token refresh. Roles returned by Spring Boot are mapped to the labels used by the current React routes.

## Features still using demo state

The customer-facing product catalog is API-backed. Manager product/category CRUD screens still use `ProductContext` and `localStorage`; cart contents and order-history screens also remain browser-local, although checkout now creates an owner-scoped backend order. Wishlist, forum, news, handbook, notifications, staff, and other manager data remain demo-backed. The documents in `planned/` describe proposals and should not be treated as active integrations.

The Express server under `server/` exposes only its own health endpoint on port 5000. It is not the primary backend and is not used by this integration.
