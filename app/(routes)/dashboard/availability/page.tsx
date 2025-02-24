"use client";

import DaysList from "@/app/_utils/DaysList";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { app } from "@/config/FirebaseConfig";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function Availability() {
  const [daysAvailable, setDaysAvailable] = useState<Record<string, boolean>>({});
  const [startTime, setStartTime] = useState<string>();
  const [endTime, setEndTime] = useState<string>();
  const {user} = useKindeBrowserClient();
  const db = getFirestore(app);

  useEffect(() => {
    user && getBusinessInfo();
  }, [user])

  const getBusinessInfo = async () => {
    const docRef = doc(db, "Business", user?.email);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setDaysAvailable(data?.daysAvailable);
      setStartTime(data?.startTime);
      setEndTime(data?.endTime);
    }
  }

  const onHandleChange = (item: { day: string }, value: boolean | string) => {
    setDaysAvailable({
      ...daysAvailable,
      [item.day]: value as boolean
    })
  };

  const handleSave = async () => {
    const docRef = doc(db, "Business", user?.email);
    updateDoc(docRef, {
      daysAvailable,
      startTime,
      endTime
    }).then((res) => {
      toast("Change Updated!");
    })
  }



  return (
    <div className="p-10">
      <h2 className="font-bold text-2xl">Availability</h2>
      <hr className="my-7"></hr>
      <div>
        <h2 className="font-bold">Availability Days</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 my-3">
          {DaysList.map((day, index) => (
            <div key={index}>
              <h2 className="flex gap-2 items-center">
                <Checkbox onCheckedChange={(e) => onHandleChange(day, e)} checked={daysAvailable[day.day] ?? false}/>
                {day.day}
              </h2>
            </div>
          ))}
        </div>

        <h2 className="font-bold mt-10">Availability Time</h2>
        <div className="flex gap-10">
          <div className="mt-3">
            <h2>Start Time</h2>
            <Input type="time" onChange={(event) => setStartTime(event.target.value)} defaultValue={startTime}/>
          </div>
          <div className="mt-3">
            <h2>End Time</h2>
            <Input type="time" onChange={(event) => setEndTime(event.target.value)} defaultValue={endTime}/>
          </div>
        </div>
      </div>

      <Button className="mt-10" onClick={handleSave}>Save</Button>
    </div>
  );
}
export default Availability;
