"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { app } from "@/config/FirebaseConfig";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

function CreateBusiness() {
  const [businessName, setBusinessName] = useState<string>();
  const db = getFirestore(app);
  const {user} = useKindeBrowserClient();
  const router = useRouter();

  const onCreateBusiness = async () => {
    console.log(businessName);
    await setDoc(doc(db, 'Business', user.email), {
      businessName: businessName,
      email: user.email,
      userName: user.given_name + ' ' + user.family_name
    }).then((res) => {
      console.log('Document saved');
      toast('Business created successfully');
      router.replace('/dashboard');
    })
  };

  return (
    <div className="p-14 items-center flex flex-col gap-20 my-10">
      <Image src="/logo.svg" width={200} height={200} alt="Logo" />
      <div className="flex flex-col items-center gap-4 max-w-3xl">
        <h2 className="text-4xl font-bold">
          What should we call your Business?
        </h2>
        <p className="text-slate-500">
          You can always change this later from settings
        </p>
        <div className="w-full">
          <Label className="text-slate-400">Team Name</Label>
          <Input
            placeholder="Ex. ddlong07"
            className="mt-2"
            onChange={(event) => setBusinessName(event.target.value)}
          />
        </div>
        <Button
          disabled={!businessName}
          className="w-full"
          onClick={onCreateBusiness}
        >
          Create Business
        </Button>
      </div>
    </div>
  );
}
export default CreateBusiness;
