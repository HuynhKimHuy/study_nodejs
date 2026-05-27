const REFRESH_COOKIE_NAME = 'refreshToken'

const defaultCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000,
    path: '/'
}

export const setRefreshTokenCookie = (res, refreshToken, options = {}) => {
    if (!refreshToken) return
    res.cookie(REFRESH_COOKIE_NAME, refreshToken, { ...defaultCookieOptions, ...options })
}

export const clearRefreshTokenCookie = (res, options = {}) => {
    res.clearCookie(REFRESH_COOKIE_NAME, { path: '/', ...options })
}

export const getRefreshTokenFromCookies = (req) => {
    return req.cookies?.[REFRESH_COOKIE_NAME]
}
