import type { ReactNode } from "react";

/** KOM-08 Kartu — wadah putih dengan garis tipis, satu topik per kartu. */
type KartuProps = {
  judul?: string;
  subjudul?: string;
  children: ReactNode;
  padat?: boolean;
};

export function Kartu({ judul, subjudul, children, padat = false }: KartuProps) {
  const kelas = padat ? "kartu kartu-padat" : "kartu";
  return (
    <section className={kelas}>
      {judul ? <h2 className="kartu-judul">{judul}</h2> : null}
      {subjudul ? <h3 className="kartu-subjudul">{subjudul}</h3> : null}
      {children}
    </section>
  );
}