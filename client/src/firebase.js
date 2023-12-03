import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: import.meta.env.API_KEY,
  authDomain: "house-renting-6e436.firebaseapp.com",
  projectId: "house-renting-6e436",
  storageBucket: "house-renting-6e436.appspot.com",
  messagingSenderId: "490396670125",
  appId: "1:490396670125:web:88a238a013f2ea49fa8e24",
  measurementId: "G-WKEDHXW519"
};

export const app = initializeApp(firebaseConfig);