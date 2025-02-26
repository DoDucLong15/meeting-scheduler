"use client"

import { collection, doc, getDoc, getDocs, getFirestore, query, where } from "firebase/firestore";
import MeetingTimeDateSelection from "../_components/MeetingTimeDateSelection";
import { app } from "@/config/FirebaseConfig";
import { use, useEffect, useState } from "react";
import { BusinessType } from "@/app/_utils/types/business.type";
import { MeetingEventItem } from "../../dashboard/meeting-type/_components/MeetingEventList";
import { toast } from "sonner";

interface SharedmeetingEventProps {
  business: string;
  meetingEventId: string;
}

function SharedmeetingEvent({params}: {
  params: Promise<SharedmeetingEventProps>;
}) {
  const db = getFirestore(app);
  const [businessInfo, setBusinessInfo] = useState<BusinessType>();
  const [eventInfo, setEventInfo] = useState<MeetingEventItem>();
  const [loading, setLoading] = useState<boolean>(false); 

  useEffect(() => {
    params.then((res) => {
      getMeetingBusinessAndEventDetails(res);
    });
  }, [params])

  const getMeetingBusinessAndEventDetails = async (resolveParams: SharedmeetingEventProps) => {
    setLoading(true);
    try {
      if(!resolveParams?.business || !resolveParams?.meetingEventId) return;
      const q = query(collection(db, 'Business'), where('businessName', '==', resolveParams?.business));
      const docSnap = await getDocs(q);
      docSnap.forEach((doc) => {
        setBusinessInfo(doc.data() as BusinessType);
      });

      const docRef = doc(db, 'MeetingEvent', resolveParams?.meetingEventId);
      const result = await getDoc(docRef);
      setEventInfo(result.data() as MeetingEventItem);
    } catch(error) {
      toast('Error fetching data');
    }
    setLoading(false)
  }

  if(loading) return <div>Loading...</div>

  return (
    <div>
      <MeetingTimeDateSelection eventInfo={eventInfo} businessInfo={businessInfo}/>
    </div>
  )
}
export default SharedmeetingEvent;