import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './src/pages/Home/index';
import EditCustomer from './src/pages/EditCustomer/index';
import AddCustomer from './src/pages/AddCustomer/index';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="EditCustomer" component={EditCustomer} />
        <Stack.Screen name="AddCustomer" component={AddCustomer} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}