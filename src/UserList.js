import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import database from '@react-native-firebase/database';
import _ from 'lodash'

const user = [
    {
        id: '1',
        userName: 'man',
        messageTxt: 'Checking the network cables, modem, and router',
        userimg: 'https://bootdey.com/img/Content/avatar/avatar6.png'
    },
    {
        id: '2',
        userName: 'mandip',
        messageTxt: 'Checking the network cables, modem, and router',
        userimg: 'https://bootdey.com/img/Content/avatar/avatar6.png'
    },
    {
        id: '3',
        userName: 'dip',
        messageTxt: 'Checking the network cables, modem, and router',
        userimg: 'https://bootdey.com/img/Content/avatar/avatar6.png'
    },
    {
        id: '4',
        userName: 'deep',
        messageTxt: 'Checking the network cables, modem, and router',
        userimg: 'https://bootdey.com/img/Content/avatar/avatar6.png'
    },
    {
        id: '5',
        userName: 'jay',
        messageTxt: 'Checking the network cables, modem, and router',
        userimg: 'https://bootdey.com/img/Content/avatar/avatar6.png'
    },
    {
        id: '6',
        userName: 'dfdggf',
        messageTxt: 'Checking the network cables, modem, and router',
        userimg: 'https://bootdey.com/img/Content/avatar/avatar6.png'
    },
    {
        id: '7',
        userName: 'mdskfn',
        messageTxt: 'Checking the network cables, modem, and router',
        userimg: 'https://bootdey.com/img/Content/avatar/avatar6.png'
    },
    {
        id: '8',
        userName: 'qwep',
        messageTxt: 'Checking the network cables, modem, and router',
        userimg: 'https://bootdey.com/img/Content/avatar/avatar6.png'
    },
    {
        id: '9',
        userName: 'fgdfg',
        messageTxt: 'Checking the network cables, modem, and router',
        userimg: 'https://bootdey.com/img/Content/avatar/avatar6.png'
    },
    {
        id: '11',
        userName: 'dffd',
        messageTxt: 'Checking the network cables, modem, and router',
        userimg: 'https://bootdey.com/img/Content/avatar/avatar6.png'
    }
]

const UserList = ({ navigation }) => {
    const [userLists, setUserList] = useState();

    useEffect(() => {
        database().ref('/users').on('value', (snapshot) => {
            var li = []
            snapshot.forEach((child) => {
                li.push({
                    key: child.key,
                    name: child.val().name,
                    pic: child.val().pic,
                    email: child.val().email
                })
                setUserList(li)
            })
        })
    }, [])
    return (
        <View>
            {/* <View style={{ height: 40, width: '100%', backgroundColor: '#2e64e5' }}>

                <Text style={{ fontSize: 15, justifyContent: 'center', alignSelf: 'center', color: '#FFF', alignItems: 'center', top: 5 }}>
                    User List
                </Text>
            </View> */}
            <FlatList
                data={userLists}
                keyExtractor={(item) => {
                    return item.userid;
                }}
                renderItem={({ item }) => {
                    return (
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ padding: 5 }}>
                                <Image
                                    style={{ height: 80, width: 80, borderRadius: 50, }}
                                    source={{ uri: item.pic }}
                                />
                            </View>
                            <TouchableOpacity
                                onPress={() => { navigation.navigate('Chat') }}
                                style={{ padding: 5 }}
                            >
                                <Text style={{ fontSize: 15 }}>{item.name}</Text>
                                <Text style={{ width: '98%', fontSize: 12 }}>{item.email}</Text>
                            </TouchableOpacity>
                        </View>
                    )
                }}
            />
        </View>
    );
}

export default UserList;