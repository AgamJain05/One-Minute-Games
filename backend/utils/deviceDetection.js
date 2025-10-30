import UAParser from 'ua-parser-js';
import crypto from 'crypto';

/**
 * Extract device information from request
 */
function getDeviceInfo(req) {
  const parser = new UAParser(req.headers['user-agent']);
  const result = parser.getResult();
  
  // Generate unique device ID based on user agent and other headers
  const deviceFingerprint = `${req.headers['user-agent']}-${req.headers['accept-language']}-${req.headers['accept-encoding']}`;
  const deviceId = crypto.createHash('sha256').update(deviceFingerprint).digest('hex');
  
  return {
    deviceId,
    deviceName: `${result.browser.name || 'Unknown'} on ${result.os.name || 'Unknown'}`,
    deviceType: result.device.type || 'desktop',
    browser: `${result.browser.name || 'Unknown'} ${result.browser.version || ''}`.trim(),
    os: `${result.os.name || 'Unknown'} ${result.os.version || ''}`.trim(),
    ip: getClientIP(req),
    location: 'Unknown', // Will be populated by IP geolocation
  };
}

/**
 * Get client IP address from request
 */
function getClientIP(req) {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded
    ? forwarded.split(',')[0].trim()
    : req.connection.remoteAddress || req.socket.remoteAddress;
  
  // Clean up IPv6 localhost
  return ip === '::1' || ip === '::ffff:127.0.0.1' ? '127.0.0.1' : ip;
}

/**
 * Check if login is from a new device
 */
function isNewDevice(user, deviceId) {
  return !user.activeSessions.some(session => session.deviceId === deviceId);
}

/**
 * Check if IP has changed significantly (different region/country)
 */
function isSuspiciousLocation(user, currentIP) {
  // Simplified check - in production, use IP geolocation API
  // to compare countries/regions
  if (!user.lastLoginIP) return false;
  
  // If IP prefix is different (basic check)
  const lastIPPrefix = user.lastLoginIP.split('.').slice(0, 2).join('.');
  const currentIPPrefix = currentIP.split('.').slice(0, 2).join('.');
  
  return lastIPPrefix !== currentIPPrefix;
}

/**
 * Check if login timing is suspicious
 */
function isSuspiciousTiming(user) {
  if (!user.lastLoginAt) return false;
  
  const minutesSinceLastLogin = (Date.now() - new Date(user.lastLoginAt)) / 1000 / 60;
  
  // If logged in less than 1 minute ago (might be brute force)
  return minutesSinceLastLogin < 1;
}

export {
  getDeviceInfo,
  getClientIP,
  isNewDevice,
  isSuspiciousLocation,
  isSuspiciousTiming,
};



