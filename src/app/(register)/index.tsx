import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';


const Page = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [password, setPassword] = useState('');
  const [vorname, setVorname] = useState('');
  const [nachname, setNachname] = useState('');
  const [location, setLocation] = useState('');


  const handleRegister = async () => {
   
      router.push('/register'); // Navigate to login on successful registration
    
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
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.formContainer}>
            <Text style={styles.title}>Sicherheit geht bei uns vor!</Text>
            <Text style={styles.subtitle}>Da wir einen sicheren Rahmen für groß und klein schaffen wollen, benötigt die Nutzung der AushilfApp eine Verifizierung mit einem gültigen Personalausweis.</Text>
            <Text style={styles.subtitle}>Bitte halte deinen gültigen Personalausweis bereit um mit der Registrierung fortzufahren.</Text>
            <Text style={styles.subtitle}>
  Alles über unsere Datenschutzrichtlinien erfährst du{' '}
  <Text style={styles.link} onPress={() => {router.replace('/')}}>hier</Text>
</Text>

            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
              <Text style={styles.buttonText}>Registrieren!</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
    margin: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    marginBottom: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 15,
    width: '100%',
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
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  link: {
    color: '#ff9800',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
    fontSize: 18,

  },
});

export default Page;