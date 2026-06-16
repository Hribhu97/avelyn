import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBp9SW8A3sBzvr2GtzmBOeO9P3PtCowOhw',
  authDomain: 'ineya-3c84b.firebaseapp.com',
  projectId: 'ineya-3c84b',
  storageBucket: 'ineya-3c84b.firebasestorage.app',
  messagingSenderId: '947864838544',
  appId: '1:947864838544:web:39c649432c557cd3c05315',
  measurementId: 'G-PYGPPLL2Y2',
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
export const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: 'select_account',
});

isSupported()
  .then((supported) => {
    if (supported) {
      getAnalytics(firebaseApp);
    }
  })
  .catch(() => {
    // Analytics is optional in unsupported environments.
  });
