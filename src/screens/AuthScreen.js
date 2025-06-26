import { useContext, useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import RoleSwitchToggle from 'C:/Users/HP/Desktop/hitchhikeapp/src/components/RoleSwitchToggle';
import { AuthContext } from 'C:/Users/HP/Desktop/hitchhikeapp/src/context/AuthContext';

const AuthScreen = () => {
  const { login, register } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    email: '',
    password: '',
    phone: '',
    role: 'hitchhiker',
    name: ''
  });

  const handleSubmit = async () => {
    try {
      if (isLogin) {
        await login(form.email, form.password);
      } else {
        if (!form.name || !form.phone) {
          Alert.alert('Error', 'Please fill in all fields');
          return;
        }
        await register({
          email: form.email,
          password: form.password,
          phone: form.phone,
          role: form.role,
          name: form.name
        });
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <View className="flex-1 bg-blue-500 justify-center p-4">
      <Text className="text-white text-3xl font-bold mb-6 text-center">
        {isLogin ? 'Login' : 'Register'}
      </Text>
      {!isLogin && (
        <>
          <TextInput
            className="bg-white p-3 rounded mb-4"
            placeholder="Name"
            value={form.name}
            onChangeText={(text) => setForm({ ...form, name: text })}
          />
          <TextInput
            className="bg-white p-3 rounded mb-4"
            placeholder="Phone (e.g., 1234567890)"
            value={form.phone}
            onChangeText={(text) => setForm({ ...form, phone: text })}
            keyboardType="phone-pad"
          />
          <RoleSwitchToggle
            value={form.role}
            onChange={(role) => setForm({ ...form, role })}
          />
        </>
      )}
      <TextInput
        className="bg-white p-3 rounded mb-4"
        placeholder="Email"
        value={form.email}
        onChangeText={(text) => setForm({ ...form, email: text })}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        className="bg-white p-3 rounded mb-4"
        placeholder="Password"
        value={form.password}
        onChangeText={(text) => setForm({ ...form, password: text })}
        secureTextEntry
        autoCapitalize="none"
      />
      <TouchableOpacity
        className="bg-white p-3 rounded"
        onPress={handleSubmit}
      >
        <Text className="text-blue-500 text-center font-bold">
          {isLogin ? 'Login' : 'Register'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="mt-4"
        onPress={() => setIsLogin(!isLogin)}
      >
        <Text className="text-white text-center">
          {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default AuthScreen;