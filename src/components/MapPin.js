import { View } from 'react-native';
import { Marker } from 'react-native-maps';

const MapPin = ({ coordinate, title, color = '#3b82f6' }) => {
  return (
    <Marker coordinate={coordinate} title={title}>
      <View className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
    </Marker>
  );
};

export default MapPin;