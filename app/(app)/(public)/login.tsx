import { useAuth } from '@/providers/AuthProvider';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Pressable,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as z from 'zod';
import { StatusBar } from 'expo-status-bar';

const schema = z.object({
  email: z.string().email('Alamat email tidak valid'),
  password: z
    .string()
    .min(6, 'Password minimal 6 karakter')
    .max(50, 'Password terlalu panjang'),
});

type FormData = z.infer<typeof schema>;

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSignInPress = async (data: FormData) => {
    setLoading(true);
    try {
      await signIn(data.email, data.password);
    } catch (e) {
      Alert.alert('Error', 'Gagal masuk. Periksa email dan password Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white dark:bg-gray-900"
    >
      <StatusBar style="auto" />
      <View className="absolute h-64 w-full bg-blue-700" />

      <View className="flex-1 justify-center w-full max-w-md mx-auto px-6">
        <View className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-6 elevation-5">
          {/* Logo */}
          <View className="items-center">
            <Image
              source={require('@/assets/images/icon.png')}
              style={{
                width: 100,
                height: 100,
                borderRadius: 20,
                marginTop: -50,
                borderWidth: 4,
                borderColor: 'white',
              }}
              resizeMode="contain"
            />
          </View>

          <View className="space-y-2 mt-4 mb-6">
            <Text className="text-3xl font-bold text-center text-gray-900 dark:text-white">
              Selamat Datang
            </Text>
            <Text className="text-center text-gray-600 dark:text-gray-300">
              Masuk ke akun Campus Bridge Anda
            </Text>
          </View>

          {/* Form */}
          <View className="space-y-4">
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 dark:bg-gray-700 dark:border-gray-600">
                    <Feather name="mail" size={20} color="#6B7280" />
                    <TextInput
                      autoCapitalize="none"
                      placeholder="Email"
                      value={value}
                      onChangeText={onChange}
                      keyboardType="email-address"
                      className="flex-1 ml-2 text-gray-900 dark:text-white"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                  {errors.email && (
                    <Text className="text-sm text-red-500 mt-1 px-2">
                      {errors.email.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 dark:bg-gray-700 dark:border-gray-600">
                    <Feather name="lock" size={20} color="#6B7280" />
                    <TextInput
                      placeholder="Password"
                      value={value}
                      onChangeText={onChange}
                      secureTextEntry={!showPassword}
                      className="flex-1 ml-2 text-gray-900 dark:text-white"
                      placeholderTextColor="#9CA3AF"
                    />
                    <Pressable onPress={() => setShowPassword(!showPassword)}>
                      <Feather
                        name={showPassword ? 'eye-off' : 'eye'}
                        size={20}
                        color="#6B7280"
                      />
                    </Pressable>
                  </View>
                  {errors.password && (
                    <Text className="text-sm text-red-500 mt-1 px-2">
                      {errors.password.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <TouchableOpacity>
              <Text className="text-right text-blue-600 font-medium mb-2">
                Lupa password?
              </Text>
            </TouchableOpacity>
          </View>

          {/* Button */}
          <TouchableOpacity
            onPress={handleSubmit(onSignInPress)}
            disabled={loading}
            className={`mt-6 rounded-xl py-4 items-center ${
              loading ? 'bg-blue-400' : 'bg-blue-600'
            }`}
          >
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text className="text-white font-semibold text-lg">Masuk</Text>
            )}
          </TouchableOpacity>

          {/* Sign Up link */}
          <View className="flex-row justify-center mt-6">
            <Text className="text-gray-600 dark:text-gray-300">
              Belum punya akun?{' '}
            </Text>
            <Link href="/register" asChild>
              <TouchableOpacity>
                <Text className="text-blue-600 font-semibold">Daftar</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Page;
