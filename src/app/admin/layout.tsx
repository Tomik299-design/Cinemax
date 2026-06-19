import Link from "next/link";
import { Film, LayoutDashboard, Tag, FileText, BarChart3, LogOut, Settings } from "lucide-react";
import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/movies", icon: Film, label: "Movies" },
  { href: "/admin/categories", icon: Tag, label: "Categories" },
  { href: "/admin/logs", icon: FileText, label: "Logs" },
  { href: "/admin/stats", icon: BarChart3, label: "Statistics" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") redirect("/");

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 glass-dark border-r border-border flex flex-col fixed inset-y-0 left-0 z-40">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center neon-glow">
              <Film size={16} />
            </div>
            <span className="font-bold tracking-wider">
              CINE<span className="text-accent">MAX</span>
            </span>
          </Link>
          <p className="text-xs text-muted mt-1 ml-10">Admin Panel</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-surface-2 transition-all group"
            >
              <Icon size={18} className="group-hover:text-accent transition-colors" />
              <span className="text-sm font-medium">{label}</span>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center text-accent text-sm font-bold">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{session.user?.name}</p>
              <p className="text-xs text-muted truncate">{session.user?.email}</p>
            </div>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-gray-400 hover:text-red-400 hover:bg-surface-2 transition-all text-sm"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
}
