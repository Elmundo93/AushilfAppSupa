import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, Text, TextInput, View, Alert } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { signUp } from '../../components/Cruid/Auth';

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [password, setPassword] = useState('');
  const [vorname, setVorname] = useState('');
  const [nachname, setNachname] = useState('');
  const [location, setLocation] = useState('');

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Fehler', 'Die Passwörter stimmen nicht überein.');
      return;
    }

    setLoading(true);

    try {
      const userData = {
        vorname,
        nachname,
        location,
        email,
        profileImage: ''
      };

      const { error } = await signUp(email, password, userData);

      if (error) {
        Alert.alert('Fehler bei der Registrierung', (error as { message: string }).message || 'Ein unbekannter Fehler ist aufgetreten');
      } else {
        Alert.alert(
          'Registrierung erfolgreich',
          'Bitte überprüfen Sie Ihre E-Mails und bestätigen Sie Ihre E-Mail-Adresse, um die Registrierung abzuschließen.',
          [{ text: 'OK', onPress: () => router.push('/login') }]
        );
      }
    } catch (error) {
      Alert.alert('Fehler', 'Ein unerwarteter Fehler ist aufgetreten.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (label: string, value: string, placeholder: string, onChangeText: (text: string) => void, secureTextEntry = false) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        style={styles.input}
        placeholderTextColor={'rgba(255, 255, 255, 0.7)'}
        placeholder={placeholder}
        autoCapitalize="none"
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoidingView}>
        <View style={styles.formContainer}>
          {renderInput("Vorname:", vorname, "Vorname", setVorname)}
          {renderInput("Nachname:", nachname, "Nachname", setNachname)}
          {renderInput("Wohnort:", location, "Wohnort", setLocation)}
          {renderInput("E-Mail Adresse:", email, "Email", setEmail)}
          {renderInput("Passwort:", password, "Passwort", setPassword, true)}
          {renderInput("Passwort wiederholen:", confirmPassword, "Passwort wiederholen", setConfirmPassword, true)}
        </View>
        <View style={styles.buttonContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#ffffff" />
          ) : (
            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
              <Text style={styles.buttonText}>Registrieren!</Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4a90e2',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
    

  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: 'white',
    marginBottom: 5,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    padding: 10,
    color: 'white',
    fontSize: 16,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  registerButton: {
    backgroundColor: '#ff9800',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Page;