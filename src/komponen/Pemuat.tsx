/** KOM-12 Pemuat — kerangka (skeleton), bukan layar kosong. */
type PemuatProps = {
  teks?: string;
};

export function Pemuat({ teks = "Memuat…" }: PemuatProps) {
  return (
    <div className="muat" aria-busy="true" aria-live="polite">
      <span className="muat-kerangka muat-kerangka-judul" />
      <span className="muat-kerangka muat-kerangka-lebar" />
      <span className="muat-kerangka muat-kerangka-lebar" />
      <p className="muat-teks">{teks}</p>
    </div>
  );
}