# Auth flows (login / signup / logout)

This README summarizes how login, signup, and logout work in this codebase, and where each step lives.

## Entry points and routing

- App entry: `src/sever.js` -> `src/untils/app.js`
- Router mount: `app.use('/', router)` in `src/untils/app.js`
- API prefix: `router.use('/v1/api', AccessRouter)` in `src/routes/index.js`
- Access routes: `src/routes/access/index.js`
  - `POST /v1/api/shop/signup`
  - `POST /v1/api/shop/login`
  - `POST /v1/api/shop/logout` (protected by `authentication` middleware)

## API key middleware (x-api-key)

File: `src/auth/checkAuth.js`

- `apiKey` middleware runs before all `/v1/api/*` routes if enabled in `src/routes/index.js`.
- It reads `req.headers['x-api-key']`.
- If missing -> throws `BadRequestError` with message "Forbiden Error form Header".
- If present -> calls `findByID` from `src/services/apiKey.service.js` to load the key from DB.
- When found -> sets `req.objKey` and calls `next()`.
- `permissions(permission)` checks `req.objKey.permissions` and blocks with 403 if missing.

Note: In `src/routes/index.js` the `apiKey` middleware is currently enabled. Login/signup will fail unless you send `x-api-key`.

## Signup flow (POST /v1/api/shop/signup)

Route: `src/routes/access/index.js` -> controller `src/controller/access.controller.js` -> service `src/services/access.service.js`.

`AccessService.SignUp` steps:

1) Check if the shop already exists:
   - `shopModel.findOne({ email }).lean()` in `src/services/access.service.js`.
   - If found -> throw `BadRequestError`.

2) Hash password:
   - `bcrypt.hash(password, 10)`.

3) Create shop:
   - `shopModel.create({ name, email, password: hashPassword, roles: [roles.SHOP] })`.
   - Model is `src/model/schema.js` (collection `shops`).

4) Generate keys:
   - `crypto.randomBytes(64)` for `privateKey` and `publicKey`.

5) Save key store:
   - `KeytokenService.createToken({ userID, privateKey, publicKey })` in `src/services/keyToken.service.js`.
   - Stored in `src/model/keytoken.model.js` (collection `keys`).

6) Create token pair:
   - `createTokenPair({ userID: newShop._id, email }, publicKey, privateKey)` from `src/auth/authUntil.js`.

7) Return response:
   - `Created` response with `shop` data and `tokens`.

## Login flow (POST /v1/api/shop/login)

Route: `src/routes/access/index.js` -> controller `src/controller/access.controller.js` -> service `src/services/access.service.js`.

`AccessService.login` steps:

1) Find shop by email:
   - `findByEmail({ email })` in `src/services/shop.service.js`.

2) Compare password:
   - `bcrypt.compare(password, foundShop.password)`.

3) Generate keys:
   - `crypto.randomBytes(64)` for `privateKey` and `publicKey`.

4) Create token pair:
   - `createTokenPair({ userID: foundShop._id, email: foundShop.email }, publicKey, privateKey)`.

5) Save key store:
   - `KeytokenService.createToken({ userID, publicKey, privateKey, refreshToken })`.

6) Return response:
   - Returns `shop` data and `tokens`.

## Logout flow (POST /v1/api/shop/logout)

Route: `src/routes/access/index.js` -> controller `src/controller/access.controller.js`.

- This route is protected by `authentication` middleware from `src/auth/authUntil.js`.
- On success, `req.keyStore` is available.
- The intended behavior in `AccessService.logout` is to remove the key store by ID.

## Authentication middleware

File: `src/auth/authUntil.js`

`authentication` steps (intended):

1) Read client ID from header `x-client-id`.
2) Find key store by user ID.
3) Read access token from `authorization` header.
4) Verify token with stored private key (tokens are signed with the private key).
5) Attach key store to `req.keyStore`, decoded payload to `req.user`, and call `next()`.

Headers required:

- `x-client-id: <shopId>`
- `authorization: <accessToken>`

## Example requests

These examples assume API key middleware is enabled and your server runs on port 3052.

### Signup

```bash
curl -X POST http://localhost:3052/v1/api/shop/signup \
  -H "Content-Type: application/json" \
  -H "x-api-key: <API_KEY>" \
  -d '{"name":"Demo Shop","email":"demo@email.com","password":"123456"}'
```

Example response:

```json
{
  "message": "Regisered OK",
  "status": 200,
  "metadata": {
    "code": 200,
    "metadata": {
      "shop": {
        "_id": "...",
        "name": "Demo Shop",
        "email": "demo@email.com"
      },
      "tokens": {
        "accessToken": "...",
        "refreshToken": "..."
      }
    }
  },
  "ResponseStatus": "CREATED"
}
```

### Login

```bash
curl -X POST http://localhost:3052/v1/api/shop/login \
  -H "Content-Type: application/json" \
  -H "x-api-key: <API_KEY>" \
  -d '{"email":"demo@email.com","password":"123456"}'
```

Example response:

```json
{
  "message": "login Ok",
  "status": 200,
  "metadata": {
    "shop": {
      "_id": "...",
      "name": "Demo Shop",
      "email": "demo@email.com"
    },
    "tokens": {
      "accessToken": "...",
      "refreshToken": "..."
    }
  },
  "ResponseStatus": "OK"
}
```

### Logout

```bash
curl -X POST http://localhost:3052/v1/api/shop/logout \
  -H "x-api-key: <API_KEY>" \
  -H "x-client-id: <SHOP_ID>" \
  -H "authorization: <ACCESS_TOKEN>"
```

Example response:

```json
{
  "message": "logout ok",
  "status": 200,
  "metadata": {},
  "ResponseStatus": "OK"
}
```

## Data models involved

- `src/model/schema.js`: Shop model (`shops` collection).
- `src/model/keytoken.model.js`: Key store model (`keys` collection).
- `src/model/keyAPI.js`: API key model (`ApiKeys` collection).

## Notes / remaining gotchas

- `src/services/apiKey.service.js` creates a new API key on every `findByID` call, which can flood the collection.
- API keys are not tied to a user; permissions are global.
- Signup response wraps `{ code, metadata }` inside the outer response metadata (`metadata.metadata`).
- Token keys are random strings (not a real public/private keypair), so treat them as shared secrets.
