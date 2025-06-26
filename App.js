import { NativeWindStyleSheet } from 'nativewind';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

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