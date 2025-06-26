import { Text, TouchableOpacity } from 'react-native';

const CustomButton = ({ title, onPress, className = '' }) => {
  return (
    <TouchableOpacity
      className={`p-4 rounded-lg ${className}`}
      onPress={onPress}
    >
      <Text className="text-white text-center font-bold">{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;