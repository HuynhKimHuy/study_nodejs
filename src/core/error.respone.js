const StatusCode ={
    FORBIDDEN:403, //Khog co quyen truy cap 
    CONFLICT: 409  // trung khop voi db 
}

const ResponseStatusCode = {
     FORBIDDEN:'Forbidden', //Khog co quyen truy cap 
     CONFLICT: "conflict Error"  // trung khop voi db 
}
class ErrorResponse extends Error{
    constructor(message,status){
        super(message)
        this.status = status
    }
}
export class BadRequestError extends ErrorResponse {
  constructor(message = ResponseStatusCode.FORBIDDEN, statusCode = StatusCode.FORBIDDEN) {
    super(message, statusCode);
  }
}
export  class ConflictRequestError extends ErrorResponse{
    constructor( message = ResponseStatusCode.CONFLICT, statusCode =StatusCode.CONFLICT ){
        super(message,statusCode)
    }
}

