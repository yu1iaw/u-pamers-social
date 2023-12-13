import { initializeApp } from "firebase/app";

import { EXPO_PUBLIC_FIRESTORE_API_KEY } from '@env';
import { EXPO_PUBLIC_FIRESTORE_PROJECT_ID } from '@env';



export const firebaseInit = () => {
    const firebaseConfig = {
      apiKey: EXPO_PUBLIC_FIRESTORE_API_KEY,
      projectId: EXPO_PUBLIC_FIRESTORE_PROJECT_ID,
    };

    return initializeApp(firebaseConfig);
}

