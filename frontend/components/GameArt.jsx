const shapes = {
  arkham: (
    <>
      <path d="M4 24c6-10 14-14 20-14s14 4 20 14c-6 10-14 14-20 14S10 34 4 24z" />
      <circle cx="24" cy="24" r="6" />
    </>
  ),
  marvel: <path d="M24 5l15 5v12c0 10-7 17-15 21C16 39 9 32 9 22V10z" />,
  arnak: <path d="M3 40L18 14l9 15 6-9 12 20z" />,
  lotr: (
    <>
      <circle cx="24" cy="30" r="12" />
      <path d="M18 14l6-8 6 8-6 6z" />
    </>
  ),
};

export default function GameArt({ slug }) {
  return (
    <svg
      viewBox="0 0 48 48"
      width="64"
      height="64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {shapes[slug]}
    </svg>
  );
}
