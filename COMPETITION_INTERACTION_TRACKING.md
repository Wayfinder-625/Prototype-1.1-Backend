# Competition Interaction Tracking

This feature allows you to track user interactions with competitions, providing insights into user behavior and engagement patterns.

## Database Schema

A new `CompetitionInteraction` model has been added to track:
- User ID
- Competition ID
- Interaction type (click, view, apply, etc.)
- Metadata (additional context like source, duration, etc.)
- Timestamp

## API Endpoints

### 1. Record Competition Interaction
**POST** `/user-interaction/competition`

Record a new interaction with a competition.

**Request Body:**
```json
{
  "competitionId": "competition_id_here",
  "interactionType": "click", // or "view", "apply", "bookmark", etc.
  "metadata": {
    "source": "competition_list",
    "duration": 120,
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

**Response:**
```json
{
  "id": 1,
  "userId": 123,
  "competitionId": "competition_id_here",
  "interactionType": "click",
  "metadata": { "source": "competition_list" },
  "createdAt": "2024-01-01T00:00:00.000Z",
  "competition": {
    "id": "competition_id_here",
    "title": "Competition Title",
    "domain": "Technology"
  }
}
```

### 2. Get User's Competition Interactions
**GET** `/user-interaction/competition/my-interactions`

Get all competition interactions for the authenticated user.

**Response:**
```json
[
  {
    "id": 1,
    "userId": 123,
    "competitionId": "comp_1",
    "interactionType": "click",
    "metadata": { "source": "competition_list" },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "competition": {
      "id": "comp_1",
      "title": "AI Challenge",
      "domain": "Technology",
      "tags": ["AI", "Machine Learning"]
    }
  }
]
```

### 3. Get User's Competition Statistics
**GET** `/user-interaction/competition/stats`

Get detailed statistics about the user's competition interactions.

**Response:**
```json
{
  "totalInteractions": 15,
  "uniqueCompetitions": 8,
  "statsByType": {
    "click": [...],
    "view": [...],
    "apply": [...]
  },
  "domainStats": {
    "Technology": 10,
    "Business": 3,
    "Design": 2
  },
  "recentInteractions": [...]
}
```

### 4. Get Overall Analytics
**GET** `/user-interaction/competition/analytics`

Get analytics across all users (admin endpoint).

**Response:**
```json
{
  "totalInteractions": 1500,
  "interactionsByType": [
    { "interactionType": "click", "_count": { "interactionType": 800 } },
    { "interactionType": "view", "_count": { "interactionType": 500 } },
    { "interactionType": "apply", "_count": { "interactionType": 200 } }
  ],
  "mostInteractedCompetitions": [...],
  "mostActiveUsers": [...]
}
```

### 5. Get Specific User's Interactions
**GET** `/user-interaction/competition/user/:userId`

Get competition interactions for a specific user.

### 6. Get Specific User's Statistics
**GET** `/user-interaction/competition/user/:userId/stats`

Get competition statistics for a specific user.

### 7. Auto-Track Competition Views
**GET** `/competitions/:id`

When a user views a specific competition, the interaction is automatically tracked.

## Usage Examples

### Frontend Integration

```javascript
// Record a competition click
const recordClick = async (competitionId) => {
  try {
    await axios.post('/user-interaction/competition', {
      competitionId,
      interactionType: 'click',
      metadata: {
        source: 'competition_card',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Failed to record click:', error);
  }
};

// Record a competition view with duration
const recordView = async (competitionId, duration) => {
  try {
    await axios.post('/user-interaction/competition', {
      competitionId,
      interactionType: 'view',
      metadata: {
        source: 'competition_detail',
        duration,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Failed to record view:', error);
  }
};

// Record an application attempt
const recordApply = async (competitionId) => {
  try {
    await axios.post('/user-interaction/competition', {
      competitionId,
      interactionType: 'apply',
      metadata: {
        source: 'apply_button',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Failed to record application:', error);
  }
};
```

### Analytics Dashboard

```javascript
// Get user's interaction statistics
const getUserStats = async () => {
  try {
    const response = await axios.get('/user-interaction/competition/stats');
    const stats = response.data;
    
    console.log(`Total interactions: ${stats.totalInteractions}`);
    console.log(`Unique competitions: ${stats.uniqueCompetitions}`);
    console.log('Domain preferences:', stats.domainStats);
    
    return stats;
  } catch (error) {
    console.error('Failed to get user stats:', error);
  }
};
```

## Interaction Types

Common interaction types you can track:
- `click` - User clicked on a competition
- `view` - User viewed competition details
- `apply` - User attempted to apply
- `bookmark` - User bookmarked a competition
- `share` - User shared a competition
- `download` - User downloaded competition materials

## Metadata Examples

The metadata field can contain any additional context:

```json
{
  "source": "competition_list|search_results|recommendations",
  "duration": 120,
  "referrer": "google.com",
  "device": "mobile",
  "session_id": "abc123",
  "user_agent": "Mozilla/5.0...",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Benefits

1. **User Behavior Analysis**: Understand which competitions users are most interested in
2. **Recommendation Improvement**: Use interaction data to improve competition recommendations
3. **Engagement Metrics**: Track user engagement with different competition types
4. **Conversion Tracking**: Monitor how many views lead to applications
5. **Content Optimization**: Identify which competitions need better descriptions or presentation

## Security

- All endpoints require JWT authentication
- Users can only access their own interaction data
- Admin endpoints for overall analytics require appropriate permissions
- Competition ID validation ensures only valid competitions are tracked 