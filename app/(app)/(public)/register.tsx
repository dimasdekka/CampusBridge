import { useAuth } from '@/providers/AuthProvider';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Pressable,
  ScrollView,
  Image,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as z from 'zod';
import { StatusBar } from 'expo-status-bar';

const schema = z
  .object({
    nim: z.string().min(8, 'NIM minimal 8 karakter'),
    email: z.string().email('Alamat email tidak valid'),
    password: z
      .string()
      .min(6, 'Password minimal 6 karakter')
      .max(20, 'Password terlalu panjang'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password tidak cocok',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof schema>;

const Page = () => {
  const { onRegister } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      nim: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSignUpPress = async (data: RegisterFormData) => {
    setLoading(true);
    try {
      // Kirim nim, email, password sesuai urutan di AuthProvider!
      const result = await onRegister(data.nim, data.email, data.password);
      console.log('Registration successful', result);
    } catch (e) {
      Alert.alert('Error', 'Tidak dapat membuat akun');
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
      <View className="absolute h-64 w-full bg-blue-600" />

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 justify-center w-full max-w-md mx-auto px-6 py-12">
          <View className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-6 elevation-5">
            {/* Logo */}
            <View className="items-center">
              <Image
                source={require('@/assets/images/icon.png')}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 15,
                  marginTop: -50,
                  borderWidth: 4,
                  borderColor: 'white',
                }}
                resizeMode="contain"
              />
            </View>

            <View className="space-y-2 mt-4 mb-6">
              <Text className="text-2xl font-bold text-center text-gray-900 dark:text-white">
                Buat Akun Baru
              </Text>
              <Text className="text-center text-gray-600 dark:text-gray-300">
                Daftar untuk memulai perjalanan Campus Bridge Anda
              </Text>
            </View>

            {/* Form */}
            <View className="space-y-3">
              <Controller
                control={control}
                name="nim"
                render={({ field: { onChange, value } }) => (
                  <View className="mb-4">
                    <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 dark:bg-gray-700 dark:border-gray-600">
                      <Feather name="hash" size={20} color="#6B7280" />
                      <TextInput
                        autoCapitalize="none"
                        placeholder="NIM"
                        value={value}
                        onChangeText={onChange}
                        className="flex-1 ml-2 text-gray-900 dark:text-white"
                        placeholderTextColor="#9CA3AF"
                      />
                    </View>
                    {errors.nim && (
                      <Text className="text-sm text-red-500 mt-1 px-2">
                        {errors.nim.message}
                      </Text>
                    )}
                  </View>
                )}
              />

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

              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, value } }) => (
                  <View className="mb-4">
                    <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 dark:bg-gray-700 dark:border-gray-600">
                      <Feather name="shield" size={20} color="#6B7280" />
                      <TextInput
                        placeholder="Konfirmasi Password"
                        value={value}
                        onChangeText={onChange}
                        secureTextEntry={!showConfirmPassword}
                        className="flex-1 ml-2 text-gray-900 dark:text-white"
                        placeholderTextColor="#9CA3AF"
                      />
                      <Pressable
                        onPress={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        <Feather
                          name={showConfirmPassword ? 'eye-off' : 'eye'}
                          size={20}
                          color="#6B7280"
                        />
                      </Pressable>
                    </View>
                    {errors.confirmPassword && (
                      <Text className="text-sm text-red-500 mt-1 px-2">
                        {errors.confirmPassword.message}
                      </Text>
                    )}
                  </View>
                )}
              />
            </View>

            {/* Button */}
            <TouchableOpacity
              onPress={handleSubmit(onSignUpPress)}
              disabled={loading}
              className={`mt-6 rounded-xl py-4 items-center ${
                loading ? 'bg-blue-400' : 'bg-blue-600'
              }`}
            >
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="text-white font-semibold text-lg">
                  Daftar Sekarang
                </Text>
              )}
            </TouchableOpacity>

            {/* Terms & Conditions */}
            <Text className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
              Dengan mendaftar, Anda menyetujui{' '}
              <Text className="text-blue-600">Syarat dan Ketentuan</Text> serta{' '}
              <Text className="text-blue-600">Kebijakan Privasi</Text> kami
            </Text>

            {/* Sign In link */}
            <View className="flex-row justify-center mt-6">
              <Text className="text-gray-600 dark:text-gray-300">
                Sudah punya akun?{' '}
              </Text>
              <Link href="/login" asChild>
                <TouchableOpacity>
                  <Text className="text-blue-600 font-semibold">Masuk</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Page;
