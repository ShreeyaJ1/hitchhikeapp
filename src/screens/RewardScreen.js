import { useEffect, useState } from 'react';
import { Alert, FlatList, Text, View } from 'react-native';
import RewardCard from '../components/RewardCard';
import * as api from '../utils/api';

const RewardScreen = () => {
  const [progress, setProgress] = useState({ rides: 0, points: 0 });
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const progressData = await api.getRewardsProgress();
        setProgress(progressData);
        const brandsData = await api.getBrands();
        setBrands(brandsData);
      } catch (error) {
        Alert.alert('Error', 'Failed to load rewards data');
      }
    };
    fetchData();
  }, []);

  const handleClaim = async (brandId) => {
    try {
      await api.claimReward(brandId);
      Alert.alert('Success', 'Reward claimed!');
      const progressData = await api.getRewardsProgress();
      setProgress(progressData);
      const brandsData = await api.getBrands();
      setBrands(brandsData);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to claim reward');
    }
  };

  return (
    <View className="flex-1 bg-gray-100 p-4">
      <Text className="text-2xl font-bold mb-4">Reward Dashboard</Text>
      <View className="bg-white p-4 rounded-lg mb-6">
        <Text className="text-lg font-semibold">
          Progress: {progress.rides} rides completed
        </Text>
        <View className="h-4 bg-gray-200 rounded-full mt-2">
          <View
            className="h-4 bg-blue-500 rounded-full"
            style={{ width: `${(progress.points / 100) * 100}%` }}
          />
        </View>
        <Text className="text-sm text-gray-600 mt-1">
          {progress.points}/100 points
        </Text>
      </View>
      <Text className="text-lg font-semibold mb-2">Available Rewards</Text>
      <FlatList
        data={brands}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <RewardCard
            brand={item}
            onClaim={() => handleClaim(item._id)}
            disabled={progress.points < 50 || item.stock < 1}
          />
        )}
      />
    </View>
  );
};

export default RewardScreen;