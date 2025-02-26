import { Input } from "@/components/ui/input"

function UserFormInfo({setUserName, setUserEmail, setUserNote}: {
  setUserName: (name: string | undefined) => void;
  setUserEmail: (email: string | undefined) => void;
  setUserNote: (note: string | undefined) => void;
}) {
  return (
    <div className="p-4 px-8 flex flex-col gap-3">
      <h2 className="font-bold text-xl">Enter Detail</h2>
      <div>
        <h2>Name *</h2>
        <Input onChange={(e) => setUserName(e.target.value)}/>
      </div>
      <div>
        <h2>Email *</h2>
        <Input onChange={(e) => setUserEmail(e.target.value)}/>
      </div>
      <div>
        <h2>Share any Notes</h2>
        <Input onChange={(e) => setUserNote(e.target.value)}/>
      </div>
      <div>
        <h2 className="text-xs text-gray-400">By Proceeding, you confirm that you read and agree term and condition.</h2>
      </div>
    </div>
  )
}
export default UserFormInfo