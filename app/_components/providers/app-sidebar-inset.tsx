import { auth } from "@clerk/nextjs/server";
import Navbar from "../navbar";
import { SidebarInset } from "../ui/sidebar";

export function AppSidebarInset({ children }: { children: React.ReactNode }) {
  const { userId } = auth();

  return (
    <SidebarInset>
      {userId && <Navbar />} {children}
    </SidebarInset>
  );
}
