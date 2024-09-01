import axios from 'axios';

// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

import {
  collection,
  getFirestore,
  getDocs,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteField,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes  } from 'firebase/storage';


// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

const firebaseConfig = {

  apiKey: "AIzaSyCyfxITBJFiLpy86OkpuyzXP8p_cUwS5Ko",

  authDomain: "artella-3facf.firebaseapp.com",

  projectId: "artella-3facf",

  storageBucket: "artella-3facf.appspot.com",

  messagingSenderId: "901180588632",

  appId: "1:901180588632:web:f2da9a573d41c97d9c802d"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const API_BASE_URL = 'https://api.artsy.net/api';

const artsyApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'X-Xapp-Token': "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6IiIsInN1YmplY3RfYXBwbGljYXRpb24iOiIzZDZkODQ5Ni1iZGY0LTQ5ZjgtYTVjMy0yY2RmZDYxNTc4ODAiLCJleHAiOjE3MjUzNTU1MzEsImlhdCI6MTcyNDc1MDczMSwiYXVkIjoiM2Q2ZDg0OTYtYmRmNC00OWY4LWE1YzMtMmNkZmQ2MTU3ODgwIiwiaXNzIjoiR3Jhdml0eSIsImp0aSI6IjY2Y2Q5YjhiZmQ3NmVmMDAwZjBiMDZlZSJ9.uxxrB3q1D6CcqqPfsj0VYAffgnsLeZBEXqANcwMa6-Y",
  },
});

export default {
  
  searchArtists(id: string) {
    return artsyApi.get(`/search?q=${id}&type=artist`);
  },

  getGene(id: string) {
    return artsyApi.get(`/search?q=${id}&type=artwork`)
  },

  getArtbyArtist(id: string) {
    return artsyApi.get(`artworks?artist_id=${id}`)
  },

  getArtist(id: string) {
    return artsyApi.get(`/artists/${id}`); 
  },

  geArtObj(artista: string) {
    return artsyApi.get(`${artista.substring(1)}`)
  },

  dbEx: function(){
    return db
  },

  getUserName: function () {
    return localStorage.getItem("login");
  },
  getUserData: async function (user: string) {

      const docRef = doc(db, "utenti", user);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        console.log(docSnap.data().username)
        return docSnap.data().username
      } else {
      }
  },
  logout: function () {
    localStorage.removeItem("login");
  },
  isAuthenticated: function () {
    return Boolean(localStorage.getItem("login"));
  },

  registrazione: function (username: any, email: any, password: any) {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential: any) => {
        // Signed up 
        const user = userCredential.user;
        return setDoc(doc(db, "utenti", user.uid), {
          idutente: user.uid,
          username: username,
          email: email,
          bio: "",
          profile_picture_url: "",
        });
      })
      .catch((error: any) => {
        alert("Account già esistente");
      });
  },

  login: function (email: any, password: any) {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user
        localStorage.setItem("login", user.uid)
        this.isAuthenticated 
        window.location.reload();
      })
      .catch((error) => {
        alert("Email o password errate");
      });
  },

};