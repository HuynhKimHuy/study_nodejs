# Frontend README (Next.js) — API Summary & Project Structure

Tài liệu này tóm tắt API hiện có của backend và đề xuất cấu trúc thư mục cho frontend Next.js.

## Thông tin chung
- Base URL (local): `http://localhost:3052`
- Prefix API: `/v1/api`

### Header bắt buộc
1) **API Key** (bắt buộc cho tất cả endpoint trừ signup)
- `x-api-key: <API_KEY>`
- Key seed có sẵn (theo `docs/api-test-guide.md`):
  `dfc240da14f111f18ca353e948e08d9358e537cf1bf73d08cd57421f7d880358`

2) **Authentication (JWT)**
- `x-client-id: <shop_id>`
- `authorization: <access_token>`

3) **Refresh token**
- `refreshtoken: <refresh_token>`

### Response format (chuẩn chung)
Các response thường có dạng:
```json
{
  "message": "...",
  "status": 200,
  "metadata": { ... },
  "ResponseStatus": "OK"
}
```

## Luồng tài khoản (Shop)
### 1) Signup (Public)
- `POST /v1/api/shop/signup`
- Headers: `Content-Type: application/json`
- Body:
```json
{ "name": "Demo Shop", "email": "demo@email.com", "password": "123456" }
```

### 2) Login (API Key)
- `POST /v1/api/shop/login`
- Headers: `Content-Type: application/json`, `x-api-key`
- Body:
```json
{ "email": "demo@email.com", "password": "123456" }
```

### 3) Logout (API Key + Auth)
- `POST /v1/api/shop/logout`
- Headers: `x-api-key`, `x-client-id`, `authorization`

### 4) Refresh token (API Key + Auth)
- `POST /v1/api/shop/handleRefreshToken`
- Headers: `x-api-key`, `x-client-id`, `refreshtoken`

## Product
> Lưu ý: Tất cả route `/v1/api/product/*` đều cần `x-api-key`.
> - **Không cần auth** cho: search, list, detail.
> - **Cần auth** cho: create/update/publish/unpublish/drafts/published.

### Public
- `GET /v1/api/product/search/:keySearch`
- `GET /v1/api/product` (list, hỗ trợ query: `page`, `limit`, `sort`, `filter`...)
- `GET /v1/api/product/:product_id`

### Authenticated
- `POST /v1/api/product` (create)
- `PATCH /v1/api/product/:product_id` (update)
- `POST /v1/api/product/publish/:id`
- `POST /v1/api/product/unPublish/:id`
- `GET /v1/api/product/drafts/all`
- `GET /v1/api/product/published/all`

#### Create/Update body mẫu
```json
{
  "product_name": "Headphone X",
  "product_thumb": "https://img.example.com/hp.jpg",
  "product_description": "Noise-cancelling",
  "product_price": 199,
  "product_quantity": 10,
  "product_type": "Electronic",
  "product_attributes": {
    "manufacturer": "Sony",
    "size": "OneSize",
    "color": "Black"
  }
}
```
`product_type` hợp lệ: `Electronic`, `Clothing`, `Furniture`.

## Cart
> Router không gắn `authentication`, nhưng vẫn nằm sau `apiKey` middleware.
> Các API này **yêu cầu truyền `userId` trong body/query**.

- `POST /v1/api/cart` (add)
  - Body: `{ "userId": "...", "product": { "productId": "...", "quantity": 1 } }`

- `POST /v1/api/cart/update` (update quantity)
  - Body (theo service):
```json
{
  "userId": "...",
  "shop_order_ids": [
    {
      "shopId": "...",
      "item_product": [
        { "productId": "...", "quantity": 2, "old_quantity": 1 }
      ]
    }
  ]
}
```

- `DELETE /v1/api/cart`
  - Body: `{ "userId": "...", "productId": "..." }`

- `GET /v1/api/cart?userId=...`

## Checkout
> Có `x-api-key`, **không gắn authentication** trong router.

- `POST /v1/api/checkout/review`
- Body mẫu:
```json
{
  "userId": "...",
  "cartId": "...",
  "shop_order_ids": [
    {
      "shopId": "...",
      "shop_discount": {
        "shopId": "...",
        "codeId": "DISCOUNT_CODE"
      },
      "item_product": [
        { "productId": "...", "quantity": 2, "old_quantity": 1 }
      ]
    }
  ]
}
```

## Discount
> `x-api-key` bắt buộc cho tất cả.

### Public (không auth)
- `POST /v1/api/discount/amount`
  - Body:
```json
{
  "codeId": "DISCOUNT_CODE",
  "shopId": "...",
  "userId": "...",
  "products": [
    { "productId": "...", "quantity": 2, "price": 199 }
  ]
}
```

- `GET /v1/api/discount/list_product_code?code=...&shopId=...&page=1&limit=20`

### Authenticated
- `POST /v1/api/discount`
  - Body (rút gọn):
```json
{
  "code": "DISCOUNT_CODE",
  "name": "Summer Sale",
  "description": "...",
  "type": "percentage",
  "value": 10,
  "start_date": "2026-05-01",
  "end_date": "2026-05-31",
  "applies_to": "all",
  "product_ids": []
}
```

- `GET /v1/api/discount?limit=20&page=1`

## Inventory (Authenticated)
- `POST /v1/api/inventory`
- Body:
```json
{ "productId": "...", "stock": 100, "location": "HCM" }
```

## Comment
> Có `x-api-key`, **không gắn authentication** trong router.

- `POST /v1/api/comment`
  - Body: `{ "productId": "...", "userId": "...", "content": "...", "parentCommentId": null }`

- `GET /v1/api/comment?productId=...&parentCommentId=...&limit=10&offset=0`

- `DELETE /v1/api/comment`
  - Body: `{ "commentId": "...", "productId": "..." }`

---

# Đề xuất cấu trúc Next.js
Giả định dùng **Next.js App Router**.

```
my-ecommerce-frontend/
├─ public/
├─ src/
│  ├─ app/
│  │  ├─ (public)/
│  │  │  ├─ page.tsx                # Home
│  │  │  ├─ products/
│  │  │  │  ├─ page.tsx             # Product list
│  │  │  │  └─ [id]/page.tsx        # Product detail
│  │  │  └─ auth/
│  │  │     ├─ login/page.tsx
│  │  │     └─ signup/page.tsx
│  │  ├─ (protected)/
│  │  │  ├─ dashboard/page.tsx
│  │  │  ├─ products/
│  │  │  │  ├─ page.tsx             # Manage products
│  │  │  │  └─ [id]/edit/page.tsx
│  │  │  ├─ cart/page.tsx
│  │  │  ├─ checkout/page.tsx
│  │  │  └─ orders/page.tsx
│  │  ├─ layout.tsx
│  │  ├─ loading.tsx
│  │  └─ error.tsx
│  ├─ components/
│  │  ├─ ui/                        # Button, Input, Modal...
│  │  ├─ layout/                    # Header, Footer, Sidebar
│  │  └─ product/                   # Card, Gallery, Price
│  ├─ features/
│  │  ├─ auth/
│  │  │  ├─ api.ts                  # login/signup/refresh
│  │  │  ├─ hooks.ts
│  │  │  └─ types.ts
│  │  ├─ product/
│  │  │  ├─ api.ts
│  │  │  ├─ hooks.ts
│  │  │  └─ types.ts
│  │  ├─ cart/
│  │  │  ├─ api.ts
│  │  │  ├─ hooks.ts
│  │  │  └─ types.ts
│  │  ├─ checkout/
│  │  ├─ discount/
│  │  └─ comment/
│  ├─ lib/
│  │  ├─ api/
│  │  │  ├─ client.ts               # fetch wrapper
│  │  │  ├─ endpoints.ts            # base URLs
│  │  │  └─ headers.ts              # x-api-key, auth
│  │  ├─ auth/
│  │  │  ├─ token.ts                # token utils
│  │  │  └─ guard.ts                # route guard helpers
│  │  └─ utils/
│  ├─ store/                        # Zustand/Redux (optional)
│  ├─ hooks/
│  ├─ styles/
│  └─ types/
├─ .env.local
├─ next.config.js
├─ package.json
└─ README.md
```

## Gợi ý thiết kế API client
- `src/lib/api/client.ts`: setup base URL, timeout, error handler.
- `src/lib/api/headers.ts`: inject `x-api-key`, `x-client-id`, `authorization`, `refreshtoken`.
- `src/features/*/api.ts`: mỗi domain gọi endpoint tương ứng.

---

## Checklist nhanh cho frontend
- Lưu `x-api-key` ở env (`NEXT_PUBLIC_API_KEY`).
- Lưu `accessToken`, `refreshToken`, `shopId` trong storage an toàn (cookie/httpOnly nếu có SSR).
- Với API cần auth, luôn attach `x-client-id` + `authorization`.
- Các API cart/checkout/comment yêu cầu `userId` trong body/query.

Nếu bạn muốn mình viết sẵn `api client`, `types`, hoặc layout khởi tạo Next.js, cứ nói nhé.