const DURATION = 220
const STAGGER = 60
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'

export function replayAudienceSwap() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  document.querySelectorAll<HTMLElement>('[data-aud-swap]').forEach((el, index) => {
    el.animate(
      [
        { opacity: 0, transform: 'translateY(14px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ],
      { duration: DURATION, delay: index * STAGGER, easing: EASE, fill: 'backwards' },
    )
  })
}
