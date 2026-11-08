import React, { useState } from "react";

export const MITRA_ICON_IMAGE =
  "/assets/aistudio/5603103c-7e15-47cb-81f6-0008b38143eb_17c0740a.webp";
export const MITRA_FULL_LOGO_IMAGE =
  "/assets/aistudio/5603103c-7e15-47cb-81f6-0008b38143eb_17c0740a.webp";

export function MitraNetraLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      <div className="w-20 h-14 sm:w-24 sm:h-16 rounded-2xl overflow-hidden bg-white border-2 border-[#0D5C91]/20 shadow-xs shrink-0 flex items-center justify-center px-1">
        <img
          src={MITRA_ICON_IMAGE}
          alt="Logo Mitra NetraQu"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-[1.12] transform-gpu"
        />
      </div>
      <div className="text-left leading-tight">
        <div className="font-extrabold tracking-tight text-lg sm:text-2xl leading-none">
          <span className="text-[#0D5C91]">Mitra</span>{" "}
          <span className="text-[#4C9A2A]">NetraQu</span>
        </div>
        <div className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wide text-slate-900 leading-tight mt-1 whitespace-nowrap">
          JASA PIJAT TERAPIS DISABILITAS NETRA
        </div>
      </div>
    </div>
  );
}

export function MitraNetraFullLogo({ className = "w-full" }: { className?: string }) {
  return (
    <div
      className={`flex flex-col items-center justify-center mx-auto select-none text-center ${className}`}
    >
      <div className="w-60 h-24 sm:w-72 sm:h-28 overflow-hidden flex items-center justify-center mx-auto">
        <img
          src={MITRA_FULL_LOGO_IMAGE}
          alt="Logo Mitra NetraQu - Jasa Pijat Terapis Disabilitas Netra"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-[1.15] transform-gpu mx-auto"
        />
      </div>
      <div className="mt-1 leading-none">
        <div className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          <span className="text-[#0D5C91]">Mitra</span>{" "}
          <span className="text-[#4C9A2A]">NetraQu</span>
        </div>
        <div className="text-sm sm:text-base font-extrabold text-slate-950 uppercase tracking-wide leading-tight mt-2">
          <div>JASA PIJAT TERAPIS</div>
          <div>DISABILITAS NETRA</div>
        </div>
      </div>
    </div>
  );
}

function getFirstNameInitial(fullName: string): string {
  const cleaned = (fullName || "")
    .trim()
    .replace(/^(bpk\.?|bapak|ibu|bu\.?|sdr\.?|sdri\.?|tn\.?|ny\.?)\s+/i, "")
    .trim();
  const firstWord = (cleaned || fullName || "PL").trim().split(/\s+/)[0] || "PL";
  const twoChars = firstWord.slice(0, 2).toUpperCase();
  return twoChars || "PL";
}

export function UserAvatar({
  photoUri,
  name,
  size = "md"
}: {
  photoUri?: string;
  name: string;
  size?: "sm" | "md" | "lg";
}) {
  const [imgError, setImgError] = useState(false);

  const dimensions =
    size === "lg"
      ? "w-24 h-24 text-3xl"
      : size === "sm"
      ? "w-11 h-11 text-sm"
      : "w-14 h-14 text-lg";

  const hasCustomPhoto = Boolean(photoUri && photoUri.trim() && !imgError);
  const initialLetters = getFirstNameInitial(name);

  if (!hasCustomPhoto) {
    return (
      <div
        aria-label={`Avatar ${name}`}
        className={`${dimensions} rounded-full bg-[#0D5C91] text-white font-extrabold tracking-tight border-2 border-[#0D5C91] shadow-xs shrink-0 flex items-center justify-center select-none uppercase leading-none`}
      >
        {initialLetters}
      </div>
    );
  }

  return (
    <div
      className={`${dimensions} rounded-full overflow-hidden border-2 border-[#0D5C91] bg-[#0D5C91] shrink-0 flex items-center justify-center`}
    >
      <img
        src={photoUri}
        alt={name}
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
        className="w-full h-full object-cover object-center rounded-full"
      />
    </div>
  );
}

export function TherapyBackdropPattern() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none bg-white">
      <svg
        className="w-full h-full object-cover"
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="circleBlue" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0D5C91" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#0D5C91" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="circleGreen" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4C9A2A" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#4C9A2A" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="1440" height="900" fill="#FFFFFF" />
        <circle cx="200" cy="180" r="400" fill="url(#circleBlue)" />
        <circle cx="1240" cy="720" r="420" fill="url(#circleGreen)" />
        <path
          d="M-100 620 C 320 480, 680 780, 1100 580 C 1300 490, 1450 560, 1600 520"
          stroke="#0D5C91"
          strokeOpacity="0.14"
          strokeWidth="3"
        />
        <path
          d="M-100 680 C 360 540, 720 820, 1140 640 C 1320 550, 1460 610, 1600 580"
          stroke="#4C9A2A"
          strokeOpacity="0.14"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}
