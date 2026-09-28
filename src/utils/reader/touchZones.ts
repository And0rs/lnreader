export type TouchZoneLayout = '2x3' | '3x3';

export type TouchZoneAction =
  | 'none'
  | 'controls'
  | 'settings'
  | 'chapters'
  | 'previousPage'
  | 'nextPage'
  | 'previousTenPages'
  | 'nextTenPages'
  | 'previousChapter'
  | 'nextChapter'
  | 'volumeUp'
  | 'volumeDown'
  | 'brightnessUp'
  | 'brightnessDown';

export type TouchZoneActions = Record<TouchZoneLayout, TouchZoneAction[]>;

export const defaultTouchZoneActions: TouchZoneActions = {
  '2x3': [
    'previousPage',
    'nextPage',
    'previousPage',
    'controls',
    'previousPage',
    'nextPage',
  ],
  '3x3': [
    'previousPage',
    'controls',
    'nextPage',
    'previousPage',
    'controls',
    'nextPage',
    'previousPage',
    'controls',
    'nextPage',
  ],
};

export const getTouchZoneActions = (
  actions: Partial<TouchZoneActions> | undefined,
  layout: TouchZoneLayout,
): TouchZoneAction[] => {
  const saved = actions?.[layout];
  return saved?.length === defaultTouchZoneActions[layout].length
    ? saved
    : defaultTouchZoneActions[layout];
};

export const setTouchZoneAction = (
  actions: Partial<TouchZoneActions> | undefined,
  layout: TouchZoneLayout,
  index: number,
  action: TouchZoneAction,
): TouchZoneActions => {
  const updated = [...getTouchZoneActions(actions, layout)];
  updated[index] = action;
  return { ...defaultTouchZoneActions, ...actions, [layout]: updated };
};
