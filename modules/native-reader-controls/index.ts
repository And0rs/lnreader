import { requireOptionalNativeModule } from 'expo-modules-core';

type NativeReaderControlsModule = {
  adjustVolume(direction: number): void;
  adjustBrightness(direction: number): void;
};

export default requireOptionalNativeModule<NativeReaderControlsModule>(
  'NativeReaderControls',
);
