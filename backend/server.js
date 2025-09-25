const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');

const app = express();
const PORT = process.env.PORT || 5000;

// Set FFmpeg path
ffmpeg.setFfmpegPath(ffmpegStatic);

// Video channels configuration
const CHANNELS = {
  cnbc: {
    name: "CNBC",
    videoId: "9NyxcX3rhQs",
    description: "CNBC Live Stream"
  },
};

// Default channel for auto-processing
const DEFAULT_CHANNEL = 'cnbc';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve static files for browser translator

// Test route to transcribe YouTube live stream
app.post('/api/transcribe', async (req, res) => {
  try {
    const { videoId, channelName } = req.body;
    
    if (!videoId && !channelName) {
      return res.status(400).json({ 
        error: 'Either videoId or channelName is required',
        availableChannels: Object.keys(CHANNELS)
      });
    }
    
    let targetVideoId = videoId;
    let targetChannelName = channelName;
    
    // If channelName is provided, get videoId from CHANNELS
    if (channelName && CHANNELS[channelName]) {
      targetVideoId = CHANNELS[channelName].videoId;
      targetChannelName = CHANNELS[channelName].name;
    }
    
    if (!targetVideoId) {
      return res.status(400).json({ 
        error: 'Invalid channel name',
        availableChannels: Object.keys(CHANNELS)
      });
    }
    
    console.log(`🎬 Starting transcription for: ${targetChannelName || 'Unknown'} (${targetVideoId})`);
    
    // Process the video
    processYouTubeLiveStream(targetVideoId, targetChannelName);
    
    res.status(200).json({ 
      message: 'Transcription started', 
      videoId: targetVideoId,
      channelName: targetChannelName,
      availableChannels: Object.keys(CHANNELS)
    });
  } catch (error) {
    console.error('Error starting transcription:', error);
    res.status(500).json({ error: 'Failed to start transcription' });
  }
});

// New endpoint to serve audio file for browser transcription
app.get('/api/audio/:filename', (req, res) => {
  const filename = req.params.filename;
  const audioPath = path.join(__dirname, 'temp', filename);
  
  if (fs.existsSync(audioPath)) {
    res.sendFile(audioPath);
  } else {
    res.status(404).json({ error: 'Audio file not found' });
  }
});

// New endpoint to receive transcription from browser
app.post('/api/transcription-result', (req, res) => {
  const { transcription, channelName, audioFilename } = req.body;
  
  console.log('\n' + '='.repeat(60));
  console.log(`📝 BROWSER TRANSCRIPTION FROM ${channelName.toUpperCase()}:`);
  console.log('='.repeat(60));
  console.log(transcription || 'No speech detected');
  console.log(`🕒 ${new Date().toLocaleTimeString()}`);
  console.log('='.repeat(60) + '\n');
  
  // Clean up the audio file
  const audioPath = path.join(__dirname, 'temp', audioFilename);
  if (fs.existsSync(audioPath)) {
    try {
      fs.unlinkSync(audioPath);
      console.log('🧹 Audio file cleaned up');
    } catch (error) {
      console.log('⚠️ Could not clean up audio file');
    }
  }
  
  res.json({ success: true, message: 'Transcription received' });
});

// Serve the browser transcription page
app.get('/transcribe', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Browser Speech Recognition</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f0f0f0; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; }
        .status { padding: 10px; margin: 10px 0; border-radius: 5px; }
        .success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
        .warning { background: #fff3cd; color: #856404; border: 1px solid #ffeaa7; }
        button { padding: 10px 20px; margin: 5px; border: none; border-radius: 5px; cursor: pointer; }
        .btn-primary { background: #007bff; color: white; }
        .btn-success { background: #28a745; color: white; }
        .btn-danger { background: #dc3545; color: white; }
        #result { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 10px 0; min-height: 100px; }
        audio { width: 100%; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎤 Browser Speech Recognition</h1>
        <div id="status" class="status warning">Ready to transcribe audio files</div>
        
        <div>
            <button id="checkAudio" class="btn-primary">🔍 Check for New Audio</button>
            <button id="startTranscription" class="btn-success" disabled>🎙️ Start Transcription</button>
            <button id="stopTranscription" class="btn-danger" disabled>⏹️ Stop</button>
        </div>
        
        <audio id="audioPlayer" controls style="display: none;"></audio>
        <div id="result"></div>
        
        <div style="margin-top: 20px;">
            <h3>Instructions:</h3>
            <ol>
                <li>Click "Check for New Audio" to look for audio files</li>
                <li>When audio is found, click "Start Transcription"</li>
                <li>The browser will transcribe the audio using Web Speech API</li>
                <li>Transcription will be sent back to the server</li>
            </ol>
        </div>
    </div>

    <script>
        let recognition;
        let currentAudioFilename = '';
        let isTranscribing = false;

        // Check if browser supports speech recognition
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';
        } else {
            document.getElementById('status').innerHTML = '❌ Speech Recognition not supported in this browser. Use Chrome/Edge.';
            document.getElementById('status').className = 'status error';
        }

        document.getElementById('checkAudio').addEventListener('click', checkForAudio);
        document.getElementById('startTranscription').addEventListener('click', startTranscription);
        document.getElementById('stopTranscription').addEventListener('click', stopTranscription);

        async function checkForAudio() {
            try {
                document.getElementById('status').innerHTML = '🔍 Checking for new audio files...';
                document.getElementById('status').className = 'status warning';
                
                const response = await fetch('/api/check-audio');
                const data = await response.json();
                
                if (data.audioFile) {
                    currentAudioFilename = data.audioFile;
                    document.getElementById('status').innerHTML = \`✅ Audio file found: \${data.channelName}\`;
                    document.getElementById('status').className = 'status success';
                    
                    // Load audio for playback (optional)
                    const audioPlayer = document.getElementById('audioPlayer');
                    audioPlayer.src = \`/api/audio/\${currentAudioFilename}\`;
                    audioPlayer.style.display = 'block';
                    
                    document.getElementById('startTranscription').disabled = false;
                } else {
                    document.getElementById('status').innerHTML = '⏳ No new audio files. Click again to check.';
                    document.getElementById('status').className = 'status warning';
                    document.getElementById('startTranscription').disabled = true;
                }
            } catch (error) {
                document.getElementById('status').innerHTML = '❌ Error checking for audio files';
                document.getElementById('status').className = 'status error';
            }
        }

        function startTranscription() {
            if (!recognition || !currentAudioFilename) return;
            
            isTranscribing = true;
            document.getElementById('startTranscription').disabled = true;
            document.getElementById('stopTranscription').disabled = false;
            document.getElementById('status').innerHTML = '🎙️ Listening and transcribing...';
            document.getElementById('status').className = 'status success';
            
            let finalTranscript = '';
            
            recognition.onresult = function(event) {
                let interimTranscript = '';
                
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript + ' ';
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }
                
                document.getElementById('result').innerHTML = 
                    '<strong>Final:</strong> ' + finalTranscript + 
                    '<br><strong>Interim:</strong> ' + interimTranscript;
            };
            
            recognition.onerror = function(event) {
                document.getElementById('status').innerHTML = '❌ Recognition error: ' + event.error;
                document.getElementById('status').className = 'status error';
                stopTranscription();
            };
            
            recognition.onend = function() {
                if (isTranscribing && finalTranscript.trim()) {
                    sendTranscriptionToServer(finalTranscript.trim());
                }
            };
            
            // Play the audio and start recognition
            const audioPlayer = document.getElementById('audioPlayer');
            audioPlayer.play();
            recognition.start();
            
            // Auto-stop after 30 seconds (adjust as needed)
            setTimeout(() => {
                if (isTranscribing) {
                    stopTranscription();
                }
            }, 30000);
        }

        function stopTranscription() {
            if (recognition) {
                recognition.stop();
            }
            isTranscribing = false;
            document.getElementById('startTranscription').disabled = false;
            document.getElementById('stopTranscription').disabled = true;
            document.getElementById('status').innerHTML = '⏹️ Transcription stopped';
            document.getElementById('status').className = 'status warning';
        }

        async function sendTranscriptionToServer(transcription) {
            try {
                const response = await fetch('/api/transcription-result', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        transcription: transcription,
                        channelName: 'CNBC',
                        audioFilename: currentAudioFilename
                    })
                });
                
                if (response.ok) {
                    document.getElementById('status').innerHTML = '✅ Transcription sent to server!';
                    document.getElementById('status').className = 'status success';
                } else {
                    throw new Error('Failed to send transcription');
                }
            } catch (error) {
                document.getElementById('status').innerHTML = '❌ Failed to send transcription to server';
                document.getElementById('status').className = 'status error';
            }
        }

        // Auto-check for audio every 10 seconds
        setInterval(checkForAudio, 10000);
        
        // Initial check
        checkForAudio();
    </script>
</body>
</html>
  `);
});

// New endpoint to check for available audio files
app.get('/api/check-audio', (req, res) => {
  const tempDir = path.join(__dirname, 'temp');
  
  if (!fs.existsSync(tempDir)) {
    return res.json({ audioFile: null, message: 'No audio files available' });
  }
  
  const files = fs.readdirSync(tempDir).filter(file => file.endsWith('.wav'));
  
  if (files.length > 0) {
    // Get the most recent file
    const latestFile = files.sort((a, b) => {
      const statA = fs.statSync(path.join(tempDir, a));
      const statB = fs.statSync(path.join(tempDir, b));
      return statB.mtime - statA.mtime;
    })[0];
    
    res.json({ 
      audioFile: latestFile,
      channelName: latestFile.split('-')[0].toUpperCase(),
      message: 'Audio file ready for transcription'
    });
  } else {
    res.json({ audioFile: null, message: 'No audio files available' });
  }
});

// Get available channels
app.get('/api/channels', (req, res) => {
  const channelList = Object.entries(CHANNELS).map(([key, channel]) => ({
    key,
    name: channel.name,
    videoId: channel.videoId,
    description: channel.description
  }));
  
  res.json({
    channels: channelList,
    defaultChannel: DEFAULT_CHANNEL
  });
});

// Function to extract audio from YouTube live stream and process it
async function processYouTubeLiveStream(videoId, channelName = 'Unknown') {
  try {
    console.log(`🎥 Processing ${channelName} (${videoId})`);
    
    // Use yt-dlp to get stream URL
    const ytDlp = spawn('python', [
      '-m', 'yt_dlp',
      '-g',
      `https://www.youtube.com/watch?v=${videoId}`
    ]);
    
    let streamUrl = '';
    
    ytDlp.stdout.on('data', (data) => {
      streamUrl += data.toString();
    });
    
    ytDlp.stderr.on('data', (data) => {
      console.error(`❌ yt-dlp error: ${data}`);
    });
    
    ytDlp.on('close', async (code) => {
      if (code !== 0) {
        console.error(`❌ yt-dlp process exited with code ${code}`);
        return;
      }
      
      console.log(`✅ Stream URL obtained for ${channelName}`);
      
      // Get the first URL (audio)
      const urls = streamUrl.trim().split('\n');
      const audioUrl = urls[0];
      
      if (!audioUrl || audioUrl.length < 10) {
        console.error('❌ No valid audio URL found');
        return;
      }
      
      // Create temp directory if it doesn't exist
      const tempDir = path.join(__dirname, 'temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
      }
      
      const outputFile = path.join(tempDir, `${channelName.toLowerCase().replace(/\s+/g, '_')}-${Date.now()}.wav`);
      
      console.log(`🎵 Extracting audio from ${channelName}...`);
      
      // Extract 30 seconds of audio from the stream
      ffmpeg(audioUrl)
        .audioFrequency(16000)
        .audioChannels(1)
        .format('wav')
        .duration(30)
        .on('error', (err) => {
          console.error('❌ Error extracting audio:', err.message);
        })
        .on('start', (commandLine) => {
          console.log(`🎬 FFmpeg started for ${channelName}`);
        })
        .on('progress', (progress) => {
          if (progress.percent) {
            console.log(`⏳ Processing ${channelName}: ${Math.round(progress.percent)}% done`);
          }
        })
        .on('end', async () => {
          console.log(`✅ Audio extracted from ${channelName}`);
          
          // Check if file exists and has content
          if (fs.existsSync(outputFile)) {
            const stats = fs.statSync(outputFile);
            console.log(`📊 Audio file size: ${stats.size} bytes`);
            
            if (stats.size > 1000) {
              console.log(`🌐 Audio ready for browser transcription: ${path.basename(outputFile)}`);
              console.log(`💡 Open http://localhost:${PORT}/transcribe to start browser transcription`);
            } else {
              console.error('❌ Audio file too small, likely empty');
              // Clean up empty file
              try {
                fs.unlinkSync(outputFile);
              } catch (e) {
                console.error('Could not delete empty file');
              }
            }
          } else {
            console.error('❌ Audio file was not created');
          }
        })
        .save(outputFile);
    });
  } catch (error) {
    console.error('❌ Error processing YouTube live stream:', error);
  }
}

// Auto-process the default channel every 3 minutes
setInterval(() => {
  const channel = CHANNELS[DEFAULT_CHANNEL];
  if (channel) {
    console.log(`🔄 Auto-processing ${channel.name}...`);
    processYouTubeLiveStream(channel.videoId, channel.name);
  }
}, 3 * 60 * 1000); // Every 3 minutes

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`\n📺 Available Channels:`);
  Object.entries(CHANNELS).forEach(([key, channel]) => {
    console.log(`   ${key}: ${channel.name} (${channel.videoId})`);
  });
  console.log(`\n🎯 API Endpoints:`);
  console.log(`   GET  /api/channels - List all available channels`);
  console.log(`   POST /api/transcribe - Start transcription`);
  console.log(`   GET  /transcribe - Browser transcription interface`);
  console.log(`\n🌐 Browser Transcription: http://localhost:${PORT}/transcribe`);
});