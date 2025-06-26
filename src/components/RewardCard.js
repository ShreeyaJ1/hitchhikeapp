import { Text, TouchableOpacity, View } from 'react-native';

const RewardCard = ({ brand, onClaim, disabled }) => {
  return (
    <View className="bg-white p-4 rounded-lg mb-2 flex-row justify-between items-center">
      <View>
        <Text className="font-semibold">{brand.name}</Text>
        <Text className="text-gray-600">Reward: {brand.rewardType}</Text>
        <Text className="text-gray-600">Stock: {brand.stock}</Text>
      </View>
      <TouchableOpacity
        className={`p-2 rounded ${disabled ? 'bg-gray-400' : 'bg-blue-500'}`}
        onPress={onClaim}
        disabled={disabled}
      >
        <Text className="text-white">Claim</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RewardCard;