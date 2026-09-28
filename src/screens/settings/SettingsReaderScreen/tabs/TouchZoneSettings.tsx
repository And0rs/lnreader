import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Dialog, RadioButton } from '@components';
import { useChapterGeneralSettings, useTheme } from '@hooks/persisted';
import { getString } from '@i18n/translations';
import { StringMap } from '@i18n/types';
import {
  defaultTouchZoneActions,
  getTouchZoneActions,
  setTouchZoneAction,
  TouchZoneAction,
  TouchZoneLayout,
} from '@utils/reader/touchZones';
import SettingSwitch from '../../components/SettingSwitch';

const actionOptions: TouchZoneAction[] = [
  'none',
  'controls',
  'settings',
  'chapters',
  'previousPage',
  'nextPage',
  'previousTenPages',
  'nextTenPages',
  'previousChapter',
  'nextChapter',
  'volumeUp',
  'volumeDown',
  'brightnessUp',
  'brightnessDown',
];

const actionLabel = (action: TouchZoneAction) =>
  getString(`readerSettings.touchZoneActions.${action}` as keyof StringMap);

const TouchZoneSettings: React.FC = () => {
  const theme = useTheme();
  const {
    touchZonesEnabled,
    touchZoneLayout,
    touchZoneActions,
    setChapterGeneralSettings,
  } = useChapterGeneralSettings();
  const [selectedZone, setSelectedZone] = useState<number | null>(null);
  const layout: TouchZoneLayout = touchZoneLayout === '2x3' ? '2x3' : '3x3';
  const columns = layout === '2x3' ? 2 : 3;
  const actions = getTouchZoneActions(touchZoneActions, layout);

  const updateZone = (action: TouchZoneAction) => {
    if (selectedZone === null) return;
    setChapterGeneralSettings({
      touchZoneActions: setTouchZoneAction(
        touchZoneActions,
        layout,
        selectedZone,
        action,
      ),
    });
    setSelectedZone(null);
  };

  return (
    <View>
      <SettingSwitch
        label={getString('readerSettings.touchZones')}
        description={getString('readerSettings.touchZonesDescription')}
        value={touchZonesEnabled}
        onPress={() =>
          setChapterGeneralSettings({ touchZonesEnabled: !touchZonesEnabled })
        }
        theme={theme}
      />
      {touchZonesEnabled && (
        <View style={styles.editor}>
          <Text style={[styles.label, { color: theme.onSurface }]}>
            {getString('readerSettings.touchZoneLayout')}
          </Text>
          <View style={styles.layouts}>
            {(['2x3', '3x3'] as const).map(option => (
              <Pressable
                key={option}
                accessibilityRole="button"
                accessibilityState={{ selected: layout === option }}
                onPress={() =>
                  setChapterGeneralSettings({ touchZoneLayout: option })
                }
                style={[
                  styles.layoutButton,
                  {
                    borderColor: theme.outline,
                    backgroundColor:
                      layout === option
                        ? theme.primaryContainer
                        : theme.surface,
                  },
                ]}
              >
                <Text style={{ color: theme.onSurface }}>{option}</Text>
              </Pressable>
            ))}
          </View>
          <Text style={[styles.hint, { color: theme.onSurfaceVariant }]}>
            {getString('readerSettings.touchZoneEditHint')}
          </Text>
          {[0, 1, 2].map(row => (
            <View key={row} style={styles.row}>
              {Array.from({ length: columns }, (_, column) => {
                const index = row * columns + column;
                return (
                  <Pressable
                    key={index}
                    accessibilityRole="button"
                    accessibilityLabel={`${index + 1}: ${actionLabel(
                      actions[index],
                    )}`}
                    onPress={() => setSelectedZone(index)}
                    style={[
                      styles.zone,
                      {
                        borderColor: theme.outline,
                        backgroundColor:
                          theme.surfaceContainerLow ?? theme.surface,
                      },
                    ]}
                  >
                    <Text style={[styles.zoneText, { color: theme.onSurface }]}>
                      {index + 1}. {actionLabel(actions[index])}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ))}
          <Pressable
            accessibilityRole="button"
            onPress={() =>
              setChapterGeneralSettings({
                touchZoneActions: {
                  ...touchZoneActions,
                  [layout]: [...defaultTouchZoneActions[layout]],
                },
              })
            }
            style={styles.reset}
          >
            <Text style={{ color: theme.primary }}>
              {getString('common.reset')}
            </Text>
          </Pressable>
        </View>
      )}
      <Dialog.Root
        visible={selectedZone !== null}
        onDismiss={() => setSelectedZone(null)}
      >
        <Dialog.Title>
          {getString('readerSettings.touchZoneAction', {
            number: (selectedZone ?? 0) + 1,
          })}
        </Dialog.Title>
        <Dialog.List>
          <ScrollView style={styles.actionList}>
            {actionOptions.map(action => (
              <RadioButton
                key={action}
                status={
                  selectedZone !== null && actions[selectedZone] === action
                }
                onPress={() => updateZone(action)}
                label={actionLabel(action)}
                theme={theme}
              />
            ))}
          </ScrollView>
        </Dialog.List>
      </Dialog.Root>
    </View>
  );
};

export default TouchZoneSettings;

const styles = StyleSheet.create({
  editor: { paddingHorizontal: 16, paddingBottom: 8 },
  label: { marginVertical: 8 },
  layouts: { flexDirection: 'row', gap: 8 },
  layoutButton: {
    borderWidth: 1,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
    padding: 10,
  },
  hint: { marginVertical: 12 },
  row: { flexDirection: 'row' },
  zone: {
    flex: 1,
    minHeight: 68,
    borderWidth: 1,
    margin: 2,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  zoneText: { textAlign: 'center', fontSize: 12 },
  reset: { alignSelf: 'flex-end', padding: 12 },
  actionList: { maxHeight: 440 },
});
