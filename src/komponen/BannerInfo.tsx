import type { ReactNode } from "react";
import { Ikon } from "./Ikon";

export function BannerInfo({ children }: { children: ReactNode }) {
  return (
    <div className="banner-info" role="status">
      <Ikon nama="info" ukuran={20} />
      <div>{children}</div>
    </div>
  );
}