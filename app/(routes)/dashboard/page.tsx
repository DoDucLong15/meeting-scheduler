"use client";
import { app } from "@/config/FirebaseConfig";
import { LogoutLink, useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import MeetingType from "./meeting-type/page";

function Dashboard() {
  const db = getFirestore(app);
  const {user} = useKindeBrowserClient(); 
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    user && isBusinessRegistered();
  }, [user]);

  const isBusinessRegistered = async () => {
    const docRef = doc(db, "Business", user.email);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
    } else {
      console.log("No such document!");
      router.replace('/create-business');
    }
    setLoading(false);
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <MeetingType />
    </div>
    
  )
}
export default Dashboard;