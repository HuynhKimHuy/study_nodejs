
import NotificationModel from '../model/notifi.model.js';

class NotifiService {
    static async postNotiToSystem({
        type = "ORDER-001",
        senderId = 1,
        receiverId = 1,
        content = "Đơn hàng đã được tạo thành công",
        options = {}
    }) {
        let notiContent
        if (type === "ORDER-001") {
            notiContent = `@@@Đơn hàng:@@@ đã được tạo thành công`

        }
        else if (type === "ORDER-002") {
            notiContent = `@@@Đơn hàng:@@@ đã được giao thành công`
        }
        const newNoti = new NotificationModel({
            noti_types: type,
            noti_senderId: senderId,
            noti_receiverId: receiverId,
            noti_content: content,
            noti_options: options
        })
        await newNoti.save()
        return newNoti
    }

    static async ListNotiByUserId({
        userId = 1,
        type = 'All',
        isRead = 0
    }) {
        const match = { noti_receiverId: userId }
        if (type !== 'All') {
            // set the noti_types property on the match object
            match.noti_types = type
        }

        return await NotificationModel.aggregate(
            [
                {
                    $match: match
                },
                {
                    $project: {
                        noti_types: 1,
                        noti_senderId: 1,
                        noti_receiverId: 1,
                        noti_content: {
                            $concat: [
                                { $ifNull: ["$noti_options.shopName", ""] },
                                " vừa thêm sản phẩm mới: ",
                                { $ifNull: ["$noti_options.productName", ""] }
                            ]
                        },
                        noti_options: 1,
                    }
                }
            ]
        )
    }
}

export default NotifiService