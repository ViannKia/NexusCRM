import { GridPattern } from "@/components/ui/grid-pattern";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      {/* Grid pattern background */}
      <GridPattern
        width={40}
        height={40}
        className="stroke-primary/10 fill-primary/5"
        squares={[
          [2, 3], [5, 1], [8, 4], [11, 2], [14, 5],
          [3, 7], [6, 9], [9, 6], [12, 8], [15, 3],
          [1, 11], [4, 13], [7, 10], [10, 12], [13, 9],
          [2, 15], [5, 17], [8, 14], [11, 16], [14, 13],
        ]}
      />

      {/* Radial gradient overlay — fade ke tengah agar card tetap terbaca */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,transparent_30%,var(--background)_80%)]" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-2">
          <div className="flex h-16 w-16 items-center justify-center">
            <img src="/nexus-icon.svg" alt="NexusCRM" className="h-16 w-16" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">NexusCRM</h1>
          <p className="text-sm text-muted-foreground">Manage your customer relationships</p>
        </div>

        {children}
      </div>
    </div>
  );
}
