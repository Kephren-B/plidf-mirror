/**
 * Logotype « Le Plan Île-de-France » — version moderne.
 *
 * Pictogramme : un arc de ligne (réseau) qui se termine par un point
 * (station), dans l'esprit des schémas de transport. Le point d'accent
 * ambre évoque les codes couleur des lignes du réseau.
 */
export default function Logo({ size = 34 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      role="img"
      aria-hidden="true"
      focusable="false"
    >
      {/* fond : pastille arrondie teal profond */}
      <rect x="1" y="1" width="38" height="38" rx="11" fill="#0f6f66" />
      {/* arc de ligne (blanc) */}
      <path
        d="M9 30 C 12 16, 22 12, 31 13"
        fill="none"
        stroke="#ffffff"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      {/* point de départ */}
      <circle cx="9" cy="30" r="3" fill="#86c9bf" />
      {/* station d'arrivée (accent ambre) */}
      <circle cx="31" cy="13" r="4" fill="#f2b23c" />
      <circle cx="31" cy="13" r="1.6" fill="#0f6f66" />
    </svg>
  );
}
