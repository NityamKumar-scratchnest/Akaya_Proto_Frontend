import { router } from "expo-router";
// import { Package } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import { login } from "../redux/slices/authSlice";
import { loginUser } from "../services/authApi";

export default function LoginScreen() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await loginUser(email, password);

      dispatch(
        login({
          user: data.user,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        })
      );

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.card}>
        {/* <Package size={48} color="#1E66F9" style={styles.logoIcon} /> */}
        <Text style={styles.appName}>Acaya</Text>
        <Text style={styles.subtitle}>
          Sign in to manage your smart containers
        </Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="you@example.com"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          placeholderTextColor="#999"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          placeholderTextColor="#999"
          secureTextEntry
        />

        <Pressable onPress={handleLogin} style={styles.button} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </Pressable>

        {/* <Text style={styles.hint}>
          
        </Text> */}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e9f0ff",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
      },
    }),
  },
  appName: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 8,
    fontFamily: "serif",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
    color: "#333",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f4f4f4",
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
    fontSize: 16,
  },
  button: {
    width: "100%",
    backgroundColor: "#1E66F9",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  hint: {
    marginTop: 16,
    fontSize: 12,
    color: "#888",
    textAlign: "center",
  },
  logoIcon: {
    marginBottom: 12,
  },
  error: {
    color: "red",
    marginBottom: 8,
  },
});
