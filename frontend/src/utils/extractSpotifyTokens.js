// Utility to extract Spotify tokens from Auth0 user object (if available)
export function extractSpotifyTokens(user) {
  // Auth0 will only include tokens in the user object if configured in the Auth0 dashboard rules/actions
  // Example: user["https://yourdomain.com/spotify_access_token"]
  return {
    accessToken: user && user["https://yourdomain.com/spotify_access_token"],
    refreshToken: user && user["https://yourdomain.com/spotify_refresh_token"],
    spotifyId: user && user["https://yourdomain.com/spotify_id"],
  };
}
