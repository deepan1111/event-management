// // // src/firebase.js
// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: "AIzaSyBNGqsYf3GxsLlh10rqYYIHu_dK6b9Rqhs",
//   authDomain: "em-web-324ec.firebaseapp.com",
//   projectId: "event-efeda",
//   storageBucket: "em-web-324ec.firebasestorage.app",
//   messagingSenderId: "1041450854898",
//   appId: "1:1041450854898:web:3625c9385222a4848ae36b"
// };

// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
// export const db = getFirestore(app);


// // src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
 apiKey: "AIzaSyAOmzZOvWkMeBhJNWwNPKsHOz8p8VXSQqA",
  authDomain: "event-3843c.firebaseapp.com",
  projectId: "event-3843c",
  storageBucket: "event-3843c.firebasestorage.app",
  messagingSenderId: "385075081725",
  appId: "1:385075081725:web:53e91c1fd08c504c086994",
  measurementId: "G-914BJ7GWVT"
};



const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
