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
import { signUpSchema, type SignUpFormValues } from './types/schemas';
import { signUpWithEmail } from './services/authService';
import { signInWithGoogle } from './services/googleAuthService';
import { signInWithApple, isAppleSignInAvailable } from './services/appleAuthService';
import { isSupabaseConfigured } from '@/services/supabase/client';
import { useAppReadinessStore } from '@/store/appReadinessStore';

function GoogleGlyph() {
  const { colors } = useTheme();
  return (
    <Text variant="subheading" style={{ color: colors.textPrimary }}>
      G
    </Text>
  );
}

export function SignUpScreen() {
  const { colors } = useTheme();
  const hasCompletedOnboarding = useAppReadinessStore((s) => s.hasCompletedOnboarding);
  // Anyone who hasn't finished onboarding yet still needs to pick a goal,
  // regardless of which screen sent them here (AccountChoice,
  // GuestWarning, or even Sign In's "create an account" link) — so this
  // checks the actual completion state rather than threading a 'from'
  // param through every possible entry point.
  const needsGoalSelection = !hasCompletedOnboarding;
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmationSent, setConfirmationSent] = useState(false);
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
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (values: SignUpFormValues) => {
    setFormError(null);
    setIsSubmitting(true);
    const result = await signUpWithEmail(values);
    setIsSubmitting(false);

    if (!result.success) {
      setFormError(result.error ?? 'Something went wrong. Try again.');
      return;
    }

    // Supabase's default config requires email confirmation before a
    // session is issued, so signUp succeeding doesn't always mean
    // "signed in" yet — show a clear next step instead of silently
    // staying on this screen.
    setConfirmationSent(true);
  };

  const handleGoogleSignIn = async () => {
    setFormError(null);
    setIsGoogleLoading(true);
    const result = await signInWithGoogle();
    setIsGoogleLoading(false);

    if (result.success) {
      router.replace(needsGoalSelection ? '/(onboarding)/goal' : '/(tabs)/home');
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
      router.replace(needsGoalSelection ? '/(onboarding)/goal' : '/(tabs)/home');
    } else if (result.error) {
      setFormError(result.error);
    }
  };

  if (confirmationSent) {
    return (
      <View
        className="flex-1 items-center justify-center gap-3 px-8"
        style={{ backgroundColor: colors.background }}
      >
        <Text variant="heading" className="text-center">
          Check your inbox
        </Text>
        <Text variant="body" tone="secondary" className="text-center">
          We sent a confirmation link to finish setting up your account.
          {needsGoalSelection
            ? ' You can keep going in the meantime — your account finishes setting up in the background.'
            : ' Once confirmed, sign in to continue.'}
        </Text>
        {needsGoalSelection ? (
          <Button label="Continue" onPress={() => router.push('/(onboarding)/goal')} />
        ) : (
          <Button label="Back to sign in" onPress={() => router.replace('/(auth)/sign-in')} />
        )}
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
      contentContainerClassName="px-6 pb-10 pt-20 gap-6"
      keyboardShouldPersistTaps="handled"
    >
      <View>
        <Text variant="heading">Create your account</Text>
        <Text variant="body" tone="secondary" className="mt-1">
          Your progress already saves on this device — an account just
          backs it up and syncs it across devices.
        </Text>
      </View>

      {!isSupabaseConfigured && (
        <View className="rounded-md p-3" style={{ backgroundColor: colors.surfaceAlt }}>
          <Text variant="caption" tone="secondary">
            Account creation isn&apos;t configured on this build yet. You
            can still continue as a guest below.
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
              placeholder="At least 8 characters"
              isPassword
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              errorMessage={errors.password?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field }) => (
            <TextField
              label="Confirm password"
              placeholder="••••••••"
              isPassword
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              errorMessage={errors.confirmPassword?.message}
            />
          )}
        />

        {formError && (
          <Text variant="caption" tone="danger">
            {formError}
          </Text>
        )}

        <Button
          label="Create account"
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
          Already have an account?
        </Text>
        <Text variant="bodyMedium" tone="accent" onPress={() => router.replace('/(auth)/sign-in')}>
          Sign in
        </Text>
      </View>
    </ScrollView>
  );
}
