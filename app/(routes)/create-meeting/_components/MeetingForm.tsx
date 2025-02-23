"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LocationOptions } from "@/app/_utils/LocationOption";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import ThemeOptions from "@/app/_utils/ThemeOptions";
import { MeetingFormType } from "../page";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { app } from "@/config/FirebaseConfig";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function MeetingForm({ setFormValue }: { setFormValue: (value: MeetingFormType) => void }) {
  const [themeColor, setThemeColor] = useState<string>();
  const [eventName, setEventName] = useState<string>();
  const [duration, setDuration] = useState<number>(30);
  const [locationType, setLocationType] = useState<string>();
  const [locationUrl, setLocationUrl] = useState<string>();
  const db = getFirestore(app);
  const {user} = useKindeBrowserClient();
  const router = useRouter();

  useEffect(() => {
    setFormValue({
      eventName: eventName,
      duration: duration,
      locationType: locationType,
      locationUrl: locationUrl,
      themeColor: themeColor
    })
  }, [eventName, duration, locationType, locationUrl, themeColor])

  const onCreateClick = async () => {
    if(!user || !user?.email) {
      toast('Please login to create a meeting event');
      return;
    }
    const id = Date.now().toString();
    await setDoc(doc(db, "MeetingEvent", id), {
      id: id,
      eventName: eventName,
      duration: duration,
      locationType: locationType,
      locationUrl: locationUrl,
      themeColor: themeColor,
      businessId: doc(db, 'Business', user?.email),
      createdBy: user?.email
    }).then((res) => {
      toast('New Meeting Event Created');
      router.replace('/dashboard/meeting-type');
    })
  }

  return (
    <div className="p-8">
      <Link href="/dashboard">
        <h2 className="flex gap-2">
          <ChevronLeft /> Cancel
        </h2>
      </Link>
      <div className="mt-4">
        <h2 className="font-bold text-2xl my-4">Create New Event</h2>
        <hr></hr>
      </div>
      <div className="flex flex-col gap-3 my-4">
        <h2 className="font-bold">Event Name *</h2>
        <Input
          placeholder="Name of your meeting event"
          onChange={(event) => setEventName(event.target.value)}
        />

        <h2 className="font-bold">Duration *</h2>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="max-w-40">
              {duration} Min
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem className="cursor-pointer" onClick={() => setDuration(15)}>15 Min</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => setDuration(30)}>30 Min</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => setDuration(45)}>45 Min</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => setDuration(60)}>60 Min</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <h2 className="font-bold">Location *</h2>
        <div className="grid grid-cols-4 gap-3">
          {LocationOptions.map((option, index) => (
            <div
              className={`border flex flex-col justify-center items-center p-3 rounded-lg hover:bg-blue-100 hover:border-primary cursor-pointer
                ${locationType === option.name && "bg-blue-100 border-primary"}`}
              onClick={() => setLocationType(option.name)}
              key={index}
            >
              <Image
                src={option.icon}
                width={30}
                height={30}
                alt={option.name}
              />
              <h2>{option.name}</h2>
            </div>
          ))}
        </div>
        {locationType && (
          <div>
            <h2 className="font-bold">Add {locationType} Url *</h2>
            <Input placeholder="Add Url" onChange={(event) => setLocationUrl(event.target.value)}/>
          </div>
        )}
        <h2 className="font-bold">Select Theme Color</h2>
        <div className="flex justify-evenly">
          {ThemeOptions.map((color, index) => (
            <div
              className={`h-7 w-7 rounded-full cursor-pointer ${
                color === themeColor && "border-4 border-black"
              }`}
              key={index}
              style={{ backgroundColor: color }}
              onClick={() => setThemeColor(color)}
            ></div>
          ))}
        </div>
      </div>

      <Button
        className="w-full mt-9"
        disabled={!(eventName && duration && locationType && locationUrl)}
        onClick={onCreateClick}
      >
        Create
      </Button>
    </div>
  );
}
export default MeetingForm;
