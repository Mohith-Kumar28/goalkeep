import type { DiagramId } from '@/content/design/blog'

const LABEL =
  'Two diagrams. Extraction: data moves from the field up to programme teams, leadership and funders, and nothing returns. Circulation: data moves between field teams, programme teams and leadership in both directions, and still reaches funders.'

function ExtractionCirculation() {
  return (
    <svg role="img" aria-label={LABEL} viewBox="0 0 720 266" className="dc-blog-diagram">
      <defs>
        <marker id="dc-blog-ah-c" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill="#9C452A" />
        </marker>
        <marker id="dc-blog-ah-g" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill="#176059" />
        </marker>
      </defs>
      <rect x="0" y="0" width="346" height="260" rx="14" fill="#FBEEE9" />
      <text x="22" y="34" fontSize="13" fontWeight="800" letterSpacing="1.2" fill="#9C452A">EXTRACTION</text>
      <g fontSize="14" fontWeight="700" fill="#14131A" textAnchor="middle">
        <rect x="103" y="202" width="140" height="36" rx="8" fill="#FFFFFF" /><text x="173" y="225">Field teams</text>
        <rect x="103" y="138" width="140" height="36" rx="8" fill="#FFFFFF" /><text x="173" y="161">Programme teams</text>
        <rect x="103" y="74" width="140" height="36" rx="8" fill="#FFFFFF" /><text x="173" y="97">Leadership</text>
        <rect x="246" y="22" width="84" height="36" rx="8" fill="#FFFFFF" /><text x="288" y="45">Funders</text>
      </g>
      <path d="M173 200 L173 178" stroke="#9C452A" strokeWidth="2.5" fill="none" markerEnd="url(#dc-blog-ah-c)" />
      <path d="M173 136 L173 114" stroke="#9C452A" strokeWidth="2.5" fill="none" markerEnd="url(#dc-blog-ah-c)" />
      <path d="M243 84 C 270 80, 286 72, 288 62" stroke="#9C452A" strokeWidth="2.5" fill="none" markerEnd="url(#dc-blog-ah-c)" />
      <text x="22" y="252" fontSize="12" fontWeight="700" fill="#9C452A">Nothing comes back</text>
      <rect x="374" y="0" width="346" height="260" rx="14" fill="#E7F2F0" />
      <text x="396" y="34" fontSize="13" fontWeight="800" letterSpacing="1.2" fill="#176059">CIRCULATION</text>
      <g fontSize="14" fontWeight="700" fill="#14131A" textAnchor="middle">
        <rect x="400" y="190" width="130" height="36" rx="8" fill="#FFFFFF" /><text x="465" y="213">Field teams</text>
        <rect x="566" y="190" width="136" height="36" rx="8" fill="#FFFFFF" /><text x="634" y="213">Programme teams</text>
        <rect x="483" y="92" width="130" height="36" rx="8" fill="#FFFFFF" /><text x="548" y="115">Leadership</text>
        <rect x="620" y="22" width="84" height="36" rx="8" fill="#FFFFFF" /><text x="662" y="45">Funders</text>
      </g>
      <path d="M533 203 L562 203" stroke="#176059" strokeWidth="2.5" fill="none" markerStart="url(#dc-blog-ah-g)" markerEnd="url(#dc-blog-ah-g)" />
      <path d="M478 188 L522 132" stroke="#176059" strokeWidth="2.5" fill="none" markerStart="url(#dc-blog-ah-g)" markerEnd="url(#dc-blog-ah-g)" />
      <path d="M620 188 L574 132" stroke="#176059" strokeWidth="2.5" fill="none" markerStart="url(#dc-blog-ah-g)" markerEnd="url(#dc-blog-ah-g)" />
      <path d="M613 100 C 640 92, 656 76, 660 62" stroke="#176059" strokeWidth="2.5" fill="none" markerEnd="url(#dc-blog-ah-g)" />
      <text x="396" y="252" fontSize="12" fontWeight="700" fill="#176059">Everyone gets something back</text>
    </svg>
  )
}

const diagrams: Record<DiagramId, () => React.JSX.Element> = {
  'extraction-circulation': ExtractionCirculation,
}

export function Diagram({ id }: { id: DiagramId }) {
  const Component = diagrams[id]
  return (
    <figure className="dc-blog-figure">
      <Component />
    </figure>
  )
}
