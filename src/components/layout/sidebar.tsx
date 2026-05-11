'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Home, Users, Kanban, Calendar, Building2, X } from 'lucide-react';
import { useSidebar } from './sidebar-provider';
import { Button } from '@/components/ui/button';
import { GridPattern } from '@/components/ui/grid-pattern';

const navItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/contacts', label: 'Contacts', icon: Users },
  { href: '/companies', label: 'Companies', icon: Building2 },
  { href: '/pipeline', label: 'Pipeline', icon: Kanban },
  { href: '/activities', label: 'Activities', icon: Calendar },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isOpen, close } = useSidebar();

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-40 flex h-full w-64 flex-col border-r overflow-hidden',
        'bg-sidebar text-sidebar-foreground border-sidebar-border',
        'transition-transform duration-300 ease-in-out',
        isOpen ? 'translate-x-0' : '-translate-x-full',
        'md:relative md:translate-x-0'
      )}
    >
      {/* Grid pattern background */}
      <GridPattern
        width={32}
        height={32}
        className="stroke-primary/[0.05] fill-primary/[0.02]"
        squares={[
          [0, 11], [3, 12], [6, 10], [2, 13],
          [5, 14], [1, 15], [4, 13], [7, 12],
          [0, 16], [3, 17], [6, 15], [2, 18],
          [5, 16], [7, 17], [1, 14], [4, 18],
        ]}
      />
      {/* Fade bottom */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-sidebar to-transparent" />

      {/* Logo */}
      <div className="relative flex items-center justify-between px-6 py-5">
        <div className="flex flex-1 items-center justify-center gap-2">
          <img src="/nexus-icon.svg" alt="Nexus" className="h-12 w-12" />
          <h1 className="text-2xl font-bold tracking-tight">Nexus</h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-8 w-8"
          onClick={close}
          aria-label="Close navigation"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="relative px-3 pb-2">
        <p className="px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
          Menu
        </p>
      </div>

      <nav className="relative flex-1 px-3 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={close}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="relative p-3 mt-auto">
        <div className="rounded-lg bg-sidebar-accent px-3 py-2.5 text-xs text-muted-foreground">
          NexusCRM v1.0
        </div>
      </div>
    </aside>
  );
}
