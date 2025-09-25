const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const speech = require('@google-cloud/speech');

// Function to extract audio from YouTube video and transcribe it
async function testTranscription(videoId) {
  try {
    console.log(`Starting transcription for video ID: ${videoId}`);
    
    // First, get the stream URL using yt-dlp
    const ytDlp = spawn('yt-dlp', [
      '-g',
      `https://www.youtube.com/watch?v=${videoId}`
    ]);
    
    let streamUrl = '';
    
    ytDlp.stdout.on('data', (data) => {
      streamUrl += data.toString();
    });
    
    ytDlp.stderr.on('data', (data) => {
      console.error(`yt-dlp error: ${data}`);
    });
    
    ytDlp.on('close', async (code) => {
      if (code !== 0) {
        console.error(`yt-dlp process exited with code ${code}`);
        return;
      }
      
      console.log('Stream URL obtained, extracting audio...');
      
      // Get the first URL (audio)
      const urls = streamUrl.trim().split('\n');
      const audioUrl = urls[0];
      
      // Create temp directory if it doesn't exist
      const tempDir = path.join(__dirname, 'temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
      }
      
      const outputFile = path.join(tempDir, `test-${Date.now()}.wav`);
      
      // Extract 30 seconds of audio from the stream
      ffmpeg(audioUrl)
        .audioFrequency(16000)
        .audioChannels(1)
        .format('wav')
        .duration(30)
        .on('error', (err) => {
          console.error('Error extracting audio:', err);
        })
        .on('end', async () => {
          console.log('Audio extracted successfully, starting transcription...');
          
          // Now transcribe the audio
          try {
            await transcribeAndPrint(outputFile);
            
            // Clean up the temp file
            fs.unlinkSync(outputFile);
            console.log('Temp file cleaned up');
          } catch (transcribeError) {
            console.error('Error transcribing audio:', transcribeError);
          }
        })
        .save(outputFile);
    });
  } catch (error) {
    console.error('Error in testTranscription:', error);
  }
}

// Function to transcribe audio and print the result
async function transcribeAndPrint(audioFilePath) {
  try {
    // Create a client
    const client = new speech.SpeechClient();
    
    // Read the audio file
    const file = fs.readFileSync(audioFilePath);
    const audioBytes = file.toString('base64');
    
    const audio = {
      content: audioBytes,
    };
    
    const config = {
      encoding: 'LINEAR16',
      sampleRateHertz: 16000,
      languageCode: 'en-US',
      model: 'latest_short',
      useEnhanced: true,
      enableAutomaticPunctuation: true,
      metadata: {
        industryNaicsCodeOfAudio: 523000, // Financial Investment Activities
      },
    };
    
    const request = {
      audio: audio,
      config: config,
    };
    
    console.log('Sending audio to Google Speech API...');
    
    // Transcribe the audio
    const [response] = await client.recognize(request);
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
    
    console.log('\n=== TRANSCRIPTION RESULT ===');
    console.log(transcription || 'No speech detected');
    console.log('=== END TRANSCRIPTION ===\n');
    
    // Also split into sentences and print them
    if (transcription) {
      const sentences = transcription.split(/[.!?]+/).filter(s => s.trim().length > 10);
      console.log('\n=== SENTENCES ===');
      sentences.forEach((sentence, index) => {
        console.log(`${index + 1}: ${sentence.trim()}`);
      });
      console.log('=== END SENTENCES ===\n');
    }
    
  } catch (error) {
    console.error('Error in transcription:', error);
  }
}

// Test with a video ID
// Usage: node test-transcription.js
const testVideoId = 'dp8PhLsUcFE'; // Bloomberg live stream
// const testVideoId = '9NyxcX3rhQs'; // CNBC live stream

console.log('Starting transcription test...');
testTranscription(testVideoId);