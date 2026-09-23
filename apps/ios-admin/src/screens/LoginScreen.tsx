import { Ionicons } from "@expo/vector-icons";
import { createElement, useEffect, useState, type ComponentProps, type FormEvent, type PropsWithChildren } from "react";
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { apiClient } from "@/api/apiClient";
import { endpoints } from "@/api/endpoints";
import { ErrorBanner } from "@/components/ErrorBanner";
import { ActionButton, ModalHeader, SectionCard } from "@/components/AppScaffold";
import { useAuth } from "@/auth/AuthContext";
import { colors } from "@/theme/colors";

type LoginFormProps = PropsWithChildren<{
  className: string;
  onSubmit: () => void;
}>;

function LoginFormContainer({ children, className, onSubmit }: LoginFormProps) {
  if (Platform.OS === "web") {
    return createElement(
      "form",
      {
        className,
        onSubmit: (event: FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          onSubmit();
        }
      },
      children
    );
  }

  return <View className={className}>{children}</View>;
}

export function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const canSubmit = email.trim().length > 0 && password.length > 0 && !isSubmitting;

  async function submit(): Promise<void> {
    if (!canSubmit) return;
    setIsSubmitting(true);
    setError(null);

    try {
      await login(email.trim(), password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1 bg-svDark">
      <View className="flex-1">
        <View className="px-6 pb-8 pt-16">
          <View className="h-14 w-14 items-center justify-center rounded-lg bg-white/10">
            <Ionicons name="shield-checkmark" size={30} color={colors.svBrand} />
          </View>
          <Text className="mt-5 text-4xl font-extrabold text-white" numberOfLines={1} adjustsFontSizeToFit>
            SpeedyVan Admin
          </Text>
          <Text className="mt-2 text-base font-bold leading-6 text-slate-300">
            Secure operations access for bookings, drivers, jobs, and enquiries.
          </Text>
        </View>
        <View className="flex-1 items-center rounded-t-lg bg-svBackground px-6 pt-7">
          <View className="w-full max-w-md">
            <Text className="text-2xl font-extrabold text-svDark">Sign in</Text>
            <Text className="mt-1 text-sm font-bold text-slate-500">Use your admin credentials to continue.</Text>
            {error ? <ErrorBanner message={error} /> : null}
            <LoginFormContainer
              className="mt-6 gap-4"
              onSubmit={() => {
                void submit();
              }}
            >
              <AuthField icon="mail-outline">
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Email"
                  placeholderTextColor="#94A3B8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="emailAddress"
                  returnKeyType="next"
                  editable={!isSubmitting}
                  className="min-h-12 flex-1 text-base text-svDark outline-none"
                />
              </AuthField>
              <AuthField icon="lock-closed-outline">
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Password"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry
                  textContentType="password"
                  returnKeyType="done"
                  onSubmitEditing={() => {
                    void submit();
                  }}
                  editable={!isSubmitting}
                  className="min-h-12 flex-1 text-base text-svDark outline-none"
                />
              </AuthField>
              <Pressable
                onPress={() => setShowForgotPassword(true)}
                className="self-end rounded-lg px-1 py-1"
              >
                <Text className="text-sm font-extrabold text-svBrand">Forgot password?</Text>
              </Pressable>
              <Pressable
                disabled={!canSubmit}
                onPress={() => {
                  void submit();
                }}
                className={canSubmit ? "rounded-lg bg-svBrand py-4 shadow-sm" : "rounded-lg bg-slate-200 py-4"}
              >
                <Text className={canSubmit ? "text-center text-base font-extrabold text-white" : "text-center text-base font-extrabold text-slate-500"}>
                  {isSubmitting ? "Signing In..." : "Sign In"}
                </Text>
              </Pressable>
            </LoginFormContainer>
          </View>
        </View>
      </View>
      <ForgotPasswordModal
        visible={showForgotPassword}
        initialEmail={email}
        onClose={() => setShowForgotPassword(false)}
      />
    </KeyboardAvoidingView>
  );
}

function AuthField({ icon, children }: PropsWithChildren<{ icon: ComponentProps<typeof Ionicons>["name"] }>) {
  return (
    <View className="flex-row items-center gap-3 rounded-lg border border-svLine bg-white px-4 py-2 shadow-sm">
      <Ionicons name={icon} size={19} color={colors.muted} />
      {children}
    </View>
  );
}

function ForgotPasswordModal({
  visible,
  initialEmail,
  onClose
}: {
  visible: boolean;
  initialEmail: string;
  onClose: () => void;
}) {
  const [resetEmail, setResetEmail] = useState(initialEmail);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const canSend = resetEmail.trim().length > 0 && !isSending;

  useEffect(() => {
    if (!visible) return;
    setResetEmail(initialEmail);
    setError(null);
    setSent(false);
  }, [initialEmail, visible]);

  async function sendReset(): Promise<void> {
    if (!canSend) return;
    setIsSending(true);
    setError(null);
    setSent(false);

    try {
      await apiClient.post<{ success: boolean }>(endpoints.authForgotPassword, { email: resetEmail.trim() });
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send reset email.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-svBackground">
        <ModalHeader title="Reset Password" subtitle="Send a secure reset link to the admin email." onClose={onClose} />
        <ScrollView contentContainerClassName="gap-4 p-4 pb-8">
          <SectionCard title="Admin email" subtitle="Enter the email address for this admin account." icon="mail-outline">
            {error ? <ErrorBanner message={error} /> : null}
            {sent ? (
              <View className="mb-4 flex-row items-start gap-3 rounded-lg border border-emerald-100 bg-emerald-50 p-3">
                <Ionicons name="checkmark-circle" size={20} color={colors.svGreen} />
                <Text className="flex-1 text-sm font-bold leading-5 text-emerald-700">
                  If this email is registered, a password reset link has been sent.
                </Text>
              </View>
            ) : null}
            <AuthField icon="mail-outline">
              <TextInput
                value={resetEmail}
                onChangeText={setResetEmail}
                placeholder="Admin email"
                placeholderTextColor="#94A3B8"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="emailAddress"
                editable={!isSending}
                className="min-h-12 flex-1 text-base text-svDark outline-none"
              />
            </AuthField>
          </SectionCard>
          <ActionButton
            label={isSending ? "Sending..." : "Send Reset Link"}
            icon="paper-plane"
            disabled={!canSend}
            onPress={() => {
              void sendReset();
            }}
          />
        </ScrollView>
      </View>
    </Modal>
  );
}
