import { useFonts } from 'expo-font';

const NotoSerifJP_500Medium = require('../node_modules/@expo-google-fonts/noto-serif-jp/500Medium/NotoSerifJP_500Medium.ttf');
const NotoSerifJP_700Bold = require('../node_modules/@expo-google-fonts/noto-serif-jp/700Bold/NotoSerifJP_700Bold.ttf');
const NotoSansJP_300Light = require('../node_modules/@expo-google-fonts/noto-sans-jp/300Light/NotoSansJP_300Light.ttf');
const NotoSansJP_400Regular = require('../node_modules/@expo-google-fonts/noto-sans-jp/400Regular/NotoSansJP_400Regular.ttf');
const NotoSansJP_500Medium = require('../node_modules/@expo-google-fonts/noto-sans-jp/500Medium/NotoSansJP_500Medium.ttf');

export function useAppFonts() {
  return useFonts({
    NotoSerifJP_500Medium,
    NotoSerifJP_700Bold,
    NotoSansJP_300Light,
    NotoSansJP_400Regular,
    NotoSansJP_500Medium,
  });
}
