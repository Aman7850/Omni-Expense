import React, {useState, useEffect} from 'react';
import {TouchableOpacity, Button} from 'react-native';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import LoginScreen from './Screens/LoginScreen';
import ExpenseList from './Screens/ExpenseList';
import DetailScreen from './Screens/DetailScreen';
import SignUpScreen from './Screens/SignupScreen';
import DemoScreen from './Screens/DemoScreen';
import FormScreen, {handleProducts} from './Screens/FormScreen';
import StageScreen from './Screens/StageScreen';
import Draft from './Screens/Draft';
import ToApproved from './Screens/ToApproved';
import Approved from './Screens/Approved';
import Paid from './Screens/Paid';
import Dashboard from './Screens/Dashboard';

import {useNetInfo} from '@react-native-community/netinfo';
import {typeCastExpression} from '@babel/types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {View} from 'native-base';

// const unsubscribe = NetInfo.addEventListener(state => {
//   const typecon = state.type;
//   const internetReachable = state.netInfo;
//   const iswifienable = state.isWifiEnabled;
// });

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
//const navigation = useNavigation();

function DrawerRoutes() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Dashboard" component={Dashboard} />
      <Drawer.Screen name="All" component={ExpenseList} />
      <Drawer.Screen name="Draft" component={Draft} />
      <Drawer.Screen
        name="To Approve"
        component={ToApproved}
        options={{
          headerTitle: 'To Approve',
        }}
      />
      <Drawer.Screen name="Approved" component={Approved} />
      <Drawer.Screen name="Paid" component={Paid} />

      {/* //<Drawer.Screen name="Logout" component={logout} /> */}
    </Drawer.Navigator>
  );
}

// function CustomDrawerContent(props) {
//   return (
//     <DrawerContentScrollView {...props}>
//       <DrawerItemList {...props} />
//       <DrawerItem
//         label={() => <Text style={{color: 'white'}}>Logout</Text>}
//         style={{backgroundColor: 'red'}}
//         onPress={() => alert('Logged out')}
//       />
//     </DrawerContentScrollView>
//   );
// }

function App() {
  const netInfo = useNetInfo();
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="login"
            component={LoginScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ExpenseList"
            component={DrawerRoutes}
            options={{
              headerShown: false,
              headerTitle: 'Expenses List',
              headerTitleAlign: 'center',
              headerTintColor: 'black',
            }}
          />
          <Stack.Screen
            name="DetailScreen"
            component={DetailScreen}
            options={{
              headerShown: false,
              headerTitle: 'Detail Screen',
              headerTitleAlign: 'center',
              headerTintColor: 'black',
            }}
          />
          <Stack.Screen
            name="FormScreen"
            component={FormScreen}
            options={{
              headerTitle: 'Expense Detail',
              headerTitleAlign: 'center',
              headerTintColor: 'black',
              headerShown: false,
              headerRight: () => (
                <Button onPress={handleProducts} title="Info" color="#000000" />
              ),
            }}
          />
          <Stack.Screen name="Dashboard" component={DrawerRoutes} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

export default App;
