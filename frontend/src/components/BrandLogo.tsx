import Image from 'next/image';

export default function BrandLogo() {
  return (
    <div className="flex justify-center mb-2 select-none">
      <Image
        src="/daka-test-logo.png"
        alt="DakaTest Logo"
        width={180}
        height={60}
        priority
        className="object-contain mix-blend-multiply hover:scale-105 transition-transform duration-200"
      />
    </div>
  );
}
