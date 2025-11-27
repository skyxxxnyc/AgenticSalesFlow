import React from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, Users, Zap, Database, Settings, Bell, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import ThemeToggle from "@/components/ThemeToggle";

const NavItem = ({ href, icon: Icon, label }: { href: string; icon: any; label: string }) => {
  const [location] = useLocation();
  const isActive = location === href;

  return (
    <Link href={href}>
      <div
        className={`
          flex items-center gap-3 px-4 py-3 cursor-pointer border-2 border-black dark:border-white transition-all
          ${isActive 
            ? "bg-secondary text-secondary-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]" 
            : "bg-sidebar hover:bg-primary hover:text-primary-foreground hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]"
          }
        `}
      >
        <Icon className="w-5 h-5" strokeWidth={2.5} />
        <span className="font-bold font-mono uppercase tracking-tight">{label}</span>
      </div>
    </Link>
  );
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  
  const getInitials = () => {
    if (!user) return "U";
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  const getDisplayName = () => {
    if (!user) return "User";
    if (user.firstName || user.lastName) {
      return `${user.firstName || ""} ${user.lastName || ""}`.trim();
    }
    return user.email || "User";
  };
  
  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-sidebar border-r-2 border-black dark:border-white flex flex-col h-screen sticky top-0 z-50">
        <div className="p-6 border-b-2 border-black dark:border-white bg-primary">
          <h1 className="text-2xl font-black uppercase tracking-tighter italic text-white">
            AutoSales<span className="text-black">.ai</span>
          </h1>
          <div className="text-xs font-mono mt-1 font-bold text-black bg-white inline-block px-1">
            V2.0.26 BETA
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <div className="text-xs font-bold uppercase text-muted-foreground mb-4 font-mono px-2">Command Center</div>
          <NavItem href="/" icon={LayoutDashboard} label="Dashboard" />
          <NavItem href="/agents" icon={Zap} label="Active Agents" />
          <NavItem href="/leads" icon={Users} label="Lead Pipeline" />
          <NavItem href="/campaigns" icon={Database} label="Campaigns" />
        </nav>

        <div className="p-4 border-t-2 border-black dark:border-white bg-accent/10">
          <NavItem href="/settings" icon={Settings} label="System Config" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-screen">
        <header className="h-16 border-b-2 border-black dark:border-white flex items-center justify-between px-6 bg-background sticky top-0 z-40">
          <div className="flex items-center gap-2">
             <div className="w-3 h-3 bg-green-500 border-2 border-black rounded-full animate-pulse"></div>
             <span className="font-mono text-sm font-bold uppercase">System Operational</span>
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button className="p-2 border-2 border-black hover:bg-accent hover:text-white transition-colors neo-shadow-hover">
              <Bell className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 border-2 border-black px-3 py-1 bg-white neo-shadow">
              {user?.profileImageUrl ? (
                <img 
                  src={user.profileImageUrl} 
                  alt={getDisplayName()} 
                  className="w-8 h-8 border-2 border-black object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-primary rounded-none border-2 border-black flex items-center justify-center font-bold text-white text-xs">
                  {getInitials()}
                </div>
              )}
              <span className="font-bold font-mono text-sm hidden sm:inline">{getDisplayName()}</span>
            </div>
            <a 
              href="/api/logout"
              className="p-2 border-2 border-black hover:bg-destructive hover:text-white transition-colors neo-shadow-hover"
              title="Logout"
              data-testid="button-logout"
            >
              <LogOut className="w-5 h-5" />
            </a>
          </div>
        </header>
        <div className="p-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
