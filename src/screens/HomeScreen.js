import * as Location from 'expo-location';
import { useContext, useEffect, useState } from 'react';
import { Alert, FlatList, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import CustomButton from 'C:/Users/HP/Desktop/hitchhikeapp/src/components/CustomButton';
import NotificationBadge from 'C:/Users/HP/Desktop/hitchhikeapp/src/components/NotificationBadge';
import { AuthContext } from 'C:/Users/HP/Desktop/hitchhikeapp/src/context/AuthContext';
import * as api from 'C:/Users/HP/Desktop/hitchhikeapp/src/utils/api';

const HomeScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [location, setLocation] = useState(null);
  const [nearbyRides, setNearbyRides] = useState([]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location access is required');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      // Fetch nearby ride requests (mocked for MVP)
      if (user.role === 'pilot') {
        const rides = await api.getRideHistory();
        setNearbyRides(rides.filter((ride) => ride.status === 'requested'));
      }
    })();
  }, [user]);

  const handleRequestRide = async () => {
    try {
      if (!location) throw new Error('Location not available');
      const ride = await api.requestRide({
        from: {
          name: 'Current Location',
          coordinates: { latitude: location.latitude, longitude: location.longitude },
        },
        to: {
          name: 'Destination',
          coordinates: { latitude: location.latitude + 0.05, longitude: location.longitude + 0.05 },
        },
        hitchhiker: user._id,
      });
      navigation.navigate('RideMatch', { ride });
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to request ride');
    }
  };

  const handleAcceptRide = async (rideId) => {
    try {
      const ride = await api.acceptRide(rideId);
      navigation.navigate('RideMatch', { ride });
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to accept ride');
    }
  };

  return (
    <View className="flex-1">
      {location && (
        <MapView className="flex-1" region={location}>
          <Marker
            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
            title="You"
          />
          {nearbyRides.map((ride) => (
            <Marker
              key={ride._id}
              coordinate={{
                latitude: ride.from.coordinates.latitude,
                longitude: ride.from.coordinates.longitude,
              }}
              title={`Ride from ${ride.hitchhiker.profile.name}`}
            />
          ))}
        </MapView>
      )}
      <View className="absolute top-10 right-4">
        <NotificationBadge count={nearbyRides.length} />
      </View>
      <View className="absolute bottom-10 left-0 right-0 p-4">
        {user.role === 'hitchhiker' ? (
          <CustomButton
            title="Request Ride"
            onPress={handleRequestRide}
            className="bg-blue-500"
          />
        ) : (
          <FlatList
            data={nearbyRides}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <CustomButton
                title={`Accept ${item.hitchhiker.profile.name}'s Ride`}
                onPress={() => handleAcceptRide(item._id)}
                className="bg-blue-500 mb-2"
              />
            )}
          />
        )}
      </View>
    </View>
  );
};

export default HomeScreen;