import React, { useEffect, useState } from 'react';
import { KEYBOARD_ROWS, KeyDef, FINGER_COLORS, Finger } from '../utils/keyboardMapping';

interface VirtualKeyboardProps {
  activeKeyCode: string | null;
  shiftKeyCode: string | null;
  activeFinger: Finger | null;
}

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  activeKeyCode,
  shiftKeyCode,
  activeFinger
}) => {
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setPressedKey(e.code);
    };
    const handleKeyUp = () => {
      setPressedKey(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const getKeyWidthClass = (width?: number) => {
    if (!width || width === 1) return 'flex-1 min-w-[34px] sm:min-w-[42px]';
    if (width === 1.5) return 'flex-[1.5] min-w-[50px] sm:min-w-[62px]';
    if (width === 1.75) return 'flex-[1.75] min-w-[58px] sm:min-w-[72px]';
    if (width === 2) return 'flex-[2] min-w-[66px] sm:min-w-[82px]';
    if (width === 2.25) return 'flex-[2.25] min-w-[74px] sm:min-w-[92px]';
    if (width === 2.75) return 'flex-[2.75] min-w-[90px] sm:min-w-[110px]';
    if (width === 6.25) return 'flex-[6.25] min-w-[200px] sm:min-w-[280px]';
    return 'flex-1';
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-3 sm:p-4 bg-[#e2e8f0]/80 rounded-2xl shadow-inner border border-slate-300 backdrop-blur-sm select-none">
      <div className="flex flex-col gap-1.5 sm:gap-2">
        {KEYBOARD_ROWS.map((row, rowIdx) => (
          <div key={rowIdx} className="flex gap-1 sm:gap-1.5 justify-center w-full">
            {row.map((key) => {
              const isTarget = key.code === activeKeyCode;
              const isShiftTarget = key.code === shiftKeyCode;
              const isPhysicallyPressed = key.code === pressedKey;
              const color = FINGER_COLORS[key.finger];

              const isHighlighted = isTarget || isShiftTarget;

              return (
                <div
                  key={key.code}
                  className={`relative flex flex-col justify-between p-1 sm:p-1.5 rounded-lg border text-center transition-all duration-75 shadow-sm ${
                    getKeyWidthClass(key.width)
                  } ${
                    isPhysicallyPressed
                      ? 'translate-y-0.5 shadow-none scale-[0.98]'
                      : 'shadow-[0_2px_0_rgba(0,0,0,0.15)]'
                  } ${
                    isHighlighted
                      ? 'ring-2 ring-offset-1 ring-blue-500 font-bold z-10 scale-[1.02]'
                      : ''
                  }`}
                  style={{
                    height: '46px',
                    backgroundColor: isHighlighted ? color.active : color.bg,
                    borderColor: isHighlighted ? color.text : color.border,
                    color: isHighlighted ? '#ffffff' : color.text
                  }}
                >
                  {/* Shift label (top) */}
                  {key.shift !== key.normal && !key.isSpecial ? (
                    <span
                      className={`text-[10px] sm:text-xs leading-none text-right pr-0.5 ${
                        isHighlighted ? 'text-white' : 'text-slate-500'
                      }`}
                    >
                      {key.shift}
                    </span>
                  ) : (
                    <span className="text-[10px] leading-none opacity-0">.</span>
                  )}

                  {/* Primary key label */}
                  <span
                    className={`text-xs sm:text-sm font-semibold uppercase leading-none ${
                      key.isSpecial ? 'text-[11px] font-medium tracking-tight text-center my-auto' : 'text-center'
                    }`}
                  >
                    {key.normal === ' ' ? 'Space' : key.normal}
                  </span>

                  {/* Little tactile marker for F and J home row */}
                  {(key.code === 'KeyF' || key.code === 'KeyJ') && (
                    <div
                      className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-3 h-0.5 rounded-full ${
                        isHighlighted ? 'bg-white' : 'bg-slate-400'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
