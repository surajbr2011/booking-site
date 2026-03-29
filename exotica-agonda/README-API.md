# Exotica Agonda API Documentation

## Base URL
`/api`

## Endpoints

### Rooms
- **`GET /api/rooms`**: Returns paginated list of rooms. Supports query filters (`category`, `roomType`, `minPrice`, `maxPrice`, `occupancy`, `checkInDate`, `checkOutDate`).
- **`GET /api/rooms/:id`**: Returns a single room's details by the internal UUID `id`.

### Contact & Inquiries
- **`POST /api/contact`**: Submits a new guest inquiry. Required JSON body fields: `name`, `phone`, `message`. (Optional: `email`). Triggers SendGrid notification.

### Gallery Uploads
- **`GET /api/gallery`**: Returns a list of active gallery images.
- **`POST /api/gallery`**: Creates a new gallery image database record.
- **`POST /api/upload`**: Uploads an image file (`multipart/form-data` with an `image` File parameter) to Cloudinary and returns the URL.

### Search
- **`GET /api/search?q={query}`**: Global search that queries `Rooms` (by name/description) and `ContentPages` (by title/keywords).

### Content Management
- **`GET /api/content`**: Returns all published content pages.
- **`POST /api/content`**: Creates a new content page. Required fields: `pageSlug`, `pageTitle`.

---
*Note: All core APIs incorporate error-wrapping middleware (`withErrorHandler`) and public GET/POST APIs include fundamental LRU-cache driven Rate Limiting.*
