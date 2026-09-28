import {
  defaultTouchZoneActions,
  getTouchZoneActions,
  setTouchZoneAction,
} from '../touchZones';

describe('touch zone settings', () => {
  it('provides six or nine default actions for existing settings', () => {
    expect(getTouchZoneActions(undefined, '2x3')).toHaveLength(6);
    expect(getTouchZoneActions(undefined, '3x3')).toHaveLength(9);
  });

  it('keeps each grid independent when assigning a zone', () => {
    const sixZones = setTouchZoneAction(undefined, '2x3', 3, 'brightnessUp');
    const nineZones = setTouchZoneAction(sixZones, '3x3', 8, 'nextTenPages');

    expect(nineZones['2x3'][3]).toBe('brightnessUp');
    expect(nineZones['3x3'][8]).toBe('nextTenPages');
    expect(defaultTouchZoneActions['2x3'][3]).toBe('controls');
  });

  it('recovers a layout with an outdated number of zones', () => {
    expect(getTouchZoneActions({ '3x3': ['nextPage'] }, '3x3')).toEqual(
      defaultTouchZoneActions['3x3'],
    );
  });
});
