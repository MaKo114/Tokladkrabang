import { Link, useLocation } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

interface NavLinkProps {
  to: string;
  icon: LucideIcon;
  label: string;
  variant?: "ghost" | "solid";
}

const NavLink = ({ to, icon: Icon, label, variant = "ghost" }: NavLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  if (variant === "solid") {
    return (
      <Link
        to={to}
        className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-black transition-all shadow-sm active:scale-95 ${
          isActive 
            ? "bg-[#FF5800] text-white shadow-orange-200" 
            : "bg-gray-900 text-white hover:bg-[#FF5800]"
        }`}
      >
        <Icon size={18} />
        <span>{label}</span>
      </Link>
    );
  }

  return (
    <Link
      to={to}
      className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all active:scale-95 ${
        isActive
          ? "bg-orange-50 text-[#FF5800]"
          : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
      }`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </Link>
  );
};

export default NavLink;