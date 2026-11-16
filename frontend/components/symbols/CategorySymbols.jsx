function Icon({ children }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function PlayersIcon() {
  return (
    <Icon>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
    </Icon>
  );
}

export function ProgressIcon() {
  return (
    <Icon>
      <path d="M5 21V4" />
      <path d="M5 4h12l-2 4 2 4H5" />
    </Icon>
  );
}

export function RecordsIcon() {
  return (
    <Icon>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h10" />
    </Icon>
  );
}

export function ComponentsIcon() {
  return (
    <Icon>
      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" />
      <path d="M12 12l8-4.5M12 12L4 7.5M12 12v9" />
    </Icon>
  );
}

export function StatsIcon() {
  return (
    <Icon>
      <path d="M5 20v-8" />
      <path d="M12 20V5" />
      <path d="M19 20v-11" />
    </Icon>
  );
}
