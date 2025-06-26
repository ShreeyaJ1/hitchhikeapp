import { useNavigation } from '@react-navigation/native';
import { useRef, useState } from 'react';
import { Image, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
const platform = Platform.OS; // Add this line
const WelcomeScreen = () => {
  const navigation = useNavigation();
  const [currentPage, setCurrentPage] = useState(0);
  const scrollRef = useRef();

  const pages = [
    { title: 'Welcome to Hitchhike', description: 'Join the movement to share rides and earn rewards!' },
    { title: 'Find Your Ride', description: 'Connect with pilots or hitchhikers near you.' },
    { title: 'Earn Rewards', description: 'Get rewarded for every ride you take or offer.' },
  ];

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const page = Math.round(offsetX / event.nativeEvent.layoutMeasurement.width);
    setCurrentPage(page);
  };

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      scrollRef.current.scrollTo({ x: (currentPage + 1) * 100, animated: true });
      setCurrentPage(currentPage + 1);
    } else {
      navigation.navigate('Auth');
    }
  };

  return (
    <View className="flex-1 bg-blue-500">
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {pages.map((page, index) => (
          <View key={index} className="w-screen h-screen justify-center items-center p-4">
            {/* Replace with your logo */}
            <Image source={require('C:/Users/HP/Desktop/hitchhikeapp/src/assets/logo.png')} className="w-32 h-32 mb-4" />
            <Text className="text-white text-2xl font-bold mb-2">{page.title}</Text>
            <Text className="text-white text-lg text-center">{page.description}</Text>
          </View>
        ))}
      </ScrollView>
      <View className="absolute bottom-10 left-0 right-0 flex-row justify-between px-4">
        <TouchableOpacity onPress={() => navigation.navigate('Auth')}>
          <Text className="text-white text-lg">Skip</Text>
        </TouchableOpacity>
        <View className="flex-row">
          {pages.map((_, index) => (
            <View
              key={index}
              className={`w-2 h-2 rounded-full mx-1 ${index === currentPage ? 'bg-white' : 'bg-gray-400'}`}
            />
          ))}
        </View>
        <TouchableOpacity onPress={handleNext}>
          <Text className="text-white text-lg">Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WelcomeScreen;