import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { routes } from "@/constants/routes";
import { useAuth } from "@/context/AuthContext";
import { menus } from "@/config/sidebar-menu";
import { useRouter } from "next/router";
import { LoadingBackdrop } from "@/components/LoadingBackdrop";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import DialogConfirm from "@/components/DialogConfirm";

const appName = process.env.NEXT_PUBLIC_APP_NAME || "Next App"

export const isActivePath = (pathname: string, href: string) => {
  const strip = (s: string) => s.replace(/\/+$/, "");
  const p = strip(pathname) || "/"; // kalau kosong, berarti root "/"
  const h = strip(href) || "/";

  // kalau menu href root "/", cocok hanya kalau pathname juga root "/"
  if (h === "/") {
    return p === "/";
  }

  // selain itu, cocok persis atau prefix dengan batas segmen
  return p === h || p.startsWith(h + "/");
};


export function DashboardLayout({
  children,
  headerTitle,
}: {
  children: ReactNode;
  headerTitle?: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { loading, logout, user } = useAuth();
  const [confirmLogout, setConfirmLogout] = useState(false);

  // State for dark mode
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check localStorage for dark mode preference on initial load
    const darkModePreference = localStorage.getItem("darkMode");
    if (darkModePreference === "true") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const handleDarkModeToggle = () => {
    const newDarkModeStatus = !isDarkMode;
    setIsDarkMode(newDarkModeStatus);
    localStorage.setItem("darkMode", newDarkModeStatus.toString());

    if (newDarkModeStatus) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleLogout = () => {
    try {
      logout();
      router.push(routes.login);
    } catch {
      // Handle logout error
    }
  };

  if (!user) return null;

  if (loading) {
    return <LoadingBackdrop />;
  }

  return (
    <SidebarProvider>
      <div className={`flex h-screen w-screen ${isDarkMode ? "dark" : ""}`}>
        {/* Sidebar */}
        <Sidebar className="px-2">
          <SidebarHeader className="my-5">
            <div className="flex gap-4 items-center">
              <h2 className="font-bold text-2xl">{appName}</h2>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <div className="p-2 mx-2 rounded-xl flex items-center gap-3 bg-muted">
              {user && (
                <>
                  <Image src="/user.png" height={48} width={48} alt="user" />
                  <div>
                    <div className="font-medium text-foreground">{user.username}</div>
                  </div>
                </>
              )}
            </div>

            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="gap-2">
                  {menus.map((menu) => {
                    const Icon = menu.icon;
                    const isActive = isActivePath(pathname, menu.href);

                    return (
                      <SidebarMenuItem key={menu.href}>
                        <SidebarMenuButton asChild>
                          <Link
                            href={menu.href}
                            className={cn(
                              "flex items-center p-[10px] rounded-xl",
                              isActive
                                ? "bg-gray-200 text-black dark:bg-gray-800 dark:text-white"
                                : "text-gray-700 dark:text-gray-300"
                            )}
                          >
                            <Icon className="mr-2 h-4 w-4" />
                            {menu.label}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Button
                    onClick={() => setConfirmLogout(true)}
                    variant="ghost"
                    className={cn("flex items-center justify-between")}
                  >
                    Logout
                    <div>
                      <LogOut className="text-right h-4 w-4" />
                    </div>
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            <p className="text-xs text-muted-foreground text-center">© {new Date().getFullYear()} {appName}</p>
          </SidebarFooter>
        </Sidebar>

        {/* Main */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="h-14 border-b bg-background flex items-center px-4 lg:px-5">
            <SidebarTrigger />
            {headerTitle}
            <button onClick={handleDarkModeToggle} className="ml-4 text-gray-500 dark:text-gray-400">
              {isDarkMode ? "🌞" : "🌙"}
            </button>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-5">
            <div className="space-y-4 lg:space-y-5">{children}</div>
          </main>
        </div>
      </div>

      <DialogConfirm
        confirmLabel="Log out"
        dialogTitle="Confirm Log Out"
        message="Are you sure you want to log out?"
        variant="danger"
        openDialog={confirmLogout}
        loading={false}
        onOpenChangeDialog={() => setConfirmLogout(false)}
        handleConfirm={() => handleLogout()}
      />
    </SidebarProvider>
  );
}
