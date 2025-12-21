
import mongoose from "mongoose";
import os from 'os'
import process from "process";
const _SECOND = 5000
// function check total connect to database
 export const countConect = () =>{
    const count  = mongoose.connections.length
    console.log("tổng số kết nối là " + count)
    return count
} 

//function check overload databse 

export const checkOverLoad = ()=>{
    setInterval(()=>{
        const numConection = mongoose.connections.length
        const numCore = os.cpus().length
        const memoryUsage = process.memoryUsage().rss
        const maxConection = numCore * 5

        console.log(`Active conection: ${numConection}` );
        console.log(`MemoryUsage: ${memoryUsage /1024 / 1024} MB`);
        
        if(numConection > maxConection){
            console.log("conection overload detected ")
        }
    },
    _SECOND
)
}

 
