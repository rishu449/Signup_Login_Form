import React, { useEffect, useState } from "react";
import { auth, fireDB } from "../../FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";

function UserDashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = auth.currentUser;

    if (currentUser) {
      const userRef = doc(fireDB, "users", currentUser.uid);

      getDoc(userRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            console.log("❌ No such user!");
          }
        })
        .catch((error) => {
          console.error("❌ Error fetching user:", error);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      {loading ? (
        // Loader Overlay
        <div className="flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-emerald-700 font-semibold text-lg sm:text-xl">
            Loading user info...
          </p>
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md text-center">
          <h1 className="text-2xl font-bold text-green-800 mb-4">
            User Dashboard
          </h1>
          {userData ? (
            <>
              <p className="text-lg font-semibold">
                Welcome, {userData.name} 🎉
              </p>
              <p className="text-gray-700 mt-2">Username: {userData.username}</p>
              <p className="text-gray-700 mt-1">Email: {userData.email}</p>
              <p className="text-gray-700 mt-1">Phone: {userData.phone}</p>
            </>
          ) : (
            <p className="text-red-500">User data not found.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default UserDashboard;
