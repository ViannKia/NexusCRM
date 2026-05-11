import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/layout/sidebar';
import Header from '@/components/layout/header';
import MobileNav from '@/components/layout/mobile-nav';
import { SidebarProvider } from '@/components/layout/sidebar-provider';
import DashboardContent from '@/components/layout/dashboard-content';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return (
    <SidebarProvider>
      <div className="relative flex h-screen overflow-hidden bg-background">
        <Sidebar />
        <DashboardContent
          header={<Header user={profile} mobileNav={<MobileNav />} />}
        >
          {children}
        </DashboardContent>
      </div>
    </SidebarProvider>
  );
}
