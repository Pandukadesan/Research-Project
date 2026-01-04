import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // UI only

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    try {
      const response = await fetch(
        `http://172.20.10.3:8070/api/user/getDetails/${email}`
      );

      const data = await response.json();

      // ❌ No user found
      if (!data || data.length === 0) {
        Alert.alert("Error", "User not found");
        return;
      }

      const user = data[0]; // backend returns array

      // ❌ Password mismatch
      if (user.password !== password) {
        Alert.alert("Error", "Incorrect password");
        return;
      }

      

      // ✅ Navigation based on role
      if (user.role === "user") {
        router.replace("/(user dashboard)");
      } else if (user.role === "seller") {
        router.replace("/(sell vehicle)");
      } else if (user.role === "service") {
        router.replace("/(service)");
      }

    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Cannot connect to server");
    }
  };

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Mileage Guard</Text>
      <Text style={styles.subtitle}>Login to continue</Text>

      {/* Role Selector */}
      <View style={styles.roleContainer}>
        {['User', 'Seller', 'Service Centre'].map((item) => {
          const key = item.toLowerCase().replace(' ', '');
          return (
            <TouchableOpacity
              key={item}
              style={[
                styles.roleButton,
                role === key && styles.roleButtonActive,
              ]}
              onPress={() => setRole(key)}
            >
              <Text
                style={[
                  styles.roleText,
                  role === key && styles.roleTextActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Email */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#64748B"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      {/* Password */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#64748B"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Login Button */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      {/* Register */}
      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>Don’t have an account?</Text>
        <TouchableOpacity onPress={() => router.push('/(register)')}>
          <Text style={styles.registerLink}> Register</Text>
        </TouchableOpacity>
      </View>

      {/* Forgot Password */}
      <TouchableOpacity>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    marginBottom: 24,
  },

  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
  },
  roleButtonActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  roleText: {
    textAlign: 'center',
    color: '#334155',
    fontWeight: '500',
    fontSize: 13,
  },
  roleTextActive: {
    color: '#FFFFFF',
  },

  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    color: '#0F172A',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },

  button: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },

  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  registerText: {
    color: '#475569',
    fontSize: 14,
  },
  registerLink: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '600',
  },

  forgotText: {
    color: '#2563EB',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 14,
  },
});
