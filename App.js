import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EventsList from './pages/EventsList';
import Login from './pages/Login';
import BarCodeScannerApp from './pages/BarCodeScanner';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Events" component={EventsList} />
        <Stack.Screen name="Scanne qrCode" component={BarCodeScannerApp} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
