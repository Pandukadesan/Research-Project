import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    if (!name || !email || !role || !password || !confirmPassword) {
      Alert.alert('Error', 'All fields are required');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      const response = await fetch(`http://172.20.10.3:8070/api/user/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, role, password }),
      });

      // Parse as text instead of JSON to avoid errors
      const text = await response.text();
      console.log('Server response:', text);

      if (response.ok) {
        Alert.alert('Success', text);
        router.push('/(login)');
      } else {
        Alert.alert('Error', text);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Cannot connect to server. Make sure your phone and computer are on the same Wi-Fi and the IP is correct.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Register to continue</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="#64748B"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#64748B"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Role"
        placeholderTextColor="#64748B"
        value={role}
        onChangeText={setRole}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#64748B"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#64748B"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => router.push('/(login)')}>
          <Text style={styles.loginLink}> Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', justifyContent: 'center', padding: 24 },
  title: { fontSize: 32, fontWeight: '700', color: '#0F172A', textAlign: 'center', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#475569', textAlign: 'center', marginBottom: 24 },
  input: { backgroundColor: '#FFFFFF', borderRadius: 8, padding: 14, fontSize: 16, color: '#0F172A', marginBottom: 16, borderWidth: 1, borderColor: '#CBD5E1' },
  button: { backgroundColor: '#2563EB', paddingVertical: 14, borderRadius: 8, marginTop: 8 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600', textAlign: 'center' },
  loginContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
  loginText: { color: '#475569', fontSize: 14 },
  loginLink: { color: '#2563EB', fontSize: 14, fontWeight: '600' },
});
