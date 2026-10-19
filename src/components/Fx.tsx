// Scanlines + grão de filme. Só na abertura e no resultado: no quiz, a tela fica limpa.
export function Fx() {
  return (
    <>
      <div aria-hidden className="fixed inset-0 pointer-events-none z-50 scanlines-overlay opacity-25" />
      <div aria-hidden className="fixed -inset-[10%] pointer-events-none z-50 grain-overlay opacity-[0.05]" />
    </>
  );
}
