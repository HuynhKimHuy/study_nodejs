import app from "./untils/app.js";

const Port = process.env.PORT || 3052
const sever = app.listen(Port , ()=>{
    console.log(`Node Study đang lắng nghe trên ${Port}!`)
});

// prcess là đối tượng toàn cục của node js
// process.on lắng nghe các sự kiện trong tiến trình đang chạy

process.on('SIGINT', () => {
    sever.close(()=> console.log("dang đóng Node study"))
});


