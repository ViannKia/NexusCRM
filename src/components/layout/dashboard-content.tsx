'use client';

interface DashboardContentProps {
  header: React.ReactNode;
  children: React.ReactNode;
}

export default function DashboardContent({ header, children }: DashboardContentProps) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {header}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-background">
        {children}
      </main>
    </div>
  );
}
