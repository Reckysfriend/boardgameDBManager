import { gameColors } from "./gameColors.js";

export default function SessionRow({ session }) {
  const { slug, game, label, result, date } = session;
  const { dot } = gameColors[slug];
  const resultColor = result === "Win" ? "text-win" : "text-loss";

  return (
    <li className="flex flex-wrap items-center gap-x-3 gap-y-1 py-3">
      <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${dot}`} aria-hidden="true" />
      <span className="font-medium">{game}</span>
      <span className="text-sm text-text/70">{label}</span>
      <span className={`ml-auto text-sm font-semibold ${resultColor}`}>{result}</span>
      <span className="w-24 text-right text-sm text-text/70">{date}</span>
    </li>
  );
}
