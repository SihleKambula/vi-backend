import firebase from "./firebase.js";
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

const db = getFirestore(firebase);
const timeStamp = serverTimestamp();

export const createNote = async (transcribedData, uid) => {
  try {
    const data = {
      transcript: transcribedData,
      createdAt: timeStamp,
      userID: uid,
    };
    await addDoc(collection(db, "notes"), data);
    return true;
  } catch (error) {
    console.log(error);
  }
};
