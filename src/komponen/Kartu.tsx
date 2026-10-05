import type { ReactNode } from "react";

/** KOM-08 Kartu — wadah putih dengan garis tipis, satu topik per kartu. */
type KartuProps = {
  judul?: string;
  children: ReactNode;
  padat?: boolean;
};

export function Kartu({ judul, children, padat = false }: KartuProps) {
  const kelas = padat ? "kartu kartu-padat" : "kartu";
  return (
    <section className={kelas}>
      {judul ? <h2 className="kartu-judul">{judul}</h2> : null}
      {children}
    </section>
  );
}