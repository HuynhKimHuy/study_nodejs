
import mongoose, { Schema } from "mongoose";

const DOCUMENT_NAME = "shop"
const COLECCTION_NAME  = 'shops'

const ShopSchema  = new mongoose.Schema({
  name: {
    type: String,
    trim:true,
    maxLength: 150
  },
  email: {
    type: String,
    trim:true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['active','inactive'],
    default:'inactive',
    
  },
  verfify:{
    type: Schema.Types.Boolean, 
    default:false
  },
  roles:{
    type: Array,
    default:[]
  }
},
  {
    timestamps:true,
    collection:COLECCTION_NAME 
  });

// ✅ Xuất model theo cú pháp ES6
const Shops = mongoose.model(DOCUMENT_NAME, ShopSchema);

export default Shops;
