import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import ProfileAvatar from '@/src/components/ProfileImage/ProfileAvatar';

const EinstellungenPage: React.FC = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userString = await AsyncStorage.getItem('currentUser');
        if (userString) {
          setUser(JSON.parse(userString));
        }
      } catch (error) {
        console.error('Fehler beim Laden der Benutzerdaten:', error);
      }
    };

    loadUser();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('currentUser');
      router.push('/login');
    } catch (error) {
      console.error('Fehler beim Ausloggen:', error);
    }
  };

  if (!user) {
    return <View style={styles.container}><Text>Laden...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <ProfileAvatar />
      <Text style={styles.header}>Nutzerdaten</Text>
      <View style={styles.card}>
        <Text style={styles.cardText}>Name: {user.vorname} {user.nachname}</Text>
        <Text style={styles.cardText}>E-Mail: {user.email}</Text>
        <Text style={styles.cardText}>Standort: {user.location}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  card: {
    width: '100%',
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#f8f8f8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
  },
  cardText: {
    fontSize: 18,
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'red',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EinstellungenPage;