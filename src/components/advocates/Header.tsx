export function Header() {
  return (
    <header className="h-[60px] flex items-center flex-shrink-0" style={{ backgroundColor: '#265b4e' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/solace-logo-white.svg"
          alt="Solace Health"
          className="h-7"
        />
      </div>
    </header>
  );
}
