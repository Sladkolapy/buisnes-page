import { SectionSettings } from "@/core/shared/section-types";

interface Props { settings: SectionSettings }

export function HeroSection({ settings }: Props) {
  const hasBg = Boolean(settings.bgImageUrl);

  return (
    <div
      className="relative flex min-h-[320px] items-center justify-center overflow-hidden"
      style={{
        backgroundColor: settings.bgColor ?? "#7c3aed",
        backgroundImage: hasBg ? `url(${settings.bgImageUrl})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {hasBg && <div className="absolute inset-0 bg-black/40" />}
      <div className="relative z-10 mx-auto max-w-3xl px-6 py-16 text-center">
        {settings.title && (
          <h1 className="text-4xl font-bold leading-tight md:text-5xl" style={{ color: settings.textColor ?? "#ffffff" }}>
            {settings.title}
          </h1>
        )}
        {settings.subtitle && (
          <p className="mt-4 text-lg md:text-xl" style={{ color: `${settings.textColor ?? "#ffffff"}cc` }}>
            {settings.subtitle}
          </p>
        )}
        {settings.buttonText && (
          <a
            href={settings.buttonUrl ?? "#"}
            className="mt-8 inline-block rounded-full bg-white px-8 py-3 text-sm font-semibold shadow-lg transition hover:shadow-xl"
            style={{ color: settings.bgColor ?? "#7c3aed" }}
          >
            {settings.buttonText}
          </a>
        )}
      </div>
    </div>
  );
}
