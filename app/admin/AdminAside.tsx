"use client";

import React from "react";
import Link from "next/link";
import {
  Package2,
  Home,
  Database,
  Bot,
  Settings,
  Folder,
  Film,
  LucideIcon,
  Bug,
  Info,
  GalleryHorizontalEnd,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePathname } from "next/navigation";

interface NavItem {
  icon: LucideIcon;
  label: string;
  href: string;
  route: string;
}

const AdminAside: React.FC = () => {
  const pathname = usePathname();
  const activeRoute = pathname.split("/").pop();

  const isActive = (route: string): boolean => {
    if (route === "admin" && activeRoute === "admin") return true;
    return activeRoute === route;
  };

  const navItems: NavItem[] = [
    { icon: Home, label: "Dashboard", href: "/admin", route: "admin" },
    {
      icon: Bug,
      label: "Crawler Manager",
      href: "/admin/crawler/manager",
      route: "crawlerManager",
    },
    {
      icon: Info,
      label: "Crawler Info",
      href: "/admin/crawler/info",
      route: "crawlerInfo",
    },
    {
      icon: Info,
      label: "Crawler Info2",
      href: "/admin/crawler-info",
      route: "crawlerInfo2",
    },
    {
      icon: Folder,
      label: "Resource Matching",
      href: "/admin/matching",
      route: "resourceMatching",
    },
    {
      icon: GalleryHorizontalEnd,
      label: "Media",
      href: "/admin/matching",
      route: "resourceMatching",
    },
    {
      icon: Film,
      label: "Movies Manager",
      href: "/admin/moviesManager",
      route: "moviesManager",
    },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-4">
        <Link
          href="#"
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
          <Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
          <span className="sr-only">Acme Inc</span>
        </Link>
        <TooltipProvider>
          {navItems.map(({ icon: Icon, label, href, route }) => (
            <Tooltip key={label}>
              <TooltipTrigger asChild>
                <Link
                  href={href}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8 ${
                    isActive(route)
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="sr-only">{label}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{label}</TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </nav>
    </aside>
  );
};

export default AdminAside;
