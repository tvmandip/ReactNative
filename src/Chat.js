import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, Text, Button, StyleSheet, TextInput, TouchableOpacity, FlatList, Image } from 'react-native';
import { Bubble, GiftedChat, Send } from 'react-native-gifted-chat';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Ionicons'

import database from '@react-native-firebase/database'



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
                .ref('/chats')
                // .child(s_id)
                .child(r_id)
                .on('value', (snapshot) => {
                    console.log(snapshot.val())
                    var msgs = []
                    snapshot.forEach((child) => {
                        msgs.push({
                            key: child.key,
                            msg: child.val().msg.text,
                            // id: child.val().meg._id,
                            Rid: child.val().msg.r_id,
                            Sid: child.val().msg.s_id
                        })
                        console.log("Chats " + JSON.stringify(msgs))
                        setMessages(msgs)
                    })

                })
        } catch (error) {
            alert(error);
        }
        // setMessages([
        //     {
        //         _id: 1,
        //         text: 'Hello developer',
        //         createdAt: new Date(),
        //         user: {
        //             _id: 2,
        //             name: 'React Native',
        //             avatar: 'https://placeimg.com/140/140/any',
        //         },
        //     },
        //     {
        //         _id: 2,
        //         text: 'Hello world',
        //         createdAt: new Date(),
        //         user: {
        //             _id: 1,
        //             name: 'React Native',
        //             avatar: 'https://placeimg.com/140/140/any',
        //         },
        //     },
        //     {
        //         _id: 3,
        //         text: 'Hello abc',
        //         createdAt: new Date(),
        //         user: {
        //             _id: 2,
        //             name: 'React Native',
        //             avatar: 'https://placeimg.com/140/140/any',
        //         },
        //     },
        //     {
        //         _id: 6,
        //         text: 'Hello abc',
        //         createdAt: new Date(),
        //         user: {
        //             _id: 2,
        //             name: 'React Native',
        //             avatar: 'https://placeimg.com/140/140/any',
        //         },
        //     },
        // ]);
    }, []);

    const messageIdGenerator = () => {
        // generates uuid.
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
            let r = (Math.random() * 16) | 0,
                v = c == "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }

    // const onSend = useCallback((messages = []) => {
    //     // setMessages((previousMessages) =>
    //     //     GiftedChat.append(previousMessages, messages),
    //     // );

    //     const message = {};
    //     message._id = messageIdGenerator(),
    //         message.createdAt = Date.now(),
    //         message.text = msg,
    //         message.r_id = r_id,
    //         message.s_id = s_id
    //     // message.user = {
    //     //     _id: r_id,
    //     //     name: R_Name
    //     // }
    //     database()
    //         .ref('/chats')
    //         .push({
    //             // name: Name,
    //             // sender_id: s_id,
    //             // receiver_id: r_id,
    //             message: message,

    //         }).then((res) => console.log('Data set.', JSON.stringify(res)));


    // }, []);
    const onSend = () => {
        const message = {};

        // message._id = messageIdGenerator(),
        message.createdAt = Date.now(),
            message.text = msg,
            message.r_id = r_id,
            message.s_id = s_id

        database()
            .ref('chats/' + r_id)
            .push({
                s_id,
                msg: message


            }).then((res) => console.log('Data set.', JSON.stringify(res)), setmsg(''));
    }

    const renderSend = (props) => {
        return (
            <Send {...props}>
                <View>
                    <MaterialCommunityIcons
                        name="send-circle"
                        style={{ marginBottom: 5, marginRight: 5 }}
                        size={40}
                        color="#2e64e5"
                    />
                </View>
            </Send>
        );
    };

    const renderBubble = (props) => {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: '#2e64e5',
                    },
                }}
                textStyle={{
                    right: {
                        color: '#fff',
                    },
                }}
                {...props}
                wrapperStyle={{
                    left: {
                        backgroundColor: '#2e64e5',
                    },
                }}
                textStyle={{
                    left: {
                        color: 'white',
                    },
                }}
            />
        );
    };

    const scrollToBottomComponent = () => {
        return (
            <FontAwesome name='angle-double-down' size={22} color='#333' />
        );
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
            <FlatList style={styles.list}
                data={messages}
                keyExtractor={(item) => {
                    return item.id;
                }}
                renderItem={(message) => {

                    const item = message.item;
                    let inMessage = item.Sid === s_id;
                    let itemStyle = inMessage ? styles.itemOut : styles.itemIn;
                    return (
                        <View style={[styles.item, itemStyle]}>
                            {/* {!inMessage && this.renderDate(item.date)} */}
                            {console.log(item)}
                            <View style={[styles.balloon]}>
                                <Text>{item.msg}</Text>
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
        paddingHorizontal: 17,
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
        padding: 15,
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
        margin: 15,
        fontSize: 12,
        color: "#808080",
    },
    item: {
        marginVertical: 14,
        flex: 1,
        flexDirection: 'row',
        backgroundColor: "#eeeeee",
        borderRadius: 300,
        padding: 5,
    }
});
