import React, { useState } from "react";

export const MITRA_ICON_IMAGE =
  "/assets/aistudio/Gemini_Generated_Image__1__e30be246.jpeg";
export const MITRA_FULL_LOGO_IMAGE =
  "/assets/aistudio/Gemini_Generated_Image_d6aea58c.jpeg";

export function MitraNetraLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-3.5 select-none ${className}`}>
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-white border-2 border-[#0D5C91]/25 shadow-xs shrink-0 flex items-center justify-center relative">
        <img
          src={MITRA_ICON_IMAGE}
          alt="Icon Mitra NetraQu Palembang"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center origin-center translate-y-[14%] scale-[1.55] transform-gpu"
        />
      </div>
      <div className="text-left leading-tight">
        <div className="font-extrabold tracking-tight text-lg sm:text-xl text-[#0D5C91]">
          Mitra <span className="text-[#4C9A2A]">NetraQu</span>
        </div>
        <div className="text-xs font-semibold text-[#4C9A2A]">
          Terapis Pijat Tuna Netra Palembang
        </div>
      </div>
    </div>
  );
}

export function MitraNetraFullLogo({ className = "w-full" }: { className?: string }) {
  return (
    <div
      className={`overflow-hidden flex items-center justify-center mx-auto select-none ${className}`}
    >
      <img
        src={MITRA_FULL_LOGO_IMAGE}
        alt="Logo Mitra NetraQu - Jasa Pijat Terapis Tuna Netra"
        referrerPolicy="no-referrer"
        className="w-full h-auto object-contain object-center origin-center scale-[1.32] transform-gpu mx-auto"
      />
    </div>
  );
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
      ? "w-24 h-24 text-2xl"
      : size === "sm"
      ? "w-12 h-12 text-xs"
      : "w-16 h-16 text-base";

  const isDefaultIcon = imgError || !photoUri;
  const resolvedSrc = !isDefaultIcon ? photoUri : MITRA_ICON_IMAGE;

  return (
    <div
      className={`${dimensions} rounded-full overflow-hidden border-2 border-[#0D5C91] bg-white shrink-0 flex items-center justify-center relative`}
    >
      <img
        src={resolvedSrc}
        alt={name}
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
        className={`w-full h-full object-cover object-center origin-center transform-gpu ${
          isDefaultIcon ? "translate-y-[14%] scale-[1.55]" : ""
        }`}
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
