import Image from 'next/image';

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
}

export default function HeroSection({ title, subtitle, backgroundImage = '/bg-kan.jpeg' }: HeroSectionProps) {
  return (
    <section className="relative min-h-[55vh] flex items-center justify-center">
      <div className="absolute inset-0">
        <Image
          src={backgroundImage}
          alt=""
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </div>
      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.3) 100%)',
      }} />
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-[200] tracking-[0.08em] text-white uppercase leading-tight drop-shadow-lg">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-5 text-white text-base md:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed font-light drop-shadow-md">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
