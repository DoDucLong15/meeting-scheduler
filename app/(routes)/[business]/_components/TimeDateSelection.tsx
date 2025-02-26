import { ScheduleType } from "@/app/_utils/types/schedule.type";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar"

function TimeDateSelection({date, handleDateChange, timeSlots, enabledTimeSlot, setSelectedTime, selectedTime, prevBooking}: {
  date: Date | undefined;
  handleDateChange: (date: Date) => void;
  timeSlots?: string[];
  enabledTimeSlot: boolean;
  setSelectedTime: (time: string) => void;
  selectedTime: string;
  prevBooking: ScheduleType[]
}) {
  const checkTimeSlot = (time: string) => {
    return prevBooking.filter((booking) => booking.selectedTime === time).length > 0;
  }
  return (
    <div>
      <div className="md:col-span-2 flex px-4">
          <div className="flex flex-col">
            <h2 className="font-bold text-lg">Select Date & Time</h2>
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => d && handleDateChange(d)}
              className="rounded-md border mt-5"
              disabled={(date) => date <= new Date()}
            />
          </div>
          <div
            className="flex flex-col w-full overflow-auto gap-4 p-5"
            style={{ maxHeight: "350px" }}
          >
            {timeSlots?.map((time, index) => (
              <Button
                key={index}
                className={`border-primary text-primary ${time === selectedTime ? "bg-primary text-white" : ""}`}
                variant="outline"
                disabled={!enabledTimeSlot || checkTimeSlot(time)}
                onClick={() => setSelectedTime(time)}
              >
                {time}
              </Button>
            ))}
          </div>
        </div>
    </div>
  )
}
export default TimeDateSelection