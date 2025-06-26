import { useNavigation, useRoute } from '@react-navigation/native';
import { useContext } from 'react';
import { Alert, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import CustomButton from '../components/CustomButton';
import RideCard from '../components/RideCard';
import { AuthContext } from '../context/AuthContext';
import * as api from '../utils/api';

const RideMatchScreen = () => {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();
  const route = useRoute();
  const { ride } = route.params;

  const handleCompleteRide = async () => {
    try {
      await api.completeRide(ride._id);
      Alert.alert('Success', 'Ride completed!');
      navigation.navigate('Main');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to complete ride');
    }
  };

  const handleCancelRide = async () => {
    try {
      // No cancel endpoint in backend; mock for now
      Alert.alert('Success', 'Ride cancelled');
      navigation.navigate('Main');
    } catch (error) {
      Alert.alert('Error', 'Failed to cancel ride');
    }
  };

  const region = {
    latitude: ride.from.coordinates.latitude,
    longitude: ride.from.coordinates.longitude,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  return (
    <View className="flex-1">
      <MapView className="flex-1" region={region}>
        <Marker
          coordinate={{
            latitude: ride.from.coordinates.latitude,
            longitude: ride.from.coordinates.longitude,
          }}
          title="Start"
        />
        <Marker
          coordinate={{
            latitude: ride.to.coordinates.latitude,
            longitude: ride.to.coordinates.longitude,
          }}
          title="Destination"
        />
        <Polyline
          coordinates={[
            {
              latitude: ride.from.coordinates.latitude,
              longitude: ride.from.coordinates.longitude,
            },
            {
              latitude: ride.to.coordinates.latitude,
              longitude: ride.to.coordinates.longitude,
            },
          ]}
          strokeColor="#3b82f6"
          strokeWidth={3}
        />
      </MapView>
      <View className="absolute bottom-10 left-0 right-0 p-4 bg-white rounded-t-2xl">
        <RideCard
          ride={ride}
          userRole={user.role}
        />
        {ride.status === 'accepted' && user.role === 'pilot' && (
          <CustomButton
            title="Complete Ride"
            onPress={handleCompleteRide}
            className="bg-blue-500 mt-2"
          />
        )}
        <CustomButton
          title="Cancel Ride"
          onPress={handleCancelRide}
          className="bg-red-500 mt-2"
        />
      </View>
    </View>
  );
};

export default RideMatchScreen;