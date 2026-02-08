const RECENT_GAMES_KEY = 'recent-games';
const MAX_RECENT_GAMES = 20;

/**
 * Track a game click/visit
 * @param {string} gameId - The game ID to track
 */
export function trackGameClick(gameId) {
  if (!gameId) return;

  try {
    const existing = getRecentGames();
    
    // Remove if already exists (we'll add it to the front)
    const filtered = existing.filter(item => item.gameId !== gameId);
    
    // Add to front with timestamp
    const updated = [
      { gameId, timestamp: Date.now() },
      ...filtered
    ].slice(0, MAX_RECENT_GAMES);
    
    localStorage.setItem(RECENT_GAMES_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to track game click:', error);
  }
}

/**
 * Get recent games from localStorage
 * @returns {Array<{gameId: string, timestamp: number}>}
 */
export function getRecentGames() {
  try {
    const stored = localStorage.getItem(RECENT_GAMES_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to get recent games:', error);
    return [];
  }
}

/**
 * Clear all recent games
 */
export function clearRecentGames() {
  try {
    localStorage.removeItem(RECENT_GAMES_KEY);
  } catch (error) {
    console.error('Failed to clear recent games:', error);
  }
}
