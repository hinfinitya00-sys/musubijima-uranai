import { Share, Platform } from 'react-native';

export async function shareResult(options: {
  title: string;
  message: string;
  hashtags?: string[];
}) {
  const hashtags = options.hashtags ?? ['むすび島', '数秘術', '占い'];
  const hashtagStr = hashtags.map(h => `#${h}`).join(' ');
  const url = 'https://hinfinitya00-sys.github.io/musubijima-uranai/';
  const fullMessage = `${options.message}\n\n${hashtagStr}\n${url}`;

  // Web: navigator.share があれば使う
  if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({ title: options.title, text: fullMessage, url });
      return;
    } catch (e) {
      // キャンセルは無視
    }
  }

  // RNネイティブ
  try {
    await Share.share({ message: fullMessage, title: options.title });
  } catch (e) {
    // キャンセルは無視
  }
}

// X（Twitter）共有URL
export function getXShareUrl(message: string, hashtags?: string[]): string {
  const tags = (hashtags ?? ['むすび島', '数秘術', '占い']).join(',');
  const url = 'https://hinfinitya00-sys.github.io/musubijima-uranai/';
  const text = encodeURIComponent(`${message}\n${url}`);
  return `https://twitter.com/intent/tweet?text=${text}&hashtags=${encodeURIComponent(tags)}`;
}

// LINE共有URL
export function getLineShareUrl(message: string): string {
  const url = 'https://hinfinitya00-sys.github.io/musubijima-uranai/';
  const text = encodeURIComponent(`${message}\n${url}`);
  return `https://social-plugins.line.me/lineit/share?text=${text}`;
}

// Instagram：直接シェアURLは非対応のため、クリップボードコピー＋App Store誘導
export async function shareToInstagram(message: string): Promise<void> {
  const hashtags = ['#むすび島', '#数秘術', '#占い'].join(' ');
  const url = 'https://hinfinitya00-sys.github.io/musubijima-uranai/';
  const text = `${message}\n\n${hashtags}\n${url}`;
  if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard) {
    await navigator.clipboard.writeText(text);
  }
}
