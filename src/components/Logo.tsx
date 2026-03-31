import { Sparkles } from 'lucide-react';

export default function Logo({ size = "md", showText = true }: { size?: "sm" | "md" | "lg", showText?: boolean }) {
  const sizeClasses = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-12 h-12"
  };

  const iconClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-7 h-7"
  };

  const textClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-3xl"
  };

  return (
    <div className="flex items-center gap-3 group select-none">
      <div className={`${sizeClasses[size]} bg-brand-orange rounded-[1.25rem] flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.4)] relative overflow-hidden`}>
        {/* Subtle Inner Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
        <Sparkles className={`${iconClasses[size]} text-white drop-shadow-sm`} />
      </div>
      {showText && (
        <span className={`${textClasses[size]} font-black text-white tracking-tighter`}>
          Ansk<span className="text-brand-orange">riptor</span>
        </span>
      )}
    </div>
  );
}
