import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from './Login';
import Welcome from './Welcome';
import UserList from './UserList';
import Chat from './Chat';
import ForgetPassword from './ForgetPassword';

const Stack = createStackNavigator();

function Navigation() {
    return (
        <NavigationContainer>
            <Stack.Navigator headerMode={'none'}>
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
                <Stack.Screen name="Welcome" component={Welcome} />
                <Stack.Screen name="UserList" component={UserList} />
                <Stack.Screen name="Chat" component={Chat} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default Navigation;