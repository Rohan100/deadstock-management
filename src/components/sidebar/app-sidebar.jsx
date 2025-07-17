"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/sidebar/nav-main"
import { NavProjects } from "@/components/sidebar/nav-projects"
import { NavUser } from "@/components/sidebar/nav-user"
import { TeamSwitcher } from "@/components/sidebar/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "Admin User",
    email: "admin@college.edu",
    avatar: "/avatars/admin.jpg",
  },
  teams: [
    {
      name: "College Admin",
      logo: GalleryVerticalEnd,
      plan: "Premium",
    },
    {
      name: "Inventory Dept",
      logo: AudioWaveform,
      plan: "Standard",
    },
    {
      name: "Finance Dept",
      logo: Command,
      plan: "Basic",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: SquareTerminal,
      isActive: true,
      items: [
        // {
        //   title: "Overview",
        //   url: "/dashboard/overview",
        // },
        // {
        //   title: "Analytics",
        //   url: "/dashboard/analytics",
        // },
        {
          title: "Reports",
          url: "/dashboard/reports",
        },
      ],
    },
    {
      title: "Inventory Management",
      url: "/inventory",
      icon: Bot,
      items: [
        {
          title: "Purchase Items",
          url: "/inventory/purchase",
        },
        {
          title: "All Items",
          url: "/inventory/items",
        },
        {
          title: "Categories",
          url: "/inventory/categories",
        },
        // {
        //   title: "Stock Levels",
        //   url: "/inventory/stock",
        // },
        {
          title: "Transfer",
          url: "/deadstock/expired",
        },
        {
          title: "Suppliers",
          url: "/inventory/suppliers",
        },
      ],
    },
    // {
    //   title: "Deadstock Tracking",
    //   url: "/deadstock",
    //   icon: BookOpen,
    //   items: [
    //     {
    //       title: "Transform",
    //       url: "/deadstock/expired",
    //     },
    //     // {
    //     //   title: "Obsolete Equipment",
    //     //   url: "/deadstock/obsolete",
    //     // },
    //     // {
    //     //   title: "Damaged Goods",
    //     //   url: "/deadstock/damaged",
    //     // },
    //     // {
    //     //   title: "Write-offs",
    //     //   url: "/deadstock/writeoffs",
    //     // },
    //   ],
    // },
    {
      title: "Administration",
      url: "/admin",
      icon: Settings2,
      items: [
        {
          title: "User Management",
          url: "/admin/users",
        },
        {
          title: "Departments",
          url: "/admin/departments",
        },
        // {
        //   title: "Permissions",
        //   url: "/admin/permissions",
        // },
        // {
        //   title: "System Settings",
        //   url: "/admin/settings",
        // },
      ],
    },
  ],
  // projects: [
  //   {
  //     name: "Asset Disposal",
  //     url: "/projects/disposal",
  //     icon: Frame,
  //   },
  //   {
  //     name: "Cost Analysis", 
  //     url: "/projects/cost-analysis",
  //     icon: PieChart,
  //   },
  //   {
  //     name: "Audit Trail",
  //     url: "/projects/audit",
  //     icon: Map,
  //   },
  // ],
}

export function AppSidebar({
  ...props
}) {
  return (
    (<Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>)
  );
}
