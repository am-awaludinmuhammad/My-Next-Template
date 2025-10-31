import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { routes } from "@/constants/routes"
import { APP_NAME } from "@/lib/env"
import { FileText, FolderKanban, Info, LogOut, Search, ChevronDown, ChevronRight, Timer, Home } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { User } from "@/types/user"
import Image from "next/image"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog"
import { useState } from "react"
import { useRouter } from "next/router"
import { ScrollArea } from "./ui/scroll-area"
import { cn } from "@/lib/utils"

const items = [
  {
    title: "Home",
    url: routes.home,
    icon: Home,
  },
]

export const isActivePath = (pathname?: string, href?: string) => {
  const strip = (s: string) => (s ? s.replace(/\/+$/, "") : "");
  const p = strip(pathname ?? "") || "/";
  const h = strip(href ?? "") || "/";

  if (h === "/") {
    return p === "/";
  }

  return p === h || p.startsWith(h + "/");
};


export function AppSidebar({user, logout}: {user: User | null, logout: () => void}) {
  const pathname = usePathname()
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(true);
  const router = useRouter()

  const handleLogout = () => {
    try {
      logout();
      router.push(routes.login);
    } catch {
      // Handle logout error
    }
  };

  return (
    <Sidebar>
      <SidebarHeader className="my-3">
        <div className="flex gap-4 items-center mx-3">
          <h2 className="font-bold text-2xl">{APP_NAME}</h2>
        </div>
      </SidebarHeader>
      <SidebarContent className="mx-3">
        {user && (
          <div className="mb-3 p-2 mx-2 rounded-xl flex items-center gap-3 bg-blue-100">
            <Image src="/user.png" height={36} width={36} alt="user" />
            <div>
              <div className="font-medium text-black">{user.username}</div>
            </div>
          </div>
        )}
        
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {items.map((item) => {
                const isActive = isActivePath(pathname, item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="hover:bg-brand-700 hover:text-white">
                      <Link href={item.url} 
                        className={cn(
                          "flex items-center p-[10px] rounded-xl",
                          isActive &&
                          "bg-brand-500 text-white"
                        )}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => setConfirmLogout(true)}
              className="flex items-center justify-between cursor-pointer"
            >
              <div>Logout</div>
              <LogOut className="text-right h-4 w-4" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <p className="text-xs text-muted-foreground text-center">© {new Date().getFullYear()} {APP_NAME}</p>
      </SidebarFooter>

      <AlertDialog open={confirmLogout} onOpenChange={() => setConfirmLogout(false)}>
        <AlertDialogContent className="w-sm">
          <AlertDialogHeader>
            <AlertDialogDescription className="text-center text-base">
              <div className="space-y-4 text-center">
                <div className="flex items-center justify-center">
                  <Info height={36} width={36} className="text-destructive dark:text-destructive" />
                </div>
                <div className="text-gray-900 dark:text-white">Are you sure want to log out?</div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-3">
            <AlertDialogCancel className="flex-1">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}
              className="flex-1 bg-red-500 text-destructive-foreground hover:bg-destructive/90">
              Log out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Sidebar>
  )
}