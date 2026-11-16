import { Outlet } from "react-router";
import TopBar from "./TopBar.jsx";

export default function Layout() {
  return (
    <>
      <TopBar />
      <main className="mx-auto max-w-content px-6 py-8">
        <Outlet />
      </main>
    </>
  );
}
