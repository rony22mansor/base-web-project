import { AppSidebar } from "@/src/shared/components/app-sidebar";
import { AppTopbar } from "@/src/shared/components/app-topbar";
import {
  SidebarInset,
  SidebarProvider,
} from "@/src/shared/components/ui/sidebar";

/**
 * Persistent app shell: sidebar + content area.
 * Everything under the (app) route group renders inside this.
 */
export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="min-h-0">
        <AppTopbar />
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
