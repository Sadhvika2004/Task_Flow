import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, List, PlayCircle, BarChart3, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Home" },
  { to: "/board", icon: LayoutDashboard, label: "Board" },
  { to: "/backlog", icon: List, label: "Backlog" },
  { to: "/sprint", icon: PlayCircle, label: "Active Sprint" },
  { to: "/reports", icon: BarChart3, label: "Reports" },
];

export function Navigation() {
  return (
    <nav className="flex items-center gap-1 p-2 border-b border-border/50">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              "hover:bg-accent hover:text-accent-foreground",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground"
            )
          }
          end={item.to === "/"}
        >
          <item.icon className="h-4 w-4" />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}