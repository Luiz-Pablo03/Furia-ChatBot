import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Start from "../pages/Start";
import ChatScreen from '../pages/ChatScreen';

const Stack = createNativeStackNavigator();

export default function AppRoutes() {
    return (
        <Stack.Navigator initialRouteName="Start" screenOptions={{ headerShown: false }}>
            <Stack.Screen name='Start' component={Start} options={{ headerShown: false }} />
            <Stack.Screen name='ChatScreen' component={ChatScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
}
