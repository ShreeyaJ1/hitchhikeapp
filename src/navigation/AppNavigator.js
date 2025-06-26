import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useContext } from 'react';
import { AuthContext } from 'C:/Users/HP/Desktop/hitchhikeapp/src/context/AuthContext';
import AuthScreen from 'C:/Users/HP/Desktop/hitchhikeapp/src/screens/AuthScreen';
import HomeScreen from 'C:/Users/HP/Desktop/hitchhikeapp/src/screens/HomeScreen';
import ProfileScreen from 'C:/Users/HP/Desktop/hitchhikeapp/src/screens/ProfileScreen';
import RewardScreen from 'C:/Users/HP/Desktop/hitchhikeapp/src/screens/RewardScreen';
import RideMatchScreen from 'C:/Users/HP/Desktop/hitchhikeapp/src/screens/RideMatchScreen';
import WelcomeScreen from 'C:/Users/HP/Desktop/hitchhikeapp/src/screens/WelcomeScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;
        if (route.name === 'Home') iconName = 'map';
        else if (route.name === 'Rewards') iconName = 'gift';
        else if (route.name === 'Profile') iconName = 'person';
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#3b82f6',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
    <Tab.Screen name="Rewards" component={RewardScreen} options={{ headerShown: false }} />
    <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
  </Tab.Navigator>
);

const AppNavigator = () => {
  const { user } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Auth" component={AuthScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="RideMatch" component={RideMatchScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;