import { initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import firebaseConfig from '../config/firebaseConfig.json';

export class FirebaseService {
  static _app;
  static _auth;
  static _db;

  static init() {
    this._app = initializeApp(firebaseConfig);
    this._auth = getAuth(this._app);
    this._db = getFirestore(this._app);
  }

  static async signUp(displayName, email, password) {
    let user;
    const errors = {
      displayName: false,
      email: false,
      password: false,
    };

    try {
      const userCredentials = await createUserWithEmailAndPassword(this._auth, email, password);

      user = userCredentials.user;
      await updateProfile(user, { displayName: displayName });
      await setDoc(doc(this._db, 'users', user.uid), {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      });
    } catch (e) {
      switch (e.code) {
        case 'auth/invalid-display-name':
          errors.displayName = 'Invalid display name';
          break;

        case 'auth/invalid-email':
          errors.email = 'Invalid email';
          break;

        case 'auth/wrong-email':
          errors.email = 'Wrong email';
          break;

        case 'auth/email-already-exists':
        case 'auth/email-already-in-use':
          errors.email = 'Email is already taken';
          break;

        case 'auth/invalid-password':
        case 'auth/wrong-password':
        case 'auth/weak-password':
          errors.password = 'Invalid or weak password';
          break;
      }
    }

    return {
      user,
      errors,
    };
  }

  static async signIn(email, password) {
    let user;
    const errors = {
      email: false,
      password: false,
    };

    try {
      const userCredentials = await signInWithEmailAndPassword(this._auth, email, password);

      user = userCredentials.user;
    } catch (e) {
      switch (e.code) {
        case 'auth/invalid-email':
        case 'auth/wrong-email':
          errors.email = true;
          break;

        case 'auth/invalid-password':
        case 'auth/wrong-password':
          errors.password = true;
          break;
      }
    }

    return {
      user,
      errors,
    };
  }

  static async signOut() {
    signOut(this._auth);
  }

  static onAuthStateChanged(cb) {
    onAuthStateChanged(this._auth, (firebaseUser) => {
      cb(firebaseUser);
    });
  }

  static async getUser(id) {
    let user;

    try {
      const snap = await getDoc(doc(this._db, 'users', id));

      if (snap.exists()) {
        user = {
          id: snap.id,
          ...snap.data(),
        };
      }
    } catch (e) {}

    return user;
  }

  static async updateUserPhoto(user, photo) {
    try {
      await setDoc(doc(this._db, 'users', user.id), {
        ...user,
        photoURL: photo,
      });
    } catch (e) {}
  }

  static async getPosts(authorId, category) {
    const posts = [];

    try {
      const whereClauses = [];

      authorId && whereClauses.push(where('authorId', '==', authorId));
      category && whereClauses.push(where('category', '==', category));

      const q = query(collection(this._db, 'posts'), ...whereClauses);
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        posts.push({
          id: doc.id,
          ...doc.data(),
        });
      });
    } catch (e) {}

    return posts;
  }

  static onPostsChange(cb, authorId, category) {
    let unsubscribe;

    try {
      const whereClauses = [];

      authorId && whereClauses.push(where('authorId', '==', authorId));
      category && whereClauses.push(where('category', '==', category));

      const q = query(collection(this._db, 'posts'), ...whereClauses);

      unsubscribe = onSnapshot(q, (querySnapshot) => {
        const posts = [];

        querySnapshot.forEach((doc) => {
          posts.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        cb(posts);
      });
    } catch (e) {}

    return unsubscribe;
  }

  static async getPost(id) {
    let post;

    try {
      const snap = await getDoc(doc(this._db, 'posts', id));

      if (snap.exists()) {
        post = snap.data();
      }
    } catch (e) {}

    return post;
  }

  static async addPost(title, image, description, category, authorId, authorDisplayName) {
    try {
      await addDoc(collection(this._db, 'posts'), {
        title,
        image,
        description,
        category,
        authorId,
        authorDisplayName,
        published: new Date().getTime(),
      });
    } catch (e) {}
  }

  static async deletePost(id) {
    try {
      await deleteDoc(doc(this._db, 'posts', id));
    } catch (e) {}
  }
}
