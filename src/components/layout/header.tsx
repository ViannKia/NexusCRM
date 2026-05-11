'use client';

import { useState } from 'react';
import { logout } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ConfirmDialog from '@/components/ui/confirm-dialog';
import { GridPattern } from '@/components/ui/grid-pattern';
import { LogOut } from 'lucide-react';
import type { Profile } from '@/types/database';

interface HeaderProps {
  user: Profile | null;
  mobileNav?: React.ReactNode;
}

export default function Header({ user, mobileNav }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const initials = user?.full_name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
  };

  return (
    <header className="relative overflow-hidden border-b bg-card px-4 py-3 md:px-6">
      {/* Grid pattern background */}
      <GridPattern
        width={32}
        height={32}
        className="stroke-primary/[0.04] fill-primary/[0.01]"
        squares={[
          [1, 0], [4, 1], [7, 0], [10, 1],
          [13, 0], [16, 1], [19, 0], [22, 1],
          [3, 1], [6, 0], [9, 1], [12, 0],
          [15, 1], [18, 0], [21, 1], [24, 0],
          [0, 1], [5, 0], [8, 1], [11, 0],
          [14, 1], [17, 0], [20, 1], [23, 0],
        ]}
      />
      {/* Fade right */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-card to-transparent" />

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-3">
          {mobileNav}
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar_url || undefined} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:block">
              <p className="text-sm font-medium leading-none">{user?.full_name}</p>
              <p className="text-xs text-muted-foreground capitalize mt-0.5">{user?.role}</p>
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setOpen(true)}
          aria-label="Logout"
          className="gap-2"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Logout"
        description="Are you sure you want to logout?"
        confirmLabel="Logout"
        variant="default"
        loading={isLoggingOut}
        onConfirm={handleLogout}
      />
    </header>
  );
}
