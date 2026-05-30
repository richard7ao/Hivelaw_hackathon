import { DemoProvider } from "@/lib/demo-context";
import Nav from "@/components/Nav";

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <DemoProvider>
      <Nav />
      <main className="min-h-dvh pt-16">{children}</main>
    </DemoProvider>
  );
}
