import express from 'express';
import cors from 'cors';
import { YoutubeTranscript } from 'youtube-transcript';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Utility function to extract video ID from YouTube URL
const extractVideoId = (url) => {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'YouTube Transcript API is running!',
    endpoints: {
      'GET /api/transcript/:videoId': 'Get transcript by video ID',
      'POST /api/transcript': 'Get transcript by video URL (send {"url": "youtube_url"} in body)'
    }
  });
});

// GET method - Get transcript by video ID
app.get('/api/transcript/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;
    
    if (!videoId) {
      return res.status(400).json({
        error: 'Video ID is required'
      });
    }

    console.log(`Fetching transcript for video ID: ${videoId}`);
    
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    
    if (!transcript || transcript.length === 0) {
      return res.status(404).json({
        error: 'No transcript found for this video'
      });
    }

    res.json({
      success: true,
      videoId: videoId,
      transcript: transcript,
      totalSegments: transcript.length
    });

  } catch (error) {
    console.error('Error fetching transcript:', error);
    
    if (error.message.includes('Transcript is disabled')) {
      return res.status(403).json({
        error: 'Transcript is disabled for this video'
      });
    }
    
    if (error.message.includes('No transcript found')) {
      return res.status(404).json({
        error: 'No transcript available for this video'
      });
    }

    res.status(500).json({
      error: 'Failed to fetch transcript',
      details: error.message
    });
  }
});

// POST method - Get transcript by video URL
app.post('/api/transcript', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({
        error: 'YouTube URL is required in request body'
      });
    }

    const videoId = extractVideoId(url);
    
    if (!videoId) {
      return res.status(400).json({
        error: 'Invalid YouTube URL format'
      });
    }

    console.log(`Fetching transcript for URL: ${url} (Video ID: ${videoId})`);
    
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    
    if (!transcript || transcript.length === 0) {
      return res.status(404).json({
        error: 'No transcript found for this video'
      });
    }

    res.json({
      success: true,
      url: url,
      videoId: videoId,
      transcript: transcript,
      totalSegments: transcript.length
    });

  } catch (error) {
    console.error('Error fetching transcript:', error);
    
    if (error.message.includes('Transcript is disabled')) {
      return res.status(403).json({
        error: 'Transcript is disabled for this video'
      });
    }
    
    if (error.message.includes('No transcript found')) {
      return res.status(404).json({
        error: 'No transcript available for this video'
      });
    }

    res.status(500).json({
      error: 'Failed to fetch transcript',
      details: error.message
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    availableEndpoints: {
      'GET /': 'API information',
      'GET /api/transcript/:videoId': 'Get transcript by video ID',
      'POST /api/transcript': 'Get transcript by video URL'
    }
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 YouTube Transcript API server is running on port ${PORT}`);
  console.log(`📡 API endpoints:`);
  console.log(`   GET  http://localhost:${PORT}/api/transcript/:videoId`);
  console.log(`   POST http://localhost:${PORT}/api/transcript`);
});