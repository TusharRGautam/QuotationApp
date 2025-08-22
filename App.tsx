import React from 'react';
import {StatusBar, useColorScheme} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import 'react-native-gesture-handler';

import HomeScreen from './src/screens/HomeScreen';
import QuotationFormScreen from './src/screens/QuotationFormScreen';
import QuotationListScreen from './src/screens/QuotationListScreen';
import PamphletViewScreen from './src/screens/PamphletViewScreen';
import {RootStackParamList} from './src/types';

const Stack = createStackNavigator<RootStackParamList>();

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#3498db',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}>
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options={{title: 'Quotation App'}}
          />
          <Stack.Screen 
            name="QuotationForm" 
            component={QuotationFormScreen}
            options={{title: 'Create Quotation'}}
          />
          <Stack.Screen 
            name="QuotationList" 
            component={QuotationListScreen}
            options={{title: 'Quotations'}}
          />
          <Stack.Screen 
            name="PamphletView" 
            component={PamphletViewScreen}
            options={{title: 'Quotation View'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
