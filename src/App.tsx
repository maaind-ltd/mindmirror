import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './screens/SplashScreen';
import MirrorScreen from './screens/MirrorScreen';
import SuggestionsScreen from './screens/SuggestionsScreen';
import Screens from './constants/screens';

export type MainStackParams = {
	SplashScreen: undefined;
	MirrorScreen: undefined;
	SuggestionsScreen: undefined;
};

const MainStack = createStackNavigator<MainStackParams>();

const Root: () => Node = () => {
	return (
		<NavigationContainer>
			<MainStack.Navigator
				initialRouteName={Screens.SplashScreen}
				screenOptions={
					{
						headerShown: false,
						detachPreviousScreen: true,
					} as any
				}
			>
				<MainStack.Screen name="SplashScreen" component={SplashScreen} />
				<MainStack.Screen
					name={Screens.MirrorScreen}
					component={MirrorScreen}
				/>
				<MainStack.Screen
					name={Screens.SuggestionsScreen}
					component={SuggestionsScreen}
				/>
			</MainStack.Navigator>
		</NavigationContainer>
	);
}

export default Root;