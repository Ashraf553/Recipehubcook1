/**
 * Soft, static warm glows behind the content — terracotta and gold at low
 * opacity, to give the cream paper some depth.
 *
 * Deliberately NOT animated: moving large blurred layers forces the browser to
 * re-rasterise the blur every frame, which is very expensive once translucent
 * (backdrop-filter) chrome sits on top of it. Static glows look the same and
 * cost nothing after first paint.
 */
export function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div
        className="absolute -left-40 -top-32 h-[28rem] w-[28rem] rounded-full opacity-[0.16] blur-[100px]"
        style={{ background: 'var(--color-accent)' }}
      />
      <div
        className="absolute right-[-12%] top-1/4 h-96 w-96 rounded-full opacity-[0.14] blur-[100px]"
        style={{ background: 'var(--color-gold)' }}
      />
      <div
        className="absolute bottom-[-18%] left-1/3 h-[26rem] w-[26rem] rounded-full opacity-[0.10] blur-[110px]"
        style={{ background: 'var(--color-accent-desserts)' }}
      />
    </div>
  );
}
