import { NativeWindStyleSheet } from 'nativewind';
import { AuthProvider } from 'C:/Users/HP/Desktop/hitchhikeapp/src/context/AuthContext';
import AppNavigator from 'C:/Users/HP/Desktop/hitchhikeapp/src/navigation/AppNavigator';

// Configure NativeWind for React Native
NativeWindStyleSheet.setOutput({
  default: 'native',
});

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}