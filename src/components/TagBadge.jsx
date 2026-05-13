const tagConfig = {
  Coding:           { bg: 'bg-sky-100 dark:bg-sky-900/40',    text: 'text-sky-700 dark:text-sky-300',    dot: 'bg-sky-400' },
  Robotics:         { bg: 'bg-petal-100 dark:bg-petal-900/40', text: 'text-petal-700 dark:text-petal-300', dot: 'bg-petal-400' },
  Photography:      { bg: 'bg-sand-100 dark:bg-sand-900/40',   text: 'text-sand-700 dark:text-sand-300',  dot: 'bg-sand-400' },
  Dance:            { bg: 'bg-bloom-100 dark:bg-bloom-900/30', text: 'text-bloom-700 dark:text-bloom-300', dot: 'bg-bloom-400' },
  Music:            { bg: 'bg-mint-100 dark:bg-mint-900/30',   text: 'text-mint-700 dark:text-mint-300',  dot: 'bg-mint-400' },
  Sports:           { bg: 'bg-sand-100 dark:bg-sand-900/40',   text: 'text-sand-700 dark:text-sand-300',  dot: 'bg-sand-500' },
  Athletics:        { bg: 'bg-sand-100 dark:bg-sand-900/40',   text: 'text-sand-700 dark:text-sand-300',  dot: 'bg-sand-500' },
  Literature:       { bg: 'bg-petal-50 dark:bg-grape-700/50',  text: 'text-gray-600 dark:text-gray-300',  dot: 'bg-gray-400' },
  Writing:          { bg: 'bg-petal-50 dark:bg-grape-700/50',  text: 'text-gray-600 dark:text-gray-300',  dot: 'bg-gray-400' },
  Acting:           { bg: 'bg-bloom-100 dark:bg-bloom-900/30', text: 'text-bloom-700 dark:text-bloom-300', dot: 'bg-bloom-400' },
  Theatre:          { bg: 'bg-bloom-100 dark:bg-bloom-900/30', text: 'text-bloom-700 dark:text-bloom-300', dot: 'bg-bloom-400' },
  'Performing Arts':{ bg: 'bg-petal-100 dark:bg-petal-900/40', text: 'text-petal-600 dark:text-petal-300', dot: 'bg-petal-400' },
  Engineering:      { bg: 'bg-sky-100 dark:bg-sky-900/40',    text: 'text-sky-700 dark:text-sky-300',    dot: 'bg-sky-400' },
  'Open Source':    { bg: 'bg-mint-100 dark:bg-mint-900/30',   text: 'text-mint-700 dark:text-mint-300',  dot: 'bg-mint-400' },
  Hackathon:        { bg: 'bg-sky-100 dark:bg-sky-900/40',    text: 'text-sky-700 dark:text-sky-300',    dot: 'bg-sky-400' },
  Debate:           { bg: 'bg-petal-100 dark:bg-petal-900/40', text: 'text-petal-600 dark:text-petal-300', dot: 'bg-petal-400' },
  Health:           { bg: 'bg-mint-100 dark:bg-mint-900/30',   text: 'text-mint-700 dark:text-mint-300',  dot: 'bg-mint-400' },
  Art:              { bg: 'bg-sand-100 dark:bg-sand-900/40',   text: 'text-sand-700 dark:text-sand-300',  dot: 'bg-sand-400' },
  'Visual Media':   { bg: 'bg-sand-100 dark:bg-sand-900/40',   text: 'text-sand-700 dark:text-sand-300',  dot: 'bg-sand-400' },
  Competition:      { bg: 'bg-bloom-100 dark:bg-bloom-900/30', text: 'text-bloom-700 dark:text-bloom-300', dot: 'bg-bloom-400' },
  Performance:      { bg: 'bg-petal-100 dark:bg-petal-900/40', text: 'text-petal-600 dark:text-petal-300', dot: 'bg-petal-400' },
};

const defaultConfig = { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-600 dark:text-gray-400', dot: 'bg-gray-400' };

export default function TagBadge({ tag }) {
  const config = tagConfig[tag] || defaultConfig;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} flex-shrink-0`} />
      {tag}
    </span>
  );
}
