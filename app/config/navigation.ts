export type NavLink = {
  name: string;
  path: string;
  icon: string;
  badge?: string;
  roles?: Role[];
};

export type Role = "ADMIN" | "MODERATOR" | "STUDENT";

export const mainNavLinks: NavLink[] = [
  {
    name: "Dashboard",
    path: "/console",
    icon: "i-uil-dashboard",
    roles: ["ADMIN", "MODERATOR", "STUDENT"],
  },
  {
    name: "Students",
    path: "/console/students",
    icon: "i-uil-graduation-cap",
    roles: ["ADMIN", "MODERATOR"],
  },
  {
    name: "Moderators",
    path: "/console/moderators",
    icon: "i-uil-user-check",
    roles: ["ADMIN"],
  },
];

export const otherLinks: NavLink[] = [
  {
    name: "Lessons",
    path: "/console/lessons",
    icon: "i-uil-book-open",
    roles: ["ADMIN", "MODERATOR", "STUDENT"],
  },
  {
    name: "Quizzes",
    path: "/console/quizzes",
    icon: "i-uil-file-question",
    badge: "5",
    roles: ["ADMIN", "MODERATOR", "STUDENT"],
  },
  {
    name: "Products",
    path: "/console/products",
    icon: "i-uil-box",
    roles: ["ADMIN"],
  },
  {
    name: "Orders",
    path: "/console/orders",
    icon: "i-uil-shopping-cart",
    badge: "12",
    roles: ["ADMIN", "MODERATOR"],
  },
];

export const accountLinks: NavLink[] = [
  {
    name: "Settings",
    path: "/console/settings",
    icon: "i-uil-cog",
    roles: ["ADMIN", "STUDENT", "MODERATOR"],
  },
  {
    name: "Help",
    path: "/console/help",
    icon: "i-uil-life-ring",
    roles: ["ADMIN"],
  },
];
