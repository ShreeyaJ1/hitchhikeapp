import { Text, View } from 'react-native';

const NotificationBadge = ({ count }) => {
  if (count === 0) return null;
  return (
    <View className="bg-red-500 w-6 h-6 rounded-full justify-center items-center">
      <Text className="text-white text-xs">{count}</Text>
    </View>
  );
};

export default NotificationBadge;