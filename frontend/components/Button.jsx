import { Link } from "react-router";

const style = "rounded-md bg-action px-4 py-2 text-sm font-semibold text-black hover:brightness-110";

export default function Button({ children, onClick, to }) {
  if (to) {
    return (
      <Link to={to} className={`inline-block ${style}`}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={style}>
      {children}
    </button>
  );
}
