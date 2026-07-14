import Image from 'next/image';

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
}

export default function HeroSection({ title, subtitle, backgroundImage = '/bg-kan.jpeg' }: HeroSectionProps) {
  return (
    <section className="relative min-h-[40vh] flex items-center justify-center">
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
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto py-16">
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-[200] tracking-[0.08em] text-white uppercase leading-tight drop-shadow-lg">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 text-white text-sm md:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed font-light drop-shadow-md">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
