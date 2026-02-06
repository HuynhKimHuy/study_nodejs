const StatusCode = {
  BAD_REQUEST: 400,     // Yêu cầu không hợp lệ
  UNAUTHORIZED: 401,    // Chưa xác thực / token sai
  FORBIDDEN: 403,       // Không có quyền truy cập
  NOT_FOUND: 404,       // Không tìm thấy
  CONFLICT: 409,        // Trùng dữ liệu
  TOO_MANY: 429,        // Quá nhiều request
  SERVER_ERROR: 500     // Lỗi server
}

const ResponseStatusCode = {
  BAD_REQUEST: 'Bad Request',
  UNAUTHORIZED: 'Unauthorized',
  FORBIDDEN: 'Forbidden',
  NOT_FOUND: 'Not Found',
  CONFLICT: 'Conflict',
  TOO_MANY: 'Too Many Requests',
  SERVER_ERROR: 'Internal Server Error'
}

class ErrorResponse extends Error{
    constructor(message,status){
        super(message)
        this.status = status
    }
}
export class BadRequestError extends ErrorResponse {
  constructor(message = ResponseStatusCode.BAD_REQUEST, statusCode = StatusCode.BAD_REQUEST) {
    super(message, statusCode);
  }
}

export class UnauthorizedError extends ErrorResponse {
  constructor(message = ResponseStatusCode.UNAUTHORIZED, statusCode = StatusCode.UNAUTHORIZED) {
    super(message, statusCode)
  }
}

export class ForbiddenError extends ErrorResponse {
  constructor(message = ResponseStatusCode.FORBIDDEN, statusCode = StatusCode.FORBIDDEN) {
    super(message, statusCode)
  }
}

export class ConflictRequestError extends ErrorResponse {
  constructor(message = ResponseStatusCode.CONFLICT, statusCode = StatusCode.CONFLICT) {
    super(message, statusCode)
  }
}

export class NotFoundError extends ErrorResponse {
  constructor(message = ResponseStatusCode.NOT_FOUND, statusCode = StatusCode.NOT_FOUND) {
    super(message, statusCode)
  }
}

export class TooManyRequestsError extends ErrorResponse {
  constructor(message = ResponseStatusCode.TOO_MANY, statusCode = StatusCode.TOO_MANY) {
    super(message, statusCode)
  }
}

export class InternalServerError extends ErrorResponse {
  constructor(message = ResponseStatusCode.SERVER_ERROR, statusCode = StatusCode.SERVER_ERROR) {
    super(message, statusCode)
  }
}

export class AuthFailureError extends ErrorResponse {
  constructor(message = ResponseStatusCode.UNAUTHORIZED, statusCode = StatusCode.UNAUTHORIZED) {
    super(message, statusCode)
  }
}
