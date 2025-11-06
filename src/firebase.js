import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // 여기에 본인 config 붙여넣기
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };