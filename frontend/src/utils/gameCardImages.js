const IMAGEKIT_BASE = import.meta.env.VITE_IMAGEKIT_URL || 'https://ik.imagekit.io/cpnei0o4f/Games%20Backgrounds';

const GAME_BACKGROUND_FILES = {
  apiendpoint: 'API endpoint rush.png',
  bigochallenge: 'BigO challenge.png',
  binary: 'Binary.png',
  bugspotter: 'Bugspotter.png',
  codetype: 'Type.png',
  codeblocks: 'Drag n Drop.png',
  colormatcher: 'colorcode.png',
  cssselector: 'CSS.png',
  datastructure: 'Data_structure.png',
  debugrace: 'debug.png',
  flexbox: 'FlexBox.png',
  gitcommands: 'Git.png',
  httpstatus: 'HTTP status.png',
  jsonpath: 'json.png',
  outputpredictor: 'outputPredictor.png',
  regexmatcher: 'Regex.png',
  sqlbuilder: 'SQL.png',
  terminalmaster: 'TerminalMaster.png',
};

export function getGameCardImageUrl(gameId, opts = {}) {
  const file = GAME_BACKGROUND_FILES[gameId];
  if (!file) return null;
  const width = opts.width ?? 600;
  const quality = opts.quality ?? 75;
  const encoded = encodeURIComponent(file);
  return `${IMAGEKIT_BASE}/${encoded}?tr=w-${width},q-${quality}`;
}
