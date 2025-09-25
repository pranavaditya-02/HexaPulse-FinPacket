const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const speech = require('@google-cloud/speech');

// Get video ID from command line arguments
const videoId = process.argv[2];

if (!videoId) {
  console.log('Usage: node transcribe-video.js <VIDEO_ID>');
  console.log('Example: node transcribe-video.js dp8PhLsUcFE');
  process.exit(1);
}

async function transcribeVideo(videoId) {
  try {
    console.log(`🎥 Starting transcription for video ID: ${videoId}`);
    console.log(`🔗 URL: https://www.youtube.com/watch?v=${videoId}`);
    
    const ytDlp = spawn('yt-dlp', ['-g', `https://www.youtube.com/watch?v=${videoId}`]);
    
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
      
      console.log('✅ Stream URL obtained');
      console.log('🎵 Extracting audio...');
      
      const urls = streamUrl.trim().split('\n');
      const audioUrl = urls[0];
      
      const tempDir = path.join(__dirname, 'temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
      }
      
      const outputFile = path.join(tempDir, `transcribe-${Date.now()}.wav`);
      
      ffmpeg(audioUrl)
        .audioFrequency(16000)
        .audioChannels(1)
        .format('wav')
        .duration(30)
        .on('error', (err) => {
          console.error('❌ Error extracting audio:', err);
        })
        .on('end', async () => {
          console.log('✅ Audio extracted');
          console.log('🗣️  Starting transcription...');
          
          try {
            const client = new speech.SpeechClient();
            const file = fs.readFileSync(outputFile);
            const audioBytes = file.toString('base64');
            
            const request = {
              audio: { content: audioBytes },
              config: {
                encoding: 'LINEAR16',
                sampleRateHertz: 16000,
                languageCode: 'en-US',
                model: 'latest_short',
                useEnhanced: true,
                enableAutomaticPunctuation: true,
              },
            };
            
            const [response] = await client.recognize(request);
            const transcription = response.results
              .map(result => result.alternatives[0].transcript)
              .join('\n');
            
            console.log('\n' + '='.repeat(50));
            console.log('📝 TRANSCRIPTION RESULT');
            console.log('='.repeat(50));
            console.log(transcription || 'No speech detected');
            console.log('='.repeat(50) + '\n');
            
            // Clean up
            fs.unlinkSync(outputFile);
            console.log('🧹 Temp file cleaned up');
            console.log('✅ Process completed!');
            
          } catch (transcribeError) {
            console.error('❌ Error transcribing audio:', transcribeError);
          }
        })
        .save(outputFile);
    });
  } catch (error) {
    console.error('❌ Error in transcribeVideo:', error);
  }
}

transcribeVideo(videoId);