
export const generatePassword = (): string => {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  return result;
};

export const shuffle = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

/**
 * Secret Santa logic:
 * Uses a circular shift of a shuffled array to guarantee 
 * that nobody draws themselves and everyone is assigned exactly one unique person.
 */
export const performSecretSantaDraw = (participants: { id: string, name: string }[]) => {
  if (participants.length < 2) return null;

  const shuffled = shuffle(participants);
  const result: Record<string, { drawnId: string; password: string }> = {};

  for (let i = 0; i < shuffled.length; i++) {
    const current = shuffled[i];
    const next = shuffled[(i + 1) % shuffled.length];
    
    result[current.id] = {
      drawnId: next.id,
      password: generatePassword()
    };
  }

  return result;
};
