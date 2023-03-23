import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import Favorites from './Screens/Favorites';
import MealsStack from './navigation/MealsStack';

import CustomDrawer from './components/DrawersComponents/CustomDrawer';

import * as colors from './utilities/Colors';

const Drawer = createDrawerNavigator();


export default function App() {
  return (
    <NavigationContainer  theme={{ colors: { background: colors.mainBackground } }}>
      <Drawer.Navigator
        drawerContent={props => <CustomDrawer {...props}/>}
        initialRouteName="Meals"
        screenOptions={({ route }) => ({
          swipeEnabled: getFocusedRouteNameFromRoute(route) !== 'Details',
          headerShown: false,
        })}
        >
        <Drawer.Screen name="Meals" component={MealsStack} />
        <Drawer.Screen name="Favorites" component={Favorites} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
