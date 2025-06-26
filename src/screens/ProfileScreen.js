import { useContext, useEffect, useState } from 'react';
import { Alert, FlatList, Image, Text, View } from 'react-native';
import CustomButton from '../components/CustomButton';
import RideCard from '../components/RideCard';
import { AuthContext } from '../context/AuthContext';
import * as api from '../utils/api';

const ProfileScreen = () => {
  const { user, logout } = useContext(AuthContext);
  const [rides, setRides] = useState([]);
  const [rewards, setRewards] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rideHistory = await api.getRideHistory();
        setRides(rideHistory);
        // Rewards are stored in user.rewards
        const userData = await api.getProfile();
        setRewards(userData.rewards || []);
      } catch (error) {
        Alert.alert('Error', 'Failed to load profile data');
      }
    };
    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      Alert.alert('Error', 'Failed to logout');
    }
  };

  return (
    <View className="flex-1 bg-gray-100 p-4">
      <View className="bg-white p-4 rounded-lg mb-6 items-center">
        {/* Placeholder avatar */}
        <Image
          source={{ uri: user.profile.avatar || 'https://via.placeholder.com/100' }}
          className="w-24 h-24 rounded-full mb-2"
        />
        <Text className="text-xl font-bold">{user.profile.name}</Text>
        <Text className="text-gray-600 capitalize">{user.role}</Text>
        <Text className="text-gray-600">{user.email}</Text>
      </View>
      <Text className="text-lg font-semibold mb-2">Ride History</Text>
      <FlatList
        data={rides}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <RideCard ride={item} userRole={user.role} />}
        className="mb-4"
      />
      <Text className="text-lg font-semibold mb-2">Rewards Earned</Text>
      <FlatList
        data={rewards}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View className="bg-white p-3 rounded-lg mb-2">
            <Text className="font-semibold">{item.rewardType}</Text>
            <Text className="text-gray-600">From: {item.brand.name}</Text>
            <Text className="text-gray-600">Status: {item.status}</Text>
          </View>
        )}
      />
      <CustomButton
        title="Logout"
        onPress={handleLogout}
        className="bg-red-500 mt-4"
      />
    </View>
  );
};

export default ProfileScreen;