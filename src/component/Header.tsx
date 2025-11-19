import HeaderClient from "./HeaderClient";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
      <HeaderClient />
    </header>
  );
}
