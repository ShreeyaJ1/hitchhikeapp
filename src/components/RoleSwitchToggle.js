import { Text, TouchableOpacity, View } from 'react-native';

const RoleSwitchToggle = ({ value, onChange }) => {
  return (
    <View className="flex-row mb-4">
      <TouchableOpacity
        className={`flex-1 p-3 ${value === 'hitchhiker' ? 'bg-blue-700' : 'bg-gray-300'} rounded-l-lg`}
        onPress={() => onChange('hitchhiker')}
      >
        <Text className="text-white text-center font-semibold">Hitchhiker</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className={`flex-1 p-3 ${value === 'pilot' ? 'bg-blue-700' : 'bg-gray-300'} rounded-r-lg`}
        onPress={() => onChange('pilot')}
      >
        <Text className="text-white text-center font-semibold">Pilot</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RoleSwitchToggle;