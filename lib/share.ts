import { Share } from 'react-native';

export async function shareResult(options: {
  title: string;
  message: string;
  hashtags?: string[];
}) {
  const hashtags = options.hashtags ?? ['むすび島', '数秘術', '占い'];
  const hashtagStr = hashtags.map(h => `#${h}`).join(' ');
  const fullMessage = `${options.message}\n\n${hashtagStr}\nhttps://hinfinitya00-sys.github.io/musubijima-uranai/`;
  try {
    await Share.share({ message: fullMessage, title: options.title });
  } catch (e) {
    console.error(e);
  }
}
