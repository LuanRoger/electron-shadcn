import { getPlatform } from "@/actions/app";
import { closeWindow, minimizeWindow } from "@/actions/window";
import { type ReactNode, useEffect, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { openExternalLink } from "@/actions/shell";

interface DragWindowRegionProps {
  title?: ReactNode;
}

export default function DragWindowRegion({ title }: DragWindowRegionProps) {
  const [platform, setPlatform] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    getPlatform()
      .then((value) => {
        if (!active) {
          return;
        }

        setPlatform(value);
      })
      .catch((error) => {
        console.error("Failed to detect platform", error);
      });

    return () => {
      active = false;
    };
  }, []);

  const isMacOS = platform === "darwin";

  return (
    <div className="flex w-full items-stretch justify-between">
      <div className="draglayer w-full">
        {title && !isMacOS && (
          <div className="flex flex-1 font-bold p-2 text-xs whitespace-nowrap text-white select-none bg-zinc-900">
            {title}
          </div>
        )}
        {isMacOS && (
          <div className="flex flex-1 p-2">
            {/* Maintain the same height but do not display content */}
          </div>
        )}
      </div>
      {!isMacOS && <WindowButtons />}
    </div>
  );
}

function WindowButtons() {
  const router = useRouter();
  return (
    <div className="flex">
      <button
        title="디스코드드"
        type="button"
        className="p-2 bg-zinc-900 text-white hover:bg-zinc-500/70"
        onClick={() => openExternalLink('https://discord.gg/eFCugc8dFf')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" x="0" y="0" width="16" height="16" viewBox="0,0,256,256">
        <g fill="#ffffff" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" className="mix-blend-mode: normal"><g transform="scale(8.53333,8.53333)"><path d="M25.12,6.946c-2.424,-1.948 -6.257,-2.278 -6.419,-2.292c-0.256,-0.022 -0.499,0.123 -0.604,0.357c-0.004,0.008 -0.218,0.629 -0.425,1.228c2.817,0.493 4.731,1.587 4.833,1.647c0.478,0.278 0.638,0.891 0.359,1.368c-0.185,0.318 -0.52,0.496 -0.864,0.496c-0.171,0 -0.343,-0.043 -0.501,-0.135c-0.028,-0.017 -2.836,-1.615 -6.497,-1.615c-3.662,0 -6.471,1.599 -6.499,1.615c-0.477,0.277 -1.089,0.114 -1.366,-0.364c-0.277,-0.476 -0.116,-1.087 0.36,-1.365c0.102,-0.06 2.023,-1.158 4.848,-1.65c-0.218,-0.606 -0.438,-1.217 -0.442,-1.225c-0.105,-0.235 -0.348,-0.383 -0.604,-0.357c-0.162,0.013 -3.995,0.343 -6.451,2.318c-1.284,1.186 -3.848,8.12 -3.848,14.115c0,0.106 0.027,0.209 0.08,0.301c1.771,3.11 6.599,3.924 7.699,3.959c0.007,0.001 0.013,0.001 0.019,0.001c0.194,0 0.377,-0.093 0.492,-0.25l1.19,-1.612c-2.61,-0.629 -3.99,-1.618 -4.073,-1.679c-0.444,-0.327 -0.54,-0.953 -0.213,-1.398c0.326,-0.443 0.95,-0.541 1.394,-0.216c0.037,0.024 2.584,1.807 7.412,1.807c4.847,0 7.387,-1.79 7.412,-1.808c0.444,-0.322 1.07,-0.225 1.395,0.221c0.324,0.444 0.23,1.066 -0.212,1.392c-0.083,0.061 -1.456,1.048 -4.06,1.677l1.175,1.615c0.115,0.158 0.298,0.25 0.492,0.25c0.007,0 0.013,0 0.019,-0.001c1.101,-0.035 5.929,-0.849 7.699,-3.959c0.053,-0.092 0.08,-0.195 0.08,-0.301c0,-5.994 -2.564,-12.928 -3.88,-14.14zM11,19c-1.105,0 -2,-1.119 -2,-2.5c0,-1.381 0.895,-2.5 2,-2.5c1.105,0 2,1.119 2,2.5c0,1.381 -0.895,2.5 -2,2.5zM19,19c-1.105,0 -2,-1.119 -2,-2.5c0,-1.381 0.895,-2.5 2,-2.5c1.105,0 2,1.119 2,2.5c0,1.381 -0.895,2.5 -2,2.5z"></path></g></g>
        </svg>
      </button>
      <button
        title="설정"
        type="button"
        className="p-2 bg-zinc-900 text-white hover:bg-zinc-500/70"
        onClick={() => router.navigate({ to: "/setting" })}
      >
        <svg xmlns="http://www.w3.org/2000/svg" x="0" y="0" width="16" height="16" viewBox="0,0,256,256">
        <g fill="#ffffff" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" className="mix-blend-mode: normal"><g transform="scale(3.55556,3.55556)"><path d="M57.531,30.556c1.429,0.257 2.469,1.501 2.469,2.953v4.983c0,1.452 -1.04,2.696 -2.469,2.953l-2.974,0.535c-0.325,1.009 -0.737,1.977 -1.214,2.907l1.73,2.49c0.829,1.192 0.685,2.807 -0.342,3.834l-3.523,3.523c-1.027,1.027 -2.642,1.171 -3.834,0.342l-2.49,-1.731c-0.93,0.477 -1.898,0.889 -2.906,1.214l-0.535,2.974c-0.256,1.427 -1.5,2.467 -2.952,2.467h-4.983c-1.452,0 -2.696,-1.04 -2.953,-2.469l-0.535,-2.974c-1.009,-0.325 -1.977,-0.736 -2.906,-1.214l-2.49,1.731c-1.192,0.829 -2.807,0.685 -3.834,-0.342l-3.523,-3.523c-1.027,-1.027 -1.171,-2.641 -0.342,-3.834l1.73,-2.49c-0.477,-0.93 -0.889,-1.898 -1.214,-2.907l-2.974,-0.535c-1.427,-0.256 -2.467,-1.5 -2.467,-2.952v-4.983c0,-1.452 1.04,-2.696 2.469,-2.953l2.974,-0.535c0.325,-1.009 0.737,-1.977 1.214,-2.907l-1.73,-2.49c-0.829,-1.192 -0.685,-2.807 0.342,-3.834l3.523,-3.523c1.027,-1.027 2.642,-1.171 3.834,-0.342l2.49,1.731c0.93,-0.477 1.898,-0.889 2.906,-1.214l0.535,-2.974c0.256,-1.427 1.5,-2.467 2.952,-2.467h4.983c1.452,0 2.696,1.04 2.953,2.469l0.535,2.974c1.009,0.325 1.977,0.736 2.906,1.214l2.49,-1.731c1.192,-0.829 2.807,-0.685 3.834,0.342l3.523,3.523c1.027,1.027 1.171,2.641 0.342,3.834l-1.73,2.49c0.477,0.93 0.889,1.898 1.214,2.907zM36,45c4.97,0 9,-4.029 9,-9c0,-4.971 -4.03,-9 -9,-9c-4.97,0 -9,4.029 -9,9c0,4.971 4.03,9 9,9z"></path></g></g>
        </svg>
      </button>
      <button
        title="최소화"
        type="button"
        className="p-2 bg-zinc-900 text-white hover:bg-zinc-500/70"
        onClick={minimizeWindow}
      >
        <svg
          aria-hidden="true"
          role="img"
          width="12"
          height="12"
          viewBox="0 0 12 12"
        >
          <rect fill="currentColor" width="10" height="1" x="1" y="6"></rect>
        </svg>
      </button>
      <button
        type="button"
        title="닫기"
        className="p-2 bg-zinc-900 text-white hover:bg-red-500/85"
        onClick={closeWindow}
      >
        <svg
          aria-hidden="true"
          role="img"
          width="12"
          height="12"
          viewBox="0 0 12 12"
        >
          <polygon
            fill="currentColor"
            fillRule="evenodd"
            points="11 1.576 6.583 6 11 10.424 10.424 11 6 6.583 1.576 11 1 10.424 5.417 6 1 1.576 1.576 1 6 5.417 10.424 1"
          ></polygon>
        </svg>
      </button>
    </div>
  );
}
