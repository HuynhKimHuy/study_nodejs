const statusCode ={
    FORBIDDEN:403, /
    CONFLICT: 409
}


class ErrorResponse extends Error{
    constructor(message,status){
        super(message)
        this.status = status
    }
}