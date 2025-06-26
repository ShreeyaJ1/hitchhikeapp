import { Text, View } from 'react-native';

const RideCard = ({ ride, userRole }) => {
  const otherUser = userRole === 'hitchhiker' ? ride.pilot : ride.hitchhiker;

  return (
    <View className="bg-white p-4 rounded-lg mb-2">
      <Text className="font-semibold">From: {ride.from.name || 'Location'}</Text>
      <Text className="font-semibold">To: {ride.to.name || 'Destination'}</Text>
      <Text className="text-gray-600">Status: {ride.status}</Text>
      {otherUser && (
        <Text className="text-gray-600">
          {userRole === 'hitchhiker' ? 'Pilot' : 'Hitchhiker'}: {otherUser.profile.name}
        </Text>
      )}
    </View>
  );
};

export default RideCard;