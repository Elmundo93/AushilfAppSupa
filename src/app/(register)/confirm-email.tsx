import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { confirmEmail } from '../../components/Cruid/Auth';

export default function ConfirmEmail() {
  const { token, email } = useLocalSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState('E-Mail wird bestätigt...');

  useEffect(() => {
    async function verifyEmail() {
      if (token && email) {
        try {
          const { data, error } = await confirmEmail(token as string, email as string);

          if (error) {
            setMessage('Fehler bei der E-Mail-Bestätigung: ' + error.message);
          } else {
            setMessage('E-Mail erfolgreich bestätigt!');
            setTimeout(() => router.push('/login'), 2000);
          }
        } catch (error) {
          setMessage('Ein unerwarteter Fehler ist aufgetreten.');
          console.error(error);
        }
      } else {
        setMessage('Ungültige Parameter für die E-Mail-Bestätigung.');
      }
    }

    verifyEmail();
  }, [token, email]);

  return (
    <View>
      <Text>{message}</Text>
    </View>
  );
}