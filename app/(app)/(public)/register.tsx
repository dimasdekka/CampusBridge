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
} from 'react-native';
import * as z from 'zod';

const schema = z
  .object({
    nim: z.string().min(8, 'NIM must be at least 8 characters'),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .max(20, 'Password is too long'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password don't match",
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof schema>;

const Page = () => {
  const { onRegister } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

  const onSignUpPress = async (data: RegisterFormData) => {
    setLoading(true);
    try {
      // Kirim nim, email, password sesuai urutan di AuthProvider!
      const result = await onRegister(data.nim, data.email, data.password);
      console.log('Registration successful', result);
    } catch (e) {
      Alert.alert('Error', 'Could not create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'android' ? 'padding' : 'height'}
      className="flex-1 bg-white p-6 dark:bg-gray-900"
    >
      <View className="flex-1 justify-center w-full max-w-md mx-auto">
        <Text className="text-4xl font-bold text-gray-900 mb-2 dark:text-white">
          Create Account
        </Text>
        <Text className="text-lg text-gray-600 mb-8 dark:text-white">
          Sign up to start your Campus Bridge Journey
        </Text>

        <View className="gap-2">
          <Controller
            control={control}
            name="nim"
            render={({ field: { onChange, value } }) => (
              <View>
                <TextInput
                  autoCapitalize="none"
                  placeholder="Nim"
                  value={value}
                  onChangeText={onChange}
                  className="bg-gray-100 border border-gray-300 rounded-xl p-4 text-gray-900 dark:bg-gray-800 dark:text-white"
                />
                {errors.nim && (
                  <Text className="text-red-500">{errors.nim.message}</Text>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <View>
                <TextInput
                  autoCapitalize="none"
                  placeholder="Email address"
                  value={value}
                  onChangeText={onChange}
                  className="bg-gray-100 border border-gray-300 rounded-xl p-4 text-gray-900 dark:bg-gray-800 dark:text-white"
                />
                {errors.email && (
                  <Text className="text-red-500">{errors.email.message}</Text>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <View>
                <TextInput
                  placeholder="Password"
                  value={value}
                  onChangeText={onChange}
                  secureTextEntry
                  className="bg-gray-100 border border-gray-300 rounded-xl p-4 text-gray-900 dark:bg-gray-800 dark:text-white"
                />
                {errors.password && (
                  <Text className="text-red-500">
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
              <View>
                <TextInput
                  placeholder="Confirm Password"
                  value={value}
                  onChangeText={onChange}
                  secureTextEntry
                  className="bg-gray-100 border border-gray-300 rounded-xl p-4 text-gray-900 dark:bg-gray-800 dark:text-white"
                />
                {errors.confirmPassword && (
                  <Text className="text-red-500">
                    {errors.confirmPassword.message}
                  </Text>
                )}
              </View>
            )}
          />
        </View>

        <TouchableOpacity
          onPress={handleSubmit(onSignUpPress)}
          disabled={loading}
          className={`bg-blue-600 rounded-xl p-4 items-center mt-6 ${
            loading ? 'opacity-50' : ''
          }`}
        >
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text className="text-white font-semibold text-lg">
              Create Account
            </Text>
          )}
        </TouchableOpacity>

        {Platform.OS == 'web' && (
          <View className="flex-row justify-center mt-4">
            <Text className="text-gray-600 dark:text-white">
              Already have an account?{' '}
            </Text>
            <Link href="/login" asChild>
              <TouchableOpacity>
                <Text className="text-blue-600 font-semibold">Sign In</Text>
              </TouchableOpacity>
            </Link>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};
export default Page;
