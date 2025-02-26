import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

function Confirmation() {
  return (
    <div className="flex flex-col items-center justify-center p-20 gap-2">
      <CheckCircle className="h-9 w-9 text-green-500" />
      <h2 className="text-3xl font-bold">Your meeting has been scheduled</h2>
      <p className="text-gray-500 text-lg">You will receive an email confirmation shortly</p>
      <Link href={'/'}><Button>Thank you</Button></Link>
    </div>
  )
}
export default Confirmation