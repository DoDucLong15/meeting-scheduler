"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Briefcase, Calendar, Clock, Plus, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Menu = {
  id: number;
  name: string;
  path: string;
  icon: any;
};

function SideNavBar() {
  const menu: Menu[] = [
    {
      id: 1,
      name: "Meeting Type",
      path: "/dashboard/meeting-type",
      icon: Briefcase,
    },
    {
      id: 2,
      name: "Scheduled Meeting",
      path: "/dashboard/scheduled-meeting",
      icon: Calendar,
    },
    {
      id: 3,
      name: "Availability",
      path: "/dashboard/avalability",
      icon: Clock,
    },
    {
      id: 4,
      name: "Settings",
      path: "/dashboard/settings",
      icon: Settings,
    },
  ];
  const path = usePathname();
  const [activePath, setActivePath] = useState<string>(path);

  useEffect(() => {
    path && setActivePath(path);
  }, [path]);

  return (
    <div className="p-5 py-14">
      <div className="flex justify-center">
        <Image src="/logo.svg" width={150} height={150} alt="Logo" />
      </div>
      <Link href='/create-meeting'>
        <Button className="flex gap-2 w-full rounded-full mt-7">
          <Plus /> Create
        </Button>
      </Link>

      <div className="mt-5 flex flex-col gap-5">
        {menu.map((item, index) => (
          <Link href={item.path} key={index}>
            <Button
              className={`w-full flex gap-2 justify-start hover:bg-blue-100 ${
                activePath === item.path && 'text-primary bg-blue-100'
              }`}
              variant="ghost"
            >
              <item.icon /> {item.name}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}
export default SideNavBar;
