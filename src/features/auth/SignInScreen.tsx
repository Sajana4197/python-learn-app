import { Apple } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { View, ScrollView, Platform } from 'react-native';
import { router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { SocialSignInButton } from '@/components/ui/SocialSignInButton';
import { useTheme } from '@/theme/ThemeProvider';
import { signInSchema, type SignInFormValues } from './types/schemas';
import { signInWithEmail } from './services/authService';
import { signInWithGoogle } from './services/googleAuthService';
import { signInWithApple, isAppleSignInAvailable } from './services/appleAuthService';
import { isSupabaseConfigured } from '@/services/supabase/client';

/**
 * A plain "G" letterform, not Google's actual logo mark (which is
 * trademarked and shouldn't be reproduced without their asset kit).
 * Most sign-in buttons in production apps use Google's official SDK-
 * provided button assets; swap this for those once you've pulled
 * Google's official button kit for your platform builds.
 */
function GoogleGlyph() {
  const { colors } = useTheme();
  return (
    <Text variant="subheading" style={{ color: colors.textPrimary }}>
      G
    </Text>
  );
}

export function SignInScreen() {
  const { colors } = useTheme();
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isAppleLoading, setIsAppleLoading] = useState(false);
  const [showAppleButton, setShowAppleButton] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      isAppleSignInAvailable().then(setShowAppleButton);
    }
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: SignInFormValues) => {
    setFormError(null);
    setIsSubmitting(true);
    const result = await signInWithEmail(values);
    setIsSubmitting(false);

    if (!result.success) {
      setFormError(result.error ?? 'Something went wrong. Try again.');
      return;
    }
    router.replace('/(tabs)/home');
  };

  const handleGoogleSignIn = async () => {
    setFormError(null);
    setIsGoogleLoading(true);
    const result = await signInWithGoogle();
    setIsGoogleLoading(false);

    if (result.success) {
      router.replace('/(tabs)/home');
    } else if (result.error) {
      setFormError(result.error);
    }
  };

  const handleAppleSignIn = async () => {
    setFormError(null);
    setIsAppleLoading(true);
    const result = await signInWithApple();
    setIsAppleLoading(false);

    if (result.success) {
      router.replace('/(tabs)/home');
    } else if (result.error) {
      setFormError(result.error);
    }
  };

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
      contentContainerClassName="px-6 pb-10 pt-20 gap-6"
      keyboardShouldPersistTaps="handled"
    >
      <View>
        <Text variant="heading">Welcome back</Text>
        <Text variant="body" tone="secondary" className="mt-1">
          Sign in to pick up where you left off.
        </Text>
      </View>

      {!isSupabaseConfigured && (
        <View
          className="rounded-md p-3"
          style={{ backgroundColor: colors.surfaceAlt }}
        >
          <Text variant="caption" tone="secondary">
            Sign-in isn&apos;t configured on this build yet. You can still
            continue as a guest below.
          </Text>
        </View>
      )}

      <View className="gap-4">
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <TextField
              label="Email"
              placeholder="you@example.com"
              keyboardType="email-address"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              errorMessage={errors.email?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field }) => (
            <TextField
              label="Password"
              placeholder="••••••••"
              isPassword
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              errorMessage={errors.password?.message}
            />
          )}
        />

        {formError && (
          <Text variant="caption" tone="danger">
            {formError}
          </Text>
        )}

        <Button
          label="Sign in"
          size="lg"
          isLoading={isSubmitting}
          onPress={handleSubmit(onSubmit)}
        />
      </View>

      <View className="flex-row items-center gap-3">
        <View className="h-px flex-1" style={{ backgroundColor: colors.border }} />
        <Text variant="caption" tone="secondary">
          or
        </Text>
        <View className="h-px flex-1" style={{ backgroundColor: colors.border }} />
      </View>

      <View className="gap-3">
        <SocialSignInButton
          label="Continue with Google"
          icon={<GoogleGlyph />}
          onPress={handleGoogleSignIn}
          isLoading={isGoogleLoading}
        />
        {showAppleButton && (
          <SocialSignInButton
            label="Continue with Apple"
            icon={<Apple color={colors.textPrimary} size={20} />}
            onPress={handleAppleSignIn}
            isLoading={isAppleLoading}
          />
        )}
      </View>

      <View className="flex-row justify-center gap-1">
        <Text variant="body" tone="secondary">
          New to Indent?
        </Text>
        <Text
          variant="bodyMedium"
          tone="accent"
          onPress={() => router.push('/(auth)/sign-up')}
        >
          Create an account
        </Text>
      </View>

      <Button
        label="Continue as guest"
        variant="ghost"
        onPress={() => router.replace('/(tabs)/home')}
      />
    </ScrollView>
  );
}
