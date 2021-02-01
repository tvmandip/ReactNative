import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, Text, Button, StyleSheet } from 'react-native';
import { Bubble, GiftedChat, Send } from 'react-native-gifted-chat';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import database from '@react-native-firebase/database'

const Chat = ({ route, navigation }) => {
    const [messages, setMessages] = useState([]);
    const [Name, setName] = useState(route.params.name)
    const [r_id, set_Rid] = useState(route.params.rid)
    const [s_id, set_Sid] = useState(route.params.sid)

    useEffect(() => {
        database().ref('/chats').on('value', (snapshot) => {
            console.log(snapshot.val())
            var li = []
            snapshot.forEach((child) => {
                li.push({
                    key: child.key,
                    name: child.val().name,
                    msg: child.val().message.text,
                    // email: child.val().email,
                    // id: child.val().userid
                })
                // console.log(snapshot.val())
                setMessages(snapshot.val())
            })
        })
        // console.log(Name + "recvie " + r_id + " send " + s_id)
        console.log(messages)
        setMessages([
            {
                _id: 1,
                text: 'Hello developer',
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: 'React Native',
                    avatar: 'https://placeimg.com/140/140/any',
                },
            },
            {
                _id: 2,
                text: 'Hello world',
                createdAt: new Date(),
                user: {
                    _id: 1,
                    name: 'React Native',
                    avatar: 'https://placeimg.com/140/140/any',
                },
            },
            {
                _id: 3,
                text: 'Hello abc',
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: 'React Native',
                    avatar: 'https://placeimg.com/140/140/any',
                },
            },
            {
                _id: 6,
                text: 'Hello abc',
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: 'React Native',
                    avatar: 'https://placeimg.com/140/140/any',
                },
            },
        ]);
    }, []);

    const onSend = useCallback((messages = []) => {
        setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, messages),
        );

        // database()
        //     .ref('/chats')
        //     .push({
        //         name: Name,
        //         sender_id: s_id,
        //         receiver_id: r_id,
        //         message: messages,
        //         createdAt: new Date()
        //     }).then((res) => console.log('Data set.', JSON.stringify(res)));
        console.log(messages)

    }, []);

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

    const renderComposer = () => {
        return (
            <View style={{ flexDirection: 'row', position: 'absolute', top: 0 }}>
                {/* <Icon type='SimpleLineIcons' name='paper-clip' style={{ fontSize: 20, justifyContent: 'center', paddingTop: 10, paddingLeft: 5 }} /> */}
                <Text>Mandip</Text>
            </View>
        );
    };

    return (
        <GiftedChat
            // renderComposer={renderComposer}
            messages={messages}
            onSend={(messages) => onSend(messages)}
            user={{
                _id: 1,
            }}
            renderBubble={renderBubble}
            alwaysShowSend
            renderSend={renderSend}
            scrollToBottom
            scrollToBottomComponent={scrollToBottomComponent}
        />
    );
};

export default Chat;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});