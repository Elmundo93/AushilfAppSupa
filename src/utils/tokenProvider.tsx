export const tokenProvider = async (userId: string) => {
  try {
    const response = await fetch(`https://us-central1-aushilfapp.cloudfunctions.net/generateToken?userId=${userId}`);
    if (!response.ok) {
      throw new Error(`Token konnte nicht abgerufen werden: ${response.statusText}`);
    }
    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error('Fehler beim Abrufen des Tokens:', error);
    throw error;
  }
};