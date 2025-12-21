/**
 * Tạo hàm apiKey là 1 hàm middle ware nên là hàm aync 
 * step 1 : kiểm tra header, xem header của người dùng gửi lên có trùng với mặc định của HEADER.APIKEY hay khong, nếu không => báo lõi 403 Forbidden Error
 * step 2 : 
 */

const HEADER = {
    API_KEY : 'x-api-key',
    AUTHORIZATION : 'authorization'
}

