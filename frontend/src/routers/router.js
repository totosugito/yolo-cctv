export const AppRoutes = {
  root: {
    name: "Root",
    to: "/",
    href: "/",
  },
  login: {
    name: "Login",
    to: "/login",
    href: "/login",
  },
  dashboard: {
    name: "Dashboard",
    to: "/dashboard",
    href: "/dashboard",
  },
  monitoring: {
    name: "Monitoring",
    to: "/monitoring",
    href: "/monitoring",
  },
  cctvHistory: {
    name: "CCTV History",
    to: "/cctv-history",
    href: "/cctv-history/:no",
  },
}
