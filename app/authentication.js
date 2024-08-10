import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth } from "./firebase"; // adjust the path if necessary

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    console.log(result.user);
    // You can handle user info here, such as saving it to the state or session
  } catch (error) {
    console.error(error);
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
    console.log("User signed out");
  } catch (error) {
    console.error(error);
  }
};