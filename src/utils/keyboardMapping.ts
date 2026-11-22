export type Finger = 'lp' | 'lr' | 'lm' | 'li' | 'lt' | 'rt' | 'ri' | 'rm' | 'rr' | 'rp';

export interface KeyDef {
  code: string;
  normal: string;
  shift: string;
  finger: Finger;
  width?: number; // relative width in key units (default 1)
  isSpecial?: boolean;
}

export const FINGER_COLORS: Record<Finger, { bg: string; active: string; border: string; text: string; name: string }> = {
  lp: { bg: '#ffedd5', active: '#fb923c', border: '#fdba74', text: '#9a3412', name: 'Left Pinky' },
  lr: { bg: '#fef9c3', active: '#facc15', border: '#fde047', text: '#854d0e', name: 'Left Ring' },
  lm: { bg: '#dcfce7', active: '#4ade80', border: '#86efac', text: '#166534', name: 'Left Middle' },
  li: { bg: '#e0f2fe', active: '#38bdf8', border: '#7dd3fc', text: '#075985', name: 'Left Index' },
  lt: { bg: '#f3e8ff', active: '#c084fc', border: '#d8b4fe', text: '#6b21a8', name: 'Left Thumb' },
  rt: { bg: '#f3e8ff', active: '#c084fc', border: '#d8b4fe', text: '#6b21a8', name: 'Right Thumb' },
  ri: { bg: '#e0f2fe', active: '#38bdf8', border: '#7dd3fc', text: '#075985', name: 'Right Index' },
  rm: { bg: '#dcfce7', active: '#4ade80', border: '#86efac', text: '#166534', name: 'Right Middle' },
  rr: { bg: '#fef9c3', active: '#facc15', border: '#fde047', text: '#854d0e', name: 'Right Ring' },
  rp: { bg: '#ffedd5', active: '#fb923c', border: '#fdba74', text: '#9a3412', name: 'Right Pinky' }
};

export const KEYBOARD_ROWS: KeyDef[][] = [
  // Row 1 (Numbers)
  [
    { code: 'Backquote', normal: '`', shift: '~', finger: 'lp' },
    { code: 'Digit1', normal: '1', shift: '!', finger: 'lp' },
    { code: 'Digit2', normal: '2', shift: '@', finger: 'lr' },
    { code: 'Digit3', normal: '3', shift: '#', finger: 'lm' },
    { code: 'Digit4', normal: '4', shift: '$', finger: 'li' },
    { code: 'Digit5', normal: '5', shift: '%', finger: 'li' },
    { code: 'Digit6', normal: '6', shift: '^', finger: 'ri' },
    { code: 'Digit7', normal: '7', shift: '&', finger: 'ri' },
    { code: 'Digit8', normal: '8', shift: '*', finger: 'rm' },
    { code: 'Digit9', normal: '9', shift: '(', finger: 'rr' },
    { code: 'Digit0', normal: '0', shift: ')', finger: 'rp' },
    { code: 'Minus', normal: '-', shift: '_', finger: 'rp' },
    { code: 'Equal', normal: '=', shift: '+', finger: 'rp' },
    { code: 'Backspace', normal: 'Backspace', shift: 'Backspace', finger: 'rp', width: 2, isSpecial: true }
  ],
  // Row 2 (QWERTY)
  [
    { code: 'Tab', normal: 'Tab', shift: 'Tab', finger: 'lp', width: 1.5, isSpecial: true },
    { code: 'KeyQ', normal: 'q', shift: 'Q', finger: 'lp' },
    { code: 'KeyW', normal: 'w', shift: 'W', finger: 'lr' },
    { code: 'KeyE', normal: 'e', shift: 'E', finger: 'lm' },
    { code: 'KeyR', normal: 'r', shift: 'R', finger: 'li' },
    { code: 'KeyT', normal: 't', shift: 'T', finger: 'li' },
    { code: 'KeyY', normal: 'y', shift: 'Y', finger: 'ri' },
    { code: 'KeyU', normal: 'u', shift: 'U', finger: 'ri' },
    { code: 'KeyI', normal: 'i', shift: 'I', finger: 'rm' },
    { code: 'KeyO', normal: 'o', shift: 'O', finger: 'rr' },
    { code: 'KeyP', normal: 'p', shift: 'P', finger: 'rp' },
    { code: 'BracketLeft', normal: '[', shift: '{', finger: 'rp' },
    { code: 'BracketRight', normal: ']', shift: '}', finger: 'rp' },
    { code: 'Backslash', normal: '\\', shift: '|', finger: 'rp', width: 1.5 }
  ],
  // Row 3 (Home Row)
  [
    { code: 'CapsLock', normal: 'Caps', shift: 'Caps', finger: 'lp', width: 1.75, isSpecial: true },
    { code: 'KeyA', normal: 'a', shift: 'A', finger: 'lp' },
    { code: 'KeyS', normal: 's', shift: 'S', finger: 'lr' },
    { code: 'KeyD', normal: 'd', shift: 'D', finger: 'lm' },
    { code: 'KeyF', normal: 'f', shift: 'F', finger: 'li' },
    { code: 'KeyG', normal: 'g', shift: 'G', finger: 'li' },
    { code: 'KeyH', normal: 'h', shift: 'H', finger: 'ri' },
    { code: 'KeyJ', normal: 'j', shift: 'J', finger: 'ri' },
    { code: 'KeyK', normal: 'k', shift: 'K', finger: 'rm' },
    { code: 'KeyL', normal: 'l', shift: 'L', finger: 'rr' },
    { code: 'Semicolon', normal: ';', shift: ':', finger: 'rp' },
    { code: 'Quote', normal: "'", shift: '"', finger: 'rp' },
    { code: 'Enter', normal: 'Enter', shift: 'Enter', finger: 'rp', width: 2.25, isSpecial: true }
  ],
  // Row 4 (Bottom Row)
  [
    { code: 'ShiftLeft', normal: 'Shift', shift: 'Shift', finger: 'lp', width: 2.25, isSpecial: true },
    { code: 'KeyZ', normal: 'z', shift: 'Z', finger: 'lp' },
    { code: 'KeyX', normal: 'x', shift: 'X', finger: 'lr' },
    { code: 'KeyC', normal: 'c', shift: 'C', finger: 'lm' },
    { code: 'KeyV', normal: 'v', shift: 'V', finger: 'li' },
    { code: 'KeyB', normal: 'b', shift: 'B', finger: 'li' },
    { code: 'KeyN', normal: 'n', shift: 'N', finger: 'ri' },
    { code: 'KeyM', normal: 'm', shift: 'M', finger: 'ri' },
    { code: 'Comma', normal: ',', shift: '<', finger: 'rm' },
    { code: 'Period', normal: '.', shift: '>', finger: 'rr' },
    { code: 'Slash', normal: '/', shift: '?', finger: 'rp' },
    { code: 'ShiftRight', normal: 'Shift', shift: 'Shift', finger: 'rp', width: 2.75, isSpecial: true }
  ],
  // Row 5 (Space Row)
  [
    { code: 'Space', normal: 'Space', shift: 'Space', finger: 'rt', width: 6.25, isSpecial: true }
  ]
];

// Quick lookup map for character to key
export interface TargetKeyInfo {
  code: string;
  finger: Finger;
  needsShift: boolean;
  shiftKey: 'ShiftLeft' | 'ShiftRight' | null;
}

export function getKeyDetailsForChar(char: string): TargetKeyInfo | null {
  if (!char) return null;

  if (char === ' ') {
    return { code: 'Space', finger: 'rt', needsShift: false, shiftKey: null };
  }
  if (char === '\n') {
    return { code: 'Enter', finger: 'rp', needsShift: false, shiftKey: null };
  }
  if (char === '\t') {
    return { code: 'Tab', finger: 'lp', needsShift: false, shiftKey: null };
  }

  for (const row of KEYBOARD_ROWS) {
    for (const key of row) {
      if (key.normal === char) {
        return {
          code: key.code,
          finger: key.finger,
          needsShift: false,
          shiftKey: null
        };
      }
      if (key.shift === char) {
        // If target key is on left hand (lp, lr, lm, li), use Right Shift!
        // If target key is on right hand (ri, rm, rr, rp), use Left Shift!
        const isLeftHand = ['lp', 'lr', 'lm', 'li'].includes(key.finger);
        return {
          code: key.code,
          finger: key.finger,
          needsShift: true,
          shiftKey: isLeftHand ? 'ShiftRight' : 'ShiftLeft'
        };
      }
    }
  }

  return null;
}
