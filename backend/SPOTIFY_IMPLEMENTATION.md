# Spotify Priority Queue Implementation

This implementation uses **Option 1: Recently Played API + Time Windows** to create a fair priority queue system based on actual listening data.

## How It Works

### 1. **Absolute Listening Metrics**
Instead of relative rankings, we collect actual play data:
- **Total plays**: Exact number of times a user played an artist's songs (last 30 days)
- **Listening time**: Total duration listened (plays × track duration)
- **Play frequency**: Average plays per day
- **Completion rate**: Whether users skip tracks or listen fully

### 2. **Priority Score Calculation**
```
Priority Score = (Plays × 2) + (Hours × 10) + (Frequency × 5) + (Completion × 20)

Components:
- Play count (40%): 2 points per play, max 80 points
- Listening time (30%): 10 points per hour, max 60 points  
- Play frequency (20%): 5 points per daily play, max 40 points
- Engagement (10%): Up to 20 points for completion rate
```

### 3. **Fair Comparison Example**
```javascript
// User A (Casual): 5 plays, 0.25 hours, 0.17/day frequency, 80% completion
// Score: (5×2) + (0.25×10) + (0.17×5) + (0.8×20) = 29.35

// User B (Superfan): 150 plays, 12.5 hours, 5/day frequency, 90% completion  
// Score: (150×2) + (12.5×10) + (5×5) + (0.9×20) = 183
```

## API Endpoints

### 1. **Calculate Priority Score**
```http
POST /api/fans/:fanId/priority
Content-Type: application/json

{
  "eventId": "64f8b1c2d4e5f6a7b8c9d0e1",
  "artistId": "4q3ewBCX7sLwd24euuV69X"
}
```

**Response:**
```json
{
  "message": "Priority calculated from recent listening data",
  "priorityScore": 183,
  "metrics": {
    "totalPlays": 150,
    "totalListeningTime": 45000000,
    "totalListeningHours": 12.5,
    "uniqueTracks": 25,
    "playFrequency": 5.0,
    "completionRate": 0.9
  },
  "explanation": {
    "playsContribution": 80,
    "timeContribution": 60,
    "frequencyContribution": 25,
    "engagementContribution": 18
  }
}
```

### 2. **Get Event Priority Queue**
```http
GET /api/fans/event/:eventId/queue
```

**Response:**
```json
{
  "eventId": "64f8b1c2d4e5f6a7b8c9d0e1",
  "totalInQueue": 3,
  "queue": [
    {
      "fanId": "65a1b2c3d4e5f6a7b8c9d0e1",
      "fanName": "John Doe",
      "fanEmail": "john@example.com",
      "priorityScore": 183,
      "position": 1,
      "joinedAt": "2024-01-15T10:30:00Z"
    },
    {
      "fanId": "65a1b2c3d4e5f6a7b8c9d0e2",
      "fanName": "Jane Smith", 
      "fanEmail": "jane@example.com",
      "priorityScore": 29,
      "position": 2,
      "joinedAt": "2024-01-15T11:00:00Z"
    }
  ]
}
```

### 3. **Get Spotify Insights**
```http
GET /api/fans/:fanId/spotify/:artistId
```

### 4. **Update Spotify Tokens**
```http
PUT /api/fans/:fanId/spotify
Content-Type: application/json

{
  "spotifyAccessToken": "BQC7...your_access_token",
  "spotifyRefreshToken": "AQD...your_refresh_token",
  "spotifyId": "spotify_user_123"
}
```

## Setup Instructions

### 1. **Get Spotify API Credentials**
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/)
2. Create a new app
3. Get your `Client ID` and `Client Secret`
4. Add to your `.env` file:
```env
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
```

### 2. **Test the Implementation**

#### Create a Fan with Spotify Tokens:
```bash
curl -X POST http://localhost:5000/api/fans \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "supabaseId": "user_123",
    "walletAddress": "0x1234...5678",
    "spotifyAccessToken": "BQC7...your_token",
    "spotifyRefreshToken": "AQD...your_refresh_token"
  }'
```

#### Calculate Priority:
```bash
curl -X POST http://localhost:5000/api/fans/FAN_ID/priority \
  -H "Content-Type: application/json" \
  -d '{
    "eventId": "EVENT_ID",
    "artistId": "4q3ewBCX7sLwd24euuV69X"
  }'
```

#### Get Queue:
```bash
curl http://localhost:5000/api/fans/event/EVENT_ID/queue
```

## Technical Details

### **Data Collection**
- Fetches up to 2000 recent tracks using Spotify's Recently Played API
- Paginates backwards through 30 days of listening history
- Filters for specific artist's tracks
- Handles rate limiting with 100ms delays

### **Token Management**
- Automatic token refresh using refresh tokens
- Graceful handling of expired tokens
- Fallback to top artists ranking for users with limited data

### **Fairness Features**
- **Absolute metrics**: Real play counts vs relative rankings
- **Recent focus**: 30-day window shows current interest
- **Completion detection**: Identifies genuine listening vs background play
- **Anti-gaming**: Hard to fake actual listening history

## Advantages of This Approach

✅ **Fair**: Superfans with 1000 plays beat casual listeners with 1 play
✅ **Accurate**: Based on actual listening data, not estimates  
✅ **Recent**: Shows current interest, not historical preferences
✅ **Comprehensive**: Multiple metrics prevent gaming
✅ **Scalable**: Works with any number of users and artists

This implementation provides the most fair and accurate priority queue system possible with Spotify's available APIs!
