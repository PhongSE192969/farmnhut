import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import { firebaseAuth } from "@/config/firebase.config";
import { USE_MOCK_API } from "@/mocks/mockConfig";
import {
  createMockToken,
  findMockAccountByEmail,
  getMockUserFromToken,
  registerMockCustomer,
} from "@/mocks/mockServer";

let mockCurrentUser = null;

const createMockFirebaseUser = (user) => ({
  uid: user.id,
  email: user.email,
  displayName: user.fullName,
  phoneNumber: user.phone || null,
  photoURL: user.avatarUrl || null,
  emailVerified: true,
  getIdToken: async () => createMockToken(user.id),
  reload: async () => true,
});

/**
 * Register bằng Firebase Email/Password + gửi email verification.
 */
export const firebaseRegister = async ({ email, password, fullName }) => {
  try {
    if (USE_MOCK_API) {
      const user = registerMockCustomer({ email, password, fullName });
      const firebaseUser = createMockFirebaseUser(user);
      const idToken = createMockToken(user.id);
      mockCurrentUser = firebaseUser;

      return {
        firebaseUser,
        idToken,
      };
    }

    const credential = await createUserWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    );

    const firebaseUser = credential.user;

    if (fullName) {
      await updateProfile(firebaseUser, {
        displayName: fullName,
      });
    }

    await sendEmailVerification(firebaseUser);

    const idToken = await firebaseUser.getIdToken(true);

    return {
      firebaseUser,
      idToken,
    };
  } catch (error) {
    console.error("Firebase register error:", error);
    throw error;
  }
};

/**
 * Gửi lại email xác minh cho user hiện tại.
 */
export const resendFirebaseEmailVerification = async () => {
  try {
    if (USE_MOCK_API) {
      return true;
    }

    const currentUser = firebaseAuth.currentUser;

    if (!currentUser) {
      throw new Error("Không tìm thấy Firebase user hiện tại.");
    }

    await sendEmailVerification(currentUser);

    return true;
  } catch (error) {
    console.error("Resend Firebase email verification error:", error);
    throw error;
  }
};

/**
 * Login bằng Firebase Email/Password.
 */
export const firebaseLogin = async (email, password) => {
  try {
    if (USE_MOCK_API) {
      const user = findMockAccountByEmail(email, password);

      if (!user) {
        const error = new Error("Invalid mock email or password.");
        error.code = "auth/invalid-credential";
        throw error;
      }

      const firebaseUser = createMockFirebaseUser(user);
      const idToken = createMockToken(user.id);
      mockCurrentUser = firebaseUser;

      return {
        firebaseUser,
        idToken,
      };
    }

    const credential = await signInWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    );

    const firebaseUser = credential.user;
    const idToken = await firebaseUser.getIdToken(true);

    return {
      firebaseUser,
      idToken,
    };
  } catch (error) {
    console.error("Firebase login error:", error);
    throw error;
  }
};

/**
 * Forgot password bằng Firebase.
 * Firebase sẽ gửi link đặt lại mật khẩu về email.
 */
export const firebaseForgotPassword = async (email) => {
  try {
    if (USE_MOCK_API) {
      return true;
    }

    await sendPasswordResetEmail(firebaseAuth, email);
    return true;
  } catch (error) {
    console.error("Firebase forgot password error:", error);
    throw error;
  }
};

/**
 * Logout Firebase.
 */
export const firebaseLogout = async () => {
  try {
    if (USE_MOCK_API) {
      mockCurrentUser = null;
      return true;
    }

    await signOut(firebaseAuth);
    return true;
  } catch (error) {
    console.error("Firebase logout error:", error);
    throw error;
  }
};

/**
 * Lắng nghe trạng thái login Firebase.
 */
export const listenFirebaseAuthState = (callback) => {
  if (USE_MOCK_API) {
    callback(mockCurrentUser);
    return () => {};
  }

  return onAuthStateChanged(firebaseAuth, callback);
};

/**
 * Lấy token mới từ user hiện tại.
 */
export const getCurrentFirebaseToken = async (forceRefresh = true) => {
  if (USE_MOCK_API) {
    if (mockCurrentUser) {
      return mockCurrentUser.getIdToken(forceRefresh);
    }

    const user = getMockUserFromToken(createMockToken("user-customer-01"));
    return user ? createMockToken(user.id) : null;
  }

  const currentUser = firebaseAuth.currentUser;

  if (!currentUser) {
    return null;
  }

  return await currentUser.getIdToken(forceRefresh);
};
