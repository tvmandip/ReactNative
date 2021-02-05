import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, Text, Button, StyleSheet, TextInput, TouchableOpacity, FlatList, Image } from 'react-native';
import { Bubble, GiftedChat, Send } from 'react-native-gifted-chat';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/Ionicons'

import database from '@react-native-firebase/database'
import { senderMsg, recieverMsg } from './control_msg'


const Chat = ({ route, navigation }) => {
    const [messages, setMessages] = useState([]);
    const [Name, setName] = useState(route.params.name)
    const [R_Name, set_RName] = useState(route.params.rname)
    const [r_id, set_Rid] = useState(route.params.rid)
    const [s_id, set_Sid] = useState(route.params.sid)

    const [data, setData] = useState()
    const [msg, setmsg] = useState();

    // console.log("userchat " + JSON.stringify(messages))

    useEffect(() => {
        try {
            database()
                .ref("Chats")
                .child(s_id)
                .child(r_id)
                .on("value", (dataSnapshot) => {
                    console.log(JSON.stringify(dataSnapshot))
                    let msgs = [];
                    dataSnapshot.forEach((child) => {
                        msgs.push({
                            sendBy: child.val().messege.sender,
                            recievedBy: child.val().messege.reciever,
                            msg: child.val().messege.msg,
                            time: child.val().messege.createdAt,
                            img: child.val().messege.img,
                        });
                    });
                    setMessages(msgs)
                    // console.log(msgs)
                })
        } catch (error) {
            alert(error);
        }

    }, []);



    const Send_img = () => {

        launchImageLibrary(
            {
                mediaType: 'photo',
                includeBase64: true,
                maxHeight: 200,
                maxWidth: 200,

            },
            (response) => {
                if (response.didCancel) {
                    console.log("User cancel image picker");
                } else if (response.error) {
                    console.log(" image picker error", response.error);
                } else {
                    console.log(response.base64);
                    let source = "data:image/jpeg;base64," + response.base64;

                    senderMsg(msg, s_id, r_id, source)
                        .then(() => { })
                        .catch((err) => alert(err));

                    // * guest user

                    recieverMsg(msg, s_id, r_id, source)
                        .then(() => { })
                        .catch((err) => alert(err));
                }
            },
        )

    }

    const Take_pic = () => {
        launchCamera(

            {
                mediaType: 'photo',
                includeBase64: true,
                maxHeight: 200,
                maxWidth: 200,

            },
            (response) => {
                if (response.didCancel) {
                    console.log("User cancel image picker");
                } else if (response.error) {
                    console.log(" image picker error", response.error);
                } else {
                    console.log("take img from camera" + response.base64);
                    let source = "data:image/jpeg;base64," + response.base64;
                    senderMsg(msg, s_id, r_id, source)
                        .then(() => { })
                        .catch((err) => alert(err));

                    // * guest user

                    recieverMsg(msg, s_id, r_id, source)
                        .then(() => { })
                        .catch((err) => alert(err));
                }
            }
        )
    }

    const onSend = () => {

        setmsg('')
        if (msg) {
            senderMsg(msg, s_id, r_id, "")
                .then(() => { })
                .catch((err) => alert(err));

            // * guest user

            recieverMsg(msg, s_id, r_id, "")
                .then(() => { })
                .catch((err) => alert(err));
        }

        // message._id = messageIdGenerator(),
        // message.createdAt = Date.now(),
        //     message.msg = msg,
        //     message.reciever = r_id,
        //     message.sender = s_id

        // database()
        //     .ref('chats/' + s_id)
        //     .child(r_id)
        //     .push({
        //         messege: {
        //             sender: s_id,
        //             reciever: r_id,
        //             msg: msg,
        //             createdAt: Date.now()
        //         }
        //     }).then((res) => console.log('message set.', JSON.stringify(res)), setmsg(''));
    }



    return (
        <View style={styles.container}>
            <View style={{
                height: 40, width: '100%', backgroundColor: '#2e64e5', justifyContent: 'center',
                alignContent: 'center', flexDirection: 'row'
            }}>
                <Icon name="md-chevron-back" size={30} color={"#FFF"}
                    style={{ position: 'absolute', left: 10, top: 5 }}
                    onPress={() => { navigation.pop() }}
                />
                <Text style={{ fontSize: 18, color: '#FFF', alignSelf: 'center' }}>
                    {R_Name}
                </Text>
            </View>
            <FlatList
                style={styles.list}
                data={messages}
                keyExtractor={(_, index) => index.toString()}
                renderItem={(message) => {

                    const item = message.item;
                    let inMessage = item.sendBy === s_id;
                    let itemStyle = inMessage ? styles.itemOut : styles.itemIn;
                    return (
                        <View>
                            <View style={[styles.item, itemStyle]}>
                                {
                                    item.img ?
                                        <Image
                                            source={{ uri: item.img }}
                                            style={{ height: 180, width: 180 }}
                                        />
                                        : <View style={[styles.balloon]}>
                                            <Text style={{ fontSize: 15 }}>{item.msg}</Text>
                                            <Text style={styles.time}>{item.time}</Text>
                                        </View>
                                }
                            </View>
                        </View>

                    )
                }} />
            <View style={styles.footer}>
                <View style={styles.inputContainer}>
                    <TextInput style={styles.inputs}
                        placeholder="Write a message..."
                        underlineColorAndroid='transparent'
                        value={msg}
                        onChangeText={(msg) => setmsg(msg)} />
                </View>
                <AntDesign
                    name="picture"
                    color="black" size={30} style={{ padding: 5 }}
                    onPress={() => { Take_pic() }}
                />
                <Icon
                    name="ios-camera-outline"
                    color="black" size={30} style={{ padding: 5 }}
                    onPress={() => { Send_img() }}
                />
                <TouchableOpacity
                    onPress={() => { onSend() }}
                    style={styles.btnSend}>
                    <Image source={{ uri: "https://img.icons8.com/small/75/ffffff/filled-sent.png" }} style={styles.iconSend} />
                </TouchableOpacity>
            </View>
        </View>


    );
};

export default Chat;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    list: {
        paddingHorizontal: 15,
    },
    footer: {
        flexDirection: 'row',
        height: 60,
        backgroundColor: '#eeeeee',
        paddingHorizontal: 10,
        padding: 5,
    },
    btnSend: {
        backgroundColor: "#00BFFF",
        width: 40,
        height: 40,
        borderRadius: 360,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconSend: {
        width: 30,
        height: 30,
        alignSelf: 'center',
    },
    inputContainer: {
        borderBottomColor: '#F5FCFF',
        backgroundColor: '#FFFFFF',
        borderRadius: 30,
        borderBottomWidth: 1,
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 10,
    },
    inputs: {
        height: 40,
        marginLeft: 16,
        borderBottomColor: '#FFFFFF',
        flex: 1,
    },
    balloon: {
        maxWidth: 250,
        padding: 10,
        borderRadius: 20,
    },
    itemIn: {
        alignSelf: 'flex-start'
    },
    itemOut: {
        alignSelf: 'flex-end'
    },
    time: {
        alignSelf: 'flex-end',
        // margin: 15,
        fontSize: 10,
        color: "#808080",
    },
    item: {
        marginVertical: 3,
        flex: 1,
        flexDirection: 'row',
        backgroundColor: "#eeeeee",
        borderRadius: 300,
        padding: 5,
    }
});



// const messageIdGenerator = () => {
//     // generates uuid.
//     return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
//         let r = (Math.random() * 16) | 0,
//             v = c == "x" ? r : (r & 0x3) | 0x8;
//         return v.toString(16);
//     });
// }