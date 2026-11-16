import { NavLink } from "react-router";

function linkClass({ isActive }) {
  return isActive ? "font-semibold text-action" : "text-text/70 hover:text-text";
}

export default function TopBar() {
  return (
    <header className="border-b border-white/10 bg-card">
      <nav className="mx-auto flex max-w-content items-center gap-6 px-6 py-4">
        <NavLink to="/" end className={linkClass}>
          Home
        </NavLink>
        <NavLink to="/history" className={linkClass}>
          History
        </NavLink>
        <NavLink to="/stats" className={linkClass}>
          Stats
        </NavLink>
      </nav>
    </header>
  );
}
