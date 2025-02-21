"use client";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs";

function Dashboard() {
  return (
    <div>
      Dashboard
      <LogoutLink>Logout</LogoutLink>
    </div>
    
  )
}
export default Dashboard;