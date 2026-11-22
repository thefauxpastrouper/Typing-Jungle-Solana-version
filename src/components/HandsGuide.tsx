import React from 'react';
import { Finger, FINGER_COLORS } from '../utils/keyboardMapping';

interface HandsGuideProps {
  activeFinger: Finger | null;
  shiftFinger?: Finger | null;
}

export const HandsGuide: React.FC<HandsGuideProps> = ({ activeFinger, shiftFinger }) => {
  const isFingerActive = (f: Finger) => f === activeFinger || f === shiftFinger;

  const getFingerStyle = (f: Finger) => {
    const active = isFingerActive(f);
    const color = FINGER_COLORS[f];
    return {
      fill: active ? color.active : '#f8fafc',
      stroke: active ? color.text : '#cbd5e1',
      strokeWidth: active ? 2.5 : 1.5,
      transition: 'all 0.15s ease'
    };
  };

  return (
    <div className="flex items-center justify-center gap-12 py-3 select-none">
      {/* LEFT HAND */}
      <div className="flex flex-col items-center">
        <svg width="180" height="110" viewBox="0 0 180 110" className="drop-shadow-sm">
          {/* Palm base */}
          <path
            d="M 35 105 C 35 70, 45 60, 60 55 C 75 50, 110 50, 130 65 C 145 75, 140 105, 140 105 Z"
            fill="#f1f5f9"
            stroke="#cbd5e1"
            strokeWidth="1.5"
          />

          {/* Left Pinky (lp) */}
          <path
            d="M 22 75 C 20 50, 22 28, 28 25 C 34 22, 38 45, 38 70 Z"
            style={getFingerStyle('lp')}
            className={isFingerActive('lp') ? 'animate-finger' : ''}
          />
          {/* Left Ring (lr) */}
          <path
            d="M 42 65 C 42 35, 46 14, 54 12 C 62 10, 65 30, 64 60 Z"
            style={getFingerStyle('lr')}
            className={isFingerActive('lr') ? 'animate-finger' : ''}
          />
          {/* Left Middle (lm) */}
          <path
            d="M 68 56 C 68 25, 74 6, 83 5 C 92 4, 94 25, 92 56 Z"
            style={getFingerStyle('lm')}
            className={isFingerActive('lm') ? 'animate-finger' : ''}
          />
          {/* Left Index (li) */}
          <path
            d="M 96 58 C 98 30, 106 16, 115 16 C 124 16, 122 36, 118 62 Z"
            style={getFingerStyle('li')}
            className={isFingerActive('li') ? 'animate-finger' : ''}
          />
          {/* Left Thumb (lt) */}
          <path
            d="M 125 72 C 140 65, 160 58, 168 66 C 174 74, 155 88, 136 88 Z"
            style={getFingerStyle('lt')}
            className={isFingerActive('lt') ? 'animate-finger' : ''}
          />
        </svg>
        <span className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">Left Hand</span>
      </div>

      {/* RIGHT HAND */}
      <div className="flex flex-col items-center">
        <svg width="180" height="110" viewBox="0 0 180 110" className="drop-shadow-sm">
          {/* Palm base */}
          <path
            d="M 145 105 C 145 70, 135 60, 120 55 C 105 50, 70 50, 50 65 C 35 75, 40 105, 40 105 Z"
            fill="#f1f5f9"
            stroke="#cbd5e1"
            strokeWidth="1.5"
          />

          {/* Right Thumb (rt) */}
          <path
            d="M 55 72 C 40 65, 20 58, 12 66 C 6 74, 25 88, 44 88 Z"
            style={getFingerStyle('rt')}
            className={isFingerActive('rt') ? 'animate-finger' : ''}
          />
          {/* Right Index (ri) */}
          <path
            d="M 84 58 C 82 30, 74 16, 65 16 C 56 16, 58 36, 62 62 Z"
            style={getFingerStyle('ri')}
            className={isFingerActive('ri') ? 'animate-finger' : ''}
          />
          {/* Right Middle (rm) */}
          <path
            d="M 112 56 C 112 25, 106 6, 97 5 C 88 4, 86 25, 88 56 Z"
            style={getFingerStyle('rm')}
            className={isFingerActive('rm') ? 'animate-finger' : ''}
          />
          {/* Right Ring (rr) */}
          <path
            d="M 138 65 C 138 35, 134 14, 126 12 C 118 10, 115 30, 116 60 Z"
            style={getFingerStyle('rr')}
            className={isFingerActive('rr') ? 'animate-finger' : ''}
          />
          {/* Right Pinky (rp) */}
          <path
            d="M 158 75 C 160 50, 158 28, 152 25 C 146 22, 142 45, 142 70 Z"
            style={getFingerStyle('rp')}
            className={isFingerActive('rp') ? 'animate-finger' : ''}
          />
        </svg>
        <span className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">Right Hand</span>
      </div>
    </div>
  );
};
