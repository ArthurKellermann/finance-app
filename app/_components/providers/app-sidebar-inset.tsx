import Navbar from "../navbar";
import { SidebarInset } from "../ui/sidebar";

export function AppSidebarInset({ children }: { children: React.ReactNode }) {
  return (
    <SidebarInset>
      <Navbar /> {children}
    </SidebarInset>
  );
}
