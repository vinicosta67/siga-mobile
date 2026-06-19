import { Redirect } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '../src/store';
import { storage } from '../src/services/storage';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const authState = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Check local storage for token if redux is empty
    const token = storage.getString('siga_logger_token');
    if (token || authState.token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    setIsReady(true);
  }, [authState.token]);

  if (!isReady) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color="hsl(var(--primary))" />
      </View>
    );
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/login" />;
}
