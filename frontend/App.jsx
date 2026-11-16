import { Routes, Route } from "react-router";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import History from "./pages/History.jsx";
import Stats from "./pages/Stats.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/history" element={<History />} />
        <Route path="/stats" element={<Stats />} />
      </Route>
    </Routes>
  );
}
