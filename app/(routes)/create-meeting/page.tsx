"use client";

import { useState } from "react";
import MeetingForm from "./_components/MeetingForm";
import PreviewMeeting from "./_components/PreviewMeeting";

export type MeetingFormType = {
  eventName?: string;
  duration: number;
  locationType?: string;
  locationUrl?: string;
  themeColor?: string;
}

function CreateMeeting() {
  const [formValue, setFormValue] = useState<MeetingFormType>();
  return (
    <div className="grid grid-cols-1 md:grid-cols-3">
      {/* Meeting form */}
      <div className="shadow-md border h-screen">
        <MeetingForm setFormValue={(v) => setFormValue(v)}/>
      </div>  

      {/* Preview */}
      <div className="col-span-2">
        <PreviewMeeting formValue={formValue}/>
      </div>
    </div>
  )
}
export default CreateMeeting;