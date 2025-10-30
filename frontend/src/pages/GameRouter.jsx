import { useParams, Navigate, useLocation } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { useAuthStore } from '@store/authStore';

// Lazy load games - ALL 19 GAMES READY!
const games = {
  // Quiz-Style Games
  codetype: lazy(() => import('@games/CodeType')),
  bugspotter: lazy(() => import('@games/BugSpotter')),
  terminalmaster: lazy(() => import('@games/TerminalMaster')),
  outputpredictor: lazy(() => import('@games/OutputPredictor')),
  regexmatcher: lazy(() => import('@games/RegexMatcher')),
  httpstatus: lazy(() => import('@games/HttpStatus')),
  bigochallenge: lazy(() => import('@games/BigOChallenge')),
  gitcommands: lazy(() => import('@games/GitCommands')),
  
  // Drag-and-Drop Games
  codeblocks: lazy(() => import('@games/CodeBlocks')),
  sqlbuilder: lazy(() => import('@games/SqlBuilder')),
  flexbox: lazy(() => import('@games/FlexboxFrenzy')),
  datastructure: lazy(() => import('@games/DataStructure')),
  
  // Interactive Games
  colormatcher: lazy(() => import('@games/ColorMatcher')),
  cssselector: lazy(() => import('@games/CssSelector')),
  binary: lazy(() => import('@games/Binary')),
  jsonpath: lazy(() => import('@games/JsonPath')),
  debugrace: lazy(() => import('@games/DebugRace')),
  apiendpoint: lazy(() => import('@games/ApiEndpoint')),
  
  // Battle Game
  codewarriors: lazy(() => import('@games/CodeWarriors')),
};

export default function GameRouter() {
  const { gameId } = useParams();
  const location = useLocation();
  const { user } = useAuthStore();
  const GameComponent = games[gameId];

  if (!GameComponent) {
    return (
      <div className="text-center py-20">
        <h2 className="text-3xl font-bold text-danger mb-4">Game Not Found</h2>
        <p className="text-gray-400">The game you're looking for doesn't exist.</p>
      </div>
    );
  }

  // Auth guard: require login to play games; redirect to sign up
  if (!user) {
    return <Navigate to="/register" replace state={{ from: location }} />;
  }

  return (
    <Suspense fallback={
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-400">Loading game...</p>
      </div>
    }>
      <GameComponent />
    </Suspense>
  );
}

