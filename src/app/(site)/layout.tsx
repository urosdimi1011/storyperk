import { SiteFooter } from "@/components/site/footer";

/** Javni sajt u dizajn sistemu K (landing, pravne stranice). */
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="site min-h-dvh pt-3 md:pt-4">
      {children}
      <SiteFooter />
    </div>
  );
}
