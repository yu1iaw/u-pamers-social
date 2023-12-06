import { initializeApp } from "firebase/app";

export const firebaseInit = () => {
    const firebaseConfig = {
      apiKey: "AIzaSyDSICz0xbXZL6HN1Z6tNRYGueZ3T0nceYc",
      authDomain: "noepam-a8c2d.firebaseapp.com",
      projectId: "noepam-a8c2d",
      storageBucket: "noepam-a8c2d.appspot.com",
      messagingSenderId: "972038465449",
      appId: "1:972038465449:web:bd55a0c713908c36b206b8"
    };

    return initializeApp(firebaseConfig);
}

