import React from 'react';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';

import Home from '../Screens/Home';
import Details from '../Screens/Details';

const Stack = createSharedElementStackNavigator();

const MealsStack = () => {
  return (
    <Stack.Navigator
      mode="modal"    
      screenOptions={{headerShown: false}}  initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Details"
         component={Details} 
         sharedElements={(route) => {
          const { el } = route.params;
          return [`${el.recipe.uri}.photo` ];
        }}/>
    </Stack.Navigator>
  );
};
export default MealsStack;
