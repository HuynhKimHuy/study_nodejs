
import mongoose, {Schema} from 'mongoose'
const DOCUMENT_NAME = 'key'
const COLECTION_NAME ='keys'

const keyTokenSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        require:true,
        ref:'Shop'
    },
    publicKey:{
        type:String,
        require:true,

    },
    privateKey:{
         type:String,
        require:true,
    },
    
    refreshTokensUsed:{
        type:Array,
        default:[]
    },
     refreshToken:{
        type:String,
        require:true
    },
},{
    collection: COLECTION_NAME,
    timestamps:true
})

const keyTokenModal = mongoose.model(DOCUMENT_NAME,keyTokenSchema)
export default keyTokenModal
