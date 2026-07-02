import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { authService } from '../../../src/services/auth';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ResetSenhaScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { token } = useLocalSearchParams<{ token: string }>();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isConfirmFocused, setIsConfirmFocused] = useState(false);

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      setError('Preencha todos os campos.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await authService.resetPassword({ token: token!, password });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao redefinir a senha. O link pode estar expirado.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <View className="flex-1 bg-white items-center justify-center px-8">
        <View className="bg-[#E6F9EE] w-20 h-20 rounded-full items-center justify-center mb-6">
          <MaterialIcons name="check-circle" size={40} color="#00E65B" />
        </View>
        
        <Text className="text-3xl font-black text-[#0A3D24] text-center mb-4">
          Senha alterada!
        </Text>
        
        <Text className="text-gray-500 font-medium text-base text-center leading-relaxed mb-8">
          Sua senha foi redefinida com sucesso. Você já pode acessar sua conta utilizando a nova senha.
        </Text>

        <TouchableOpacity 
          className="w-full bg-[#0A3D24] py-4 rounded-xl flex-row justify-center items-center shadow-md"
          onPress={() => router.replace('/(auth)/login')}
        >
          <Text className="text-white font-black text-lg">Fazer Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        className="flex-1"
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }} 
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ paddingTop: Math.max(insets.top, 40) + 20 }} className="px-8 pb-4">
            <TouchableOpacity onPress={() => router.replace('/(auth)/login')} className="mb-6 flex-row items-center">
              <MaterialIcons name="arrow-back" size={24} color="#0A3D24" />
              <Text className="text-[#0A3D24] font-bold ml-2">Voltar ao login</Text>
            </TouchableOpacity>
            
            <View className="mb-8 mt-4">
              <Text className="text-3xl font-black text-[#0A3D24] mb-3">
                Nova Senha
              </Text>
              <Text className="text-gray-500 font-medium text-base leading-relaxed">
                Crie uma nova senha forte para acessar sua conta SIGA.
              </Text>
            </View>
          </View>

          <View className="flex-1 px-8">
            <View className="mb-5">
              <Text className="text-gray-700 font-bold mb-2 ml-1 text-sm">Nova Senha</Text>
              <View 
                className={`flex-row items-center border px-4 bg-gray-50 ${isPasswordFocused ? 'border-[#00E65B]' : 'border-gray-300'}`}
                style={{ borderRadius: 12 }}
              >
                <MaterialIcons name="lock" size={20} color="#9CA3AF" />
                <TextInput 
                  className="flex-1 py-4 px-3 text-gray-800 font-medium"
                  placeholder="••••••••"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={(t) => { setPassword(t); setError(''); }}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} accessibilityRole="button">
                  <MaterialIcons name={showPassword ? "visibility-off" : "visibility"} size={24} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
            </View>
            
            <View className="mb-2">
              <Text className="text-gray-700 font-bold mb-2 ml-1 text-sm">Confirmar Nova Senha</Text>
              <View 
                className={`flex-row items-center border px-4 bg-gray-50 ${isConfirmFocused ? 'border-[#00E65B]' : 'border-gray-300'}`}
                style={{ borderRadius: 12 }}
              >
                <MaterialIcons name="lock" size={20} color="#9CA3AF" />
                <TextInput 
                  className="flex-1 py-4 px-3 text-gray-800 font-medium"
                  placeholder="••••••••"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={(t) => { setConfirmPassword(t); setError(''); }}
                  onFocus={() => setIsConfirmFocused(true)}
                  onBlur={() => setIsConfirmFocused(false)}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} accessibilityRole="button">
                  <MaterialIcons name={showConfirmPassword ? "visibility-off" : "visibility"} size={24} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Dicas de senha */}
            <View className="bg-gray-50 p-4 rounded-xl mt-4 mb-2">
              <Text className="text-gray-600 text-xs font-medium mb-1">• Pelo menos 8 caracteres</Text>
              <Text className="text-gray-600 text-xs font-medium mb-1">• Letras maiúsculas e minúsculas</Text>
              <Text className="text-gray-600 text-xs font-medium mb-1">• Números</Text>
              <Text className="text-gray-600 text-xs font-medium">• Caracteres especiais (!@#$%^&*)</Text>
            </View>

            {error ? (
              <Text className="text-red-500 font-bold text-center mt-2">{error}</Text>
            ) : null}

            <TouchableOpacity 
              className="w-full bg-[#0A3D24] py-4 mt-8 mb-8 flex-row justify-center items-center shadow-md"
              style={{ borderRadius: 12, opacity: isLoading ? 0.7 : 1 }}
              onPress={handleResetPassword}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text className="text-white font-black text-lg mr-2">Redefinir Senha</Text>
                  <MaterialIcons name="check" size={20} color="#FFFFFF" />
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
