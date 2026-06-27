import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallbackTitle?: string;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * Catches render-time errors anywhere below it in the tree so one broken
 * screen (e.g. a malformed lesson payload) can't blank the whole app.
 * Wrapped around the root layout and, individually, around the code
 * editor and AI tutor screens in later phases, since those are the
 * highest-risk surfaces for unexpected runtime errors.
 *
 * Deliberately a class component: error boundaries have no hook
 * equivalent in React as of this writing.
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  override componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Phase 9 wires this into a real crash-reporting sink. For now it's
    // surfaced to the console so it isn't silently swallowed in dev.
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  handleRetry = () => {
    this.setState({ error: null });
  };

  override render() {
    if (this.state.error) {
      return (
        <View className="flex-1 items-center justify-center gap-3 px-8">
          <Text variant="heading" className="text-center">
            {this.props.fallbackTitle ?? 'Something broke.'}
          </Text>
          <Text variant="body" tone="secondary" className="text-center">
            That wasn&apos;t supposed to happen. You can try again, and if
            it keeps occurring, your progress is safe &mdash; it&apos;s saved
            locally.
          </Text>
          <Button label="Try again" onPress={this.handleRetry} />
        </View>
      );
    }

    return this.props.children;
  }
}
