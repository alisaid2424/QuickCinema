import Header from "@/components/header";
import Footer from "@/components/Footer";

type Props = {
  children: React.ReactNode;
};

export default function SiteLayout({ children }: Props) {
  return (
    <div className="flex flex-col">
      <Header />
      <main className="flex-1 min-h-dvh">{children}</main>
      <Footer />
    </div>
  );
}
