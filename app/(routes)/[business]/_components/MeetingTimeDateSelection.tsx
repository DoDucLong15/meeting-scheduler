"use client";

import { useEffect, useState } from "react";
import { MeetingEventItem } from "../../dashboard/meeting-type/_components/MeetingEventList";
import Link from "next/link";
import { CalendarCheck, Clock, MapPin, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Calendar } from "@/components/ui/calendar";
import { BusinessType } from "@/app/_utils/types/business.type";
import { format } from "date-fns";
import TimeDateSelection from "./TimeDateSelection";
import UserFormInfo from "./UserFormInfo";
import { toast } from "sonner";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { app } from "@/config/FirebaseConfig";
import { ScheduleType } from "@/app/_utils/types/schedule.type";
import Plunk from "@plunk/node";
import { render } from "@react-email/components";
import Email from "@/emails";
import { useRouter } from "next/navigation";

function MeetingTimeDateSelection({
  eventInfo,
  businessInfo,
}: {
  eventInfo?: MeetingEventItem;
  businessInfo?: BusinessType;
}) {
  const [date, setDate] = useState<Date>(new Date());
  const [timeSlots, setTimeSlots] = useState<string[]>();
  const [enabledTimeSlot, setEnabledTimeSlot] = useState<boolean>(false);
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const [step, setStep] = useState<number>(1);
  const [userName, setUserName] = useState<string | undefined>();
  const [userEmail, setUserEmail] = useState<string | undefined>();
  const [userNote, setUserNote] = useState<string | undefined>();
  const [prevBusinessBooking, setPrevBusinessBooking] = useState<
    ScheduleType[]
  >([]);
  const db = getFirestore(app);
  const plunk = new Plunk(process.env.NEXT_PUBLIC_PLUNK_API_KEY ?? "");
  const router = useRouter();

  useEffect(() => {
    eventInfo?.duration && createTimeslot(eventInfo?.duration);
  }, [eventInfo]);

  const handleDateChange = (date: Date) => {
    setDate(date);
    const day = date ? format(date, "EEEE") : "";
    if (businessInfo?.daysAvailable && businessInfo?.daysAvailable[day]) {
      getPrevEventBooking(date);
      setEnabledTimeSlot(true);
    } else {
      setEnabledTimeSlot(false);
      setSelectedTime(undefined);
    }
  };

  const handleScheduleEvent = async () => {
    if (userEmail) {
      const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!regex.test(userEmail)) {
        toast.error("Enter valid email address");
        return;
      }
      const docId = Date.now().toString();
      await setDoc(doc(db, "ScheduledMeetings", docId), {
        businessName: businessInfo?.businessName,
        businessEmail: businessInfo?.email,
        selectedTime: selectedTime,
        selectedDate: date,
        formattedDate: format(date, "PPP"),
        formattedTimestamp: format(date, "t"),
        duration: eventInfo?.duration,
        locationUrl: eventInfo?.locationUrl,
        eventId: eventInfo?.id,
        id: docId,
        userEmail: userEmail,
        userName: userName,
        userNote: userNote ?? "",
      }).then((res) => {
        toast("Meeting Scheduled successfully!");
        sendEmail();
      });
    }
  };

  const createTimeslot = (interval: number) => {
    const startTime = 8 * 60;
    const endTime = 22 * 60;
    const totalSlots = (endTime - startTime) / interval;
    const slots = Array.from({ length: totalSlots }, (_, i) => {
      const totalMinutes = startTime + i * interval;
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      const formattedHours = hours > 12 ? hours - 12 : hours;
      const period = hours >= 12 ? "PM" : "AM";
      return `${String(formattedHours).padStart(2, "0")}:${String(
        minutes
      ).padStart(2, "0")} ${period}`;
    });
    setTimeSlots(slots);
  };

  const sendEmail = async () => {
    const emailHtml = await render(
      <Email
        userFirstName={businessInfo?.businessName}
        loginDate={date}
        loginDevice={eventInfo?.duration.toString()}
        loginLocation={eventInfo?.locationType}
        loginIp={selectedTime ?? ""}
      />
    );

    userEmail && plunk.emails.send({
      to: userEmail,
      subject: "Meeting Scheduled Details",
      body: emailHtml,
    }).then((res) => {
      router.replace('/confirmation');
    });
  };

  /**
   * Used to Fetch Previous Booking for the same event
   * @param _date
   */

  const getPrevEventBooking = async (_date: Date) => {
    const q = query(
      collection(db, "ScheduledMeetings"),
      where("selectedDate", "==", _date),
      where("eventId", "==", eventInfo?.id)
    );
    const docSnap = await getDocs(q);
    docSnap.forEach((doc) => {
      setPrevBusinessBooking((prev) => [...prev, doc.data() as ScheduleType]);
    });
  };

  return (
    <div
      className="p-5 py-10 shadow-lg m-5 border-t-8 mx-10 md:mx-26 lg:mx-56 my-10"
      style={{ borderColor: eventInfo?.themeColor }}
    >
      <Image src={"/logo.svg"} alt="logo" width={150} height={150} />
      <div className="grid grid-cols-1 md:grid-cols-3 mt-5">
        {/* Meeting Info */}
        <div className="p-4 border-r">
          <h2>{businessInfo?.businessName}</h2>
          <h2 className="font-bold text-2xl">
            {eventInfo?.eventName ?? "Meeting Name"}
          </h2>
          <div className="mt-5 flex flex-col gap-4">
            <h2 className="flex gap-2">
              <Clock />
              {eventInfo?.duration} Min
            </h2>
            <h2 className="flex gap-2">
              <MapPin />
              {eventInfo?.locationType} Meeting
            </h2>
            <h2 className="flex gap-2">
              <CalendarCheck />
              {format(date, "EEEE, MMMM do, yyyy")}
            </h2>
            {selectedTime && (
              <h2 className="flex gap-2">
                <Timer />
                {selectedTime}
              </h2>
            )}
            <Link href={eventInfo?.locationUrl ?? "#"} className="text-primary">
              {eventInfo?.locationUrl}
            </Link>
          </div>
        </div>

        {step === 1 ? (
          <TimeDateSelection
            date={date}
            handleDateChange={handleDateChange}
            timeSlots={timeSlots}
            enabledTimeSlot={enabledTimeSlot}
            setSelectedTime={setSelectedTime}
            selectedTime={selectedTime ?? ""}
            prevBooking={prevBusinessBooking}
          />
        ) : (
          <UserFormInfo
            setUserName={setUserName}
            setUserEmail={setUserEmail}
            setUserNote={setUserNote}
          />
        )}
      </div>
      <div className="flex gap-3 justify-end">
        {step === 2 && (
          <Button variant="outline" onClick={() => setStep(step - 1)}>
            Back
          </Button>
        )}
        {step === 1 ? (
          <Button
            className="mt-10 float-right"
            disabled={!selectedTime || !date}
            onClick={() => setStep(step + 1)}
          >
            Next
          </Button>
        ) : (
          <Button
            disabled={!userEmail || !userName}
            onClick={handleScheduleEvent}
          >
            Schedule
          </Button>
        )}
      </div>
    </div>
  );
}
export default MeetingTimeDateSelection;
