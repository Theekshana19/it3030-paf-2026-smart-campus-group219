export const FEATURE_TAG_MAP = [
  { key: 'videocam', label: 'Recording', icon: 'videocam' },
  { key: 'wifi', label: 'Fiber WiFi', icon: 'wifi' },
  { key: 'accessible', label: 'ADA Compliant', icon: 'accessible' },
  { key: 'kitchen', label: 'Pantry', icon: 'kitchen' },
];

export function normalizeTagName(value) {
  return String(value || '').trim().toLowerCase();
}

export function findFeatureByTagName(tagName) {
  const normalized = normalizeTagName(tagName);
  return FEATURE_TAG_MAP.find(
    (feature) =>
      normalizeTagName(feature.key) === normalized || normalizeTagName(feature.label) === normalized
  );
}
