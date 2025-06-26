import { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  Alert,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { User, Mail, Lock, Phone, UserCheck } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withSpring
} from 'react-native-reanimated';
import { useAuth } from '@/contexts/AuthContext';

const { width } = Dimensions.get('window');

export default function AuthScreen() {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
    phone: '',
    role: 'hitchhiker' as 'hitchhiker' | 'pilot',
    name: ''
  });

  const slideAnimation = useSharedValue(0);

  const handleSubmit = async () => {
    if (loading) return;
    
    setLoading(true);
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
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    slideAnimation.value = withSpring(isLogin ? 1 : 0);
    setIsLogin(!isLogin);
  };

  const slideStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: slideAnimation.value * (width - 80) / 2 }],
  }));

  return (
    <LinearGradient
      colors={['#3B82F6', '#1D4ED8']}
      style={styles.container}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>
              {isLogin ? 'Welcome Back' : 'Join Hitchhike'}
            </Text>
            <Text style={styles.subtitle}>
              {isLogin ? 'Sign in to continue' : 'Create your account'}
            </Text>
          </View>

          <View style={styles.toggleContainer}>
            <View style={styles.toggleBackground}>
              <Animated.View style={[styles.toggleSlider, slideStyle]} />
              <TouchableOpacity
                style={[styles.toggleButton, isLogin && styles.activeToggle]}
                onPress={() => !isLogin && toggleMode()}
              >
                <Text style={[styles.toggleText, isLogin && styles.activeToggleText]}>
                  Login
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleButton, !isLogin && styles.activeToggle]}
                onPress={() => isLogin && toggleMode()}
              >
                <Text style={[styles.toggleText, !isLogin && styles.activeToggleText]}>
                  Register
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.form}>
            {!isLogin && (
              <>
                <View style={styles.inputContainer}>
                  <User color="rgba(255,255,255,0.7)" size={20} />
                  <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    placeholderTextColor="rgba(255,255,255,0.7)"
                    value={form.name}
                    onChangeText={(text) => setForm({ ...form, name: text })}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Phone color="rgba(255,255,255,0.7)" size={20} />
                  <TextInput
                    style={styles.input}
                    placeholder="Phone Number"
                    placeholderTextColor="rgba(255,255,255,0.7)"
                    value={form.phone}
                    onChangeText={(text) => setForm({ ...form, phone: text })}
                    keyboardType="phone-pad"
                  />
                </View>

                <View style={styles.roleContainer}>
                  <Text style={styles.roleLabel}>I want to be a:</Text>
                  <View style={styles.roleButtons}>
                    <TouchableOpacity
                      style={[
                        styles.roleButton,
                        form.role === 'hitchhiker' && styles.activeRole
                      ]}
                      onPress={() => setForm({ ...form, role: 'hitchhiker' })}
                    >
                      <UserCheck 
                        color={form.role === 'hitchhiker' ? '#3B82F6' : 'rgba(255,255,255,0.7)'} 
                        size={20} 
                      />
                      <Text style={[
                        styles.roleButtonText,
                        form.role === 'hitchhiker' && styles.activeRoleText
                      ]}>
                        Hitchhiker
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.roleButton,
                        form.role === 'pilot' && styles.activeRole
                      ]}
                      onPress={() => setForm({ ...form, role: 'pilot' })}
                    >
                      <UserCheck 
                        color={form.role === 'pilot' ? '#3B82F6' : 'rgba(255,255,255,0.7)'} 
                        size={20} 
                      />
                      <Text style={[
                        styles.roleButtonText,
                        form.role === 'pilot' && styles.activeRoleText
                      ]}>
                        Pilot
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}

            <View style={styles.inputContainer}>
              <Mail color="rgba(255,255,255,0.7)" size={20} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="rgba(255,255,255,0.7)"
                value={form.email}
                onChangeText={(text) => setForm({ ...form, email: text })}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Lock color="rgba(255,255,255,0.7)" size={20} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="rgba(255,255,255,0.7)"
                value={form.password}
                onChangeText={(text) => setForm({ ...form, password: text })}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.submitButtonText}>
                {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.8)',
  },
  toggleContainer: {
    marginBottom: 32,
  },
  toggleBackground: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 25,
    padding: 4,
    position: 'relative',
  },
  toggleSlider: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: 4,
    height: 42,
    backgroundColor: 'white',
    borderRadius: 21,
    width: (width - 80) / 2,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  activeToggle: {
    // Styles handled by slider
  },
  toggleText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255,255,255,0.7)',
  },
  activeToggleText: {
    color: '#3B82F6',
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'white',
    paddingVertical: 16,
    paddingLeft: 12,
  },
  roleContainer: {
    gap: 12,
  },
  roleLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: 'white',
  },
  roleButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  activeRole: {
    backgroundColor: 'white',
    borderColor: 'white',
  },
  roleButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255,255,255,0.7)',
  },
  activeRoleText: {
    color: '#3B82F6',
  },
  submitButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#3B82F6',
  },
});