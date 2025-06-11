function Logo() {
  return (
    <div className="scroll-m-20 text-3xl font-semibold tracking-tight text-gray-800">
      CloudWallet <span className="text-blue-400">SOL</span>
    </div>
  );
}

const Navbar = () => {
  return (
    <nav className="w-full bg-cyan-100 shadow-md px-25 py-3 flex justify-between rounded-none">
      <Logo />
    </nav>
  );
};

export default Navbar;
