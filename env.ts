import Constants from 'expo-constants';

// Definieren Sie einen Typ für Ihre Umgebungsvariablen
type ENV = {
  supabaseUrl: string;
  supabaseKey: string;
};

// Implementieren Sie eine Funktion, um die Umgebungsvariablen zu holen
const getEnvVars = (): ENV => {
  if (__DEV__) {
    // In der Entwicklung können wir direkt auf process.env zugreifen
    return {
      supabaseUrl: process.env.SUPABASE_URL as string,
      supabaseKey: process.env.SUPABASE_KEY as string,
    };
  } else {
    // In der Produktion verwenden wir Constants.expoConfig.extra
    const extra = Constants.expoConfig?.extra;
    if (!extra) throw new Error('Umgebungsvariablen nicht gefunden');
    
    return {
      supabaseUrl: extra.supabaseUrl as string,
      supabaseKey: extra.supabaseKey as string,
    };
  }
};

export default getEnvVars();