import { View, Text } from 'react-native';

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold mb-4">TAC Calabash</Text>
      <Text className="text-gray-500">Welcome to your church app</Text>
    </View>
  );
}
