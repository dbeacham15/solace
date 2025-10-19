import Image from "next/image";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center px-6 h-[60px] bg-primary">
      <Image
        src="/solace-logo-white.svg"
        alt="Solace"
        width={139}
        height={39}
        priority
      />
    </header>
  );
}
