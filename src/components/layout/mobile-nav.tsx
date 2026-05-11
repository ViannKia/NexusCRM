'use client';

import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSidebar } from './sidebar-provider';

export default function MobileNav() {
  const { toggle } = useSidebar();

  return (
    <Button
      variant="outline"
      size="icon"
      className="md:hidden"
      onClick={toggle}
      aria-label="Toggle navigation menu"
    >
      <Menu className="h-5 w-5" />
    </Button>
  );
}
