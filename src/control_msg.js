import database from '@react-native-firebase/database'
var hours = new Date().getHours();
var min = new Date().getMinutes();
export const senderMsg = async (msg, s_id, r_id) => {
    try {
        return await
            database()
                .ref('Chats/' + s_id)
                .child(r_id)
                .push({
                    messege: {
                        sender: s_id,
                        reciever: r_id,
                        msg: msg,
                        createdAt: hours + ":" + min
                    },
                });
    } catch (error) {
        return error;
    }
};

export const recieverMsg = async (
    msg,
    s_id,
    r_id,

) => {
    try {
        return await
            database()
                .ref('Chats/' + r_id)
                .child(s_id)
                .push({
                    messege: {
                        sender: s_id,
                        reciever: r_id,
                        msg: msg,
                        createdAt: hours + ":" + min
                    },
                });
    } catch (error) {
        return error;
    }
};
