import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../src/store/slices/authSlice';
import { storage } from '../../src/services/api';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogin = () => {
    // Simulando login
    const token = 'fake-jwt-token';
    const user = { id: '1', name: 'User', email: 'user@valtre.com' };
    
    storage.set('siga_logger_token', token);
    dispatch(loginSuccess({ token, user }));
    router.replace('/(tabs)');
  };

  return (
    <View className="flex-1 justify-center items-center p-6 bg-background">
      <Text className="text-3xl font-heading text-primary mb-8">SIGA Mobile</Text>
      
      <View className="w-full space-y-4">
        <View>
          <Text className="text-foreground font-body mb-2">E-mail</Text>
          <TextInput 
            className="w-full border border-border rounded-md px-4 py-3 bg-input text-foreground"
            placeholder="Digite seu e-mail"
            placeholderTextColor="hsl(var(--muted-foreground))"
          />
        </View>
        
        <View>
          <Text className="text-foreground font-body mb-2 mt-4">Senha</Text>
          <TextInput 
            className="w-full border border-border rounded-md px-4 py-3 bg-input text-foreground"
            placeholder="Digite sua senha"
            placeholderTextColor="hsl(var(--muted-foreground))"
            secureTextEntry
          />
        </View>

        <TouchableOpacity 
          className="w-full bg-primary py-4 rounded-md mt-6 items-center"
          onPress={handleLogin}
        >
          <Text className="text-primary-foreground font-heading text-lg">Entrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
