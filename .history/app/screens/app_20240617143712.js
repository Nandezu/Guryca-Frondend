import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './HomeScreen';
import Screen2 from './Screen2';
import Screen3 from './Screen3';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
        <Stack.Screen name="Screen2" component={Screen2} options={{ title: 'Screen 2' }} />
        <Stack.Screen name="Screen3" component={Screen3} options={{ title: 'Screen 3' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
