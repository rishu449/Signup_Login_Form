import React, { useEffect, useState } from "react";
import { auth, fireDB } from "../../FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";

function UserDashboard() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // get currently logged-in user
    const currentUser = auth.currentUser;

    if (currentUser) {
      const userRef = doc(fireDB, "users", currentUser.uid);

      getDoc(userRef).then((docSnap) => {
        if (docSnap.exists()) {
          setUserData(docSnap.data()); // save user data in state
        } else {
          console.log("❌ No such user!");
        }
      });
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-green-800 mb-4">User Dashboard</h1>
        {userData ? (
          <>
            <p className="text-lg font-semibold">Welcome, {userData.name} 🎉</p>
            <p className="text-gray-700 mt-2">Username: {userData.username}</p>
            <p className="text-gray-700 mt-1">Email: {userData.email}</p>
            <p className="text-gray-700 mt-1">Phone: {userData.phone}</p>
          </>
        ) : (
          <p>Loading user info...</p>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;
