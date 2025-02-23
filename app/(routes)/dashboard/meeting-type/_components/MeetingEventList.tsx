"use client";

import { Button } from "@/components/ui/button";
import { app } from "@/config/FirebaseConfig";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { Clock, Copy, MapPin, Pen, Settings, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type MeetingEventItem = {
  businessId: string | any;
  createdBy: string;
  duration: number;
  eventName: string;
  id: string;
  locationType: string;
  locationUrl: string;
  themeColor: string;
};

function MeetingEventList() {
  const db = getFirestore(app);
  const { user } = useKindeBrowserClient();
  const [eventList, setEventList] = useState<MeetingEventItem[]>([]);

  useEffect(() => {
    user && getEventList();
  }, [user]);

  const onDeleteMeetingEvent = async (event: MeetingEventItem) => {
    await deleteDoc(doc(db, "MeetingEvent", event.id))
      .then((res) => {
        toast("Meeting Event Deleted!");
        getEventList();
      });
  }

  const getEventList = async () => {
    const q = query(
      collection(db, "MeetingEvent"),
      where("createdBy", "==", user?.email)
      // orderBy('id', 'desc')
    );
    const querySnapshot = await getDocs(q);
    setEventList(
      querySnapshot.docs.map((doc) => doc.data() as MeetingEventItem)
    );
  };
  return (
    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
      {eventList.length > 0 ? (
        eventList
          ?.sort((e1, e2) => parseInt(e2.id) - parseInt(e1.id))
          .map((event, index) => (
            <div
              key={index}
              className="border shadow-md border-t-8 rounded-lg p-5 flex flex-col gap-5"
              style={{ borderTopColor: event?.themeColor }}
            >
              <div className="flex justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Settings className="cursor-pointer" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem className="flex gap-2 cursor-pointer">
                      <Pen />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex gap-2 cursor-pointer"
                      onClick={() => {onDeleteMeetingEvent(event)}}
                    >
                      <Trash />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <h2 className="font-bold text-2xl">{event.eventName}</h2>
              <div className="flex justify-between">
                <h2 className="flex gap-2 text-gray-500">
                  <Clock />
                  {event.duration} Min
                </h2>
                <h2 className="flex gap-2 text-gray-500">
                  <MapPin />
                  {event.locationType} Meeting
                </h2>
              </div>
              <hr></hr>
              <div className="flex justify-between">
                <h2
                  className="flex gap-2 text-sm items-center text-primary cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(event.locationUrl);
                    toast("Url copied on Clipboard");
                  }}
                >
                  <Copy className="h-4 w-4" />
                  Copy Link
                </h2>
                <Button
                  variant="outline"
                  className="border-primary rounded-full text-primary"
                >
                  Share
                </Button>
              </div>
            </div>
          ))
      ) : (
        <h2>Loading...</h2>
      )}
    </div>
  );
}
export default MeetingEventList;
