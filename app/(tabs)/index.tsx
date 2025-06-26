import { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity,
  FlatList,
  Alert,
  Platform
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { 
  Navigation, 
  MapPin, 
  Users, 
  Bell,
  Plus,
  Car
} from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { useAuth } from '@/contexts/AuthContext';
import * as api from '@/utils/api';

const { width, height } = Dimensions.get('window');

interface Ride {
  _id: string;
  from: {
    name: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  to: {
    name: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  hitchhiker: {
    profile: {
      name: string;
    };
  };
  status: string;
}

export default function HomeScreen() {
  const { user } = useAuth();
  const [location, setLocation] = useState<any>(null);
  const [nearbyRides, setNearbyRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(false);
  
  const fabScale = useSharedValue(1);
  const notificationBadge = useSharedValue(0);

  useEffect(() => {
    initializeLocation();
    if (user?.role === 'pilot') {
      fetchNearbyRides();
    }
  }, [user]);

  useEffect(() => {
    if (nearbyRides.length > 0) {
      notificationBadge.value = withSpring(1);
    }
  }, [nearbyRides]);

  const initializeLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location access is required');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    } catch (error) {
      console.error('Location error:', error);
    }
  };

  const fetchNearbyRides = async () => {
    try {
      const rides = await api.getRideHistory();
      setNearbyRides(rides.filter((ride: Ride) => ride.status === 'requested'));
    } catch (error) {
      console.error('Failed to fetch rides:', error);
    }
  };

  const handleRequestRide = async () => {
    if (!location) {
      Alert.alert('Error', 'Location not available');
      return;
    }

    setLoading(true);
    fabScale.value = withSpring(0.9);
    
    try {
      const ride = await api.requestRide({
        from: {
          name: 'Current Location',
          coordinates: { latitude: location.latitude, longitude: location.longitude },
        },
        to: {
          name: 'Destination',
          coordinates: { 
            latitude: location.latitude + 0.05, 
            longitude: location.longitude + 0.05 
          },
        },
        hitchhiker: user?._id,
      });
      
      router.push({
        pathname: '/ride-match',
        params: { rideId: ride._id }
      });
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to request ride');
    } finally {
      setLoading(false);
      fabScale.value = withSpring(1);
    }
  };

  const handleAcceptRide = async (rideId: string) => {
    try {
      const ride = await api.acceptRide(rideId);
      router.push({
        pathname: '/ride-match',
        params: { rideId: ride._id }
      });
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to accept ride');
    }
  };

  const fabAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fabScale.value }],
  }));

  const badgeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: notificationBadge.value }],
    opacity: notificationBadge.value,
  }));

  const renderRideRequest = ({ item }: { item: Ride }) => (
    <TouchableOpacity
      style={styles.rideCard}
      onPress={() => handleAcceptRide(item._id)}
    >
      <View style={styles.rideCardHeader}>
        <View style={styles.rideCardIcon}>
          <Users color="#3B82F6" size={20} />
        </View>
        <View style={styles.rideCardInfo}>
          <Text style={styles.rideCardTitle}>
            {item.hitchhiker.profile.name}
          </Text>
          <Text style={styles.rideCardSubtitle}>
            {item.from.name} → {item.to.name}
          </Text>
        </View>
        <TouchableOpacity style={styles.acceptButton}>
          <Text style={styles.acceptButtonText}>Accept</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {location && (
        <MapView
          style={styles.map}
          region={location}
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          showsUserLocation
          showsMyLocationButton={false}
        >
          <Marker
            coordinate={{ 
              latitude: location.latitude, 
              longitude: location.longitude 
            }}
            title="You are here"
          >
            <View style={styles.userMarker}>
              <View style={styles.userMarkerInner} />
            </View>
          </Marker>
          
          {nearbyRides.map((ride) => (
            <Marker
              key={ride._id}
              coordinate={{
                latitude: ride.from.coordinates.latitude,
                longitude: ride.from.coordinates.longitude,
              }}
              title={`Ride from ${ride.hitchhiker.profile.name}`}
            >
              <View style={styles.rideMarker}>
                <Users color="white" size={16} />
              </View>
            </Marker>
          ))}
        </MapView>
      )}

      {/* Header */}
      <View style={styles.header}>
        <LinearGradient
          colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.8)']}
          style={styles.headerContent}
        >
          <View>
            <Text style={styles.greeting}>
              Hello, {user?.profile?.name || 'User'}
            </Text>
            <Text style={styles.role}>
              {user?.role === 'hitchhiker' ? 'Looking for a ride?' : 'Ready to help?'}
            </Text>
          </View>
          
          {nearbyRides.length > 0 && (
            <TouchableOpacity style={styles.notificationButton}>
              <Bell color="#3B82F6" size={24} />
              <Animated.View style={[styles.notificationBadge, badgeAnimatedStyle]}>
                <Text style={styles.notificationBadgeText}>
                  {nearbyRides.length}
                </Text>
              </Animated.View>
            </TouchableOpacity>
          )}
        </LinearGradient>
      </View>

      {/* Ride Requests for Pilots */}
      {user?.role === 'pilot' && nearbyRides.length > 0 && (
        <View style={styles.ridesContainer}>
          <Text style={styles.ridesTitle}>Nearby Ride Requests</Text>
          <FlatList
            data={nearbyRides}
            renderItem={renderRideRequest}
            keyExtractor={(item) => item._id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.ridesList}
          />
        </View>
      )}

      {/* FAB for Hitchhikers */}
      {user?.role === 'hitchhiker' && (
        <Animated.View style={[styles.fab, fabAnimatedStyle]}>
          <TouchableOpacity
            style={styles.fabButton}
            onPress={handleRequestRide}
            disabled={loading}
          >
            <LinearGradient
              colors={['#3B82F6', '#1D4ED8']}
              style={styles.fabGradient}
            >
              {loading ? (
                <Text style={styles.fabText}>...</Text>
              ) : (
                <>
                  <Plus color="white" size={24} />
                  <Text style={styles.fabText}>Request Ride</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  map: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  greeting: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  role: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  userMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#3B82F6',
    borderWidth: 3,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  userMarkerInner: {
    flex: 1,
    borderRadius: 7,
    backgroundColor: '#1D4ED8',
  },
  rideMarker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  ridesContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  ridesTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  ridesList: {
    paddingHorizontal: 4,
  },
  rideCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    width: width * 0.8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  rideCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rideCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rideCardInfo: {
    flex: 1,
  },
  rideCardTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  rideCardSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  acceptButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  acceptButtonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },
  fabButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  fabGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    gap: 8,
  },
  fabText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
});