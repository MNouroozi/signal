import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, TextField, Typography, IconButton, Slider } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import SendIcon from '@mui/icons-material/Send';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import io, { Socket } from 'socket.io-client';

let socket: Socket | null = null;

const ChatAudio: React.FC = () => {
// State hooks
const [serverIP, setServerIP] = useState<string>('');
const [serverPort, setServerPort] = useState<string>('');
const [isConnected, setIsConnected] = useState<boolean>(false);
const [textMessage, setTextMessage] = useState<string>('');
const [recording, setRecording] = useState<boolean>(false);
const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
const [audioURL, setAudioURL] = useState<string | null>(null);
const [audioPlaying, setAudioPlaying] = useState<boolean>(false);
const [volume, setVolume] = useState<number>(50);

// Audio recorder
const mediaRecorderRef = useRef<MediaRecorder | null>(null);
const audioRef = useRef<HTMLAudioElement | null>(null);

/**
 * اتصال به سرور با IP و Port مشخص شده
 */
const handleConnectServer = () => {
  if (!serverIP || !serverPort) {
    alert('لطفاً IP و Port سرور را وارد کنید.');
    return;
  }

  const serverUrl = `http://${serverIP}:${serverPort}/api/v1/sendMessage`;
  const message = "پیام تست برای ارسال به سرور UDP";  // پیام دلخواه شما

  fetch(serverUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: message,
    }),
  })
    .then(response => response.text())  // ابتدا به صورت text دریافت کنید
    .then(text => {
      console.log('Response Text:', text);
      try {
        const data = JSON.parse(text);  // تبدیل به JSON بعد از دریافت متن
        alert('پیام با موفقیت ارسال شد: ' + data.message);
      } catch (e) {
        console.error('Error parsing JSON:', e);
        alert('خطا در پاسخ از سرور.');
      }
    })
    .catch(error => {
      console.error('خطا در ارسال پیام:', error);
      alert('خطا در ارسال پیام');
    });
};

/**
 * Handle message input change
 */
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setTextMessage(e.target.value);
};

/**
 * Send message to server
 */
const handleSendMessage = () => {
  if (!textMessage) return;

  const message = { type: 0, data: textMessage };

  // ارسال پیام متنی به سرور از طریق fetch
  sendFetchMessage(message);
};

/**
 * Start recording audio
 */
const startRecording = async () => {
  setRecording(true);
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const mediaRecorder = new MediaRecorder(stream);
  mediaRecorderRef.current = mediaRecorder;

  const audioChunks: BlobPart[] = [];
  mediaRecorder.ondataavailable = (event) => {
    audioChunks.push(event.data);
  };

  mediaRecorder.onstop = () => {
    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
    setAudioBlob(audioBlob);
    setAudioURL(URL.createObjectURL(audioBlob));
  };

  mediaRecorder.start();
};

/**
 * Stop recording audio
 */
const stopRecording = () => {
  setRecording(false);
  if (mediaRecorderRef.current) {
    mediaRecorderRef.current.stop();
  }
};

/**
 * Play recorded audio
 */
const playAudio = () => {
  if (audioRef.current) {
    audioRef.current.play();
    setAudioPlaying(true);
  }
};

/**
 * Pause recorded audio
 */
const pauseAudio = () => {
  if (audioRef.current) {
    audioRef.current.pause();
    setAudioPlaying(false);
  }
};

/**
 * Send audio to server
 */
const sendAudio = () => {
  if (!audioBlob) return;

  const reader = new FileReader();
  reader.readAsArrayBuffer(audioBlob);
  reader.onloadend = () => {
    const audioArrayBuffer = reader.result as ArrayBuffer;
    const message = { type: 1, data: new Uint8Array(audioArrayBuffer) };

    // ارسال پیام صوتی به سرور از طریق fetch
    sendFetchMessage(message);
  };
};

// تابع برای ارسال پیام‌ها از طریق HTTP با استفاده از fetch
const sendFetchMessage = async (message: { type: number, data: any }) => {
    const serverUrl = 'http://localhost:3000/send-message';  // URL سرور شما
  
    const body = {
      type: message.type,
      data: message.type === 0 ? message.data : Array.from(message.data)  // اگر صوت بود، تبدیل به آرایه
    };
  
    try {
      const response = await fetch(serverUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
  
      if (!response.ok) {
        throw new Error(`خطا در ارسال پیام: وضعیت ${response.status}`);
      }
  
      const data = await response.json();
      console.log('پیام با موفقیت ارسال شد:', data);
    } catch (error) {
      console.error('خطا در ارسال پیام:', error);
    }
  };
  
/**
 * Handle volume change
 */
const handleVolumeChange = (event: Event, newValue: number | number[]) => {
  if (audioRef.current) {
    const volume = typeof newValue === 'number' ? newValue : newValue[0];
    setVolume(volume);
    audioRef.current.volume = volume / 100;
  }
};

return (
  <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <Typography variant="h4" mb={10}>
      Send message or voice
    </Typography>

    <Box sx={{ display: 'flex', mb: 2, gap: 2 }}>
      <TextField
        label="IP سرور"
        value={serverIP}
        onChange={(e) => setServerIP(e.target.value)}
      />
      <TextField
        label="Port سرور"
        value={serverPort}
        onChange={(e) => setServerPort(e.target.value)}
      />
      <Button variant="contained" onClick={handleConnectServer}>
        اتصال
      </Button>
    </Box>

    <Box sx={{ display: 'flex', width: '100%', mb: 2, gap: 2 }}>
      <TextField
        fullWidth
        label="پیام"
        value={textMessage}
        onChange={handleInputChange}
      />
      <Button
        variant="contained"
        color="primary"
        endIcon={<SendIcon />}
        onClick={handleSendMessage}
      >
        ارسال
      </Button>
    </Box>

    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
      {recording ? (
        <IconButton color="error" onClick={stopRecording}>
          <StopIcon fontSize="large" />
        </IconButton>
      ) : (
        <IconButton color="primary" onClick={startRecording}>
          <MicIcon fontSize="large" />
        </IconButton>
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={sendAudio}
        disabled={!audioBlob}
      >
        ارسال صدا
      </Button>
    </Box>

    {audioURL && (
      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2 }}>
        <audio ref={audioRef} src={audioURL} controls style={{ width: '100%' }} />
        <IconButton color="primary" onClick={playAudio} disabled={audioPlaying}>
          <PlayArrowIcon fontSize="large" />
        </IconButton>
        <IconButton color="secondary" onClick={pauseAudio} disabled={!audioPlaying}>
          <PauseIcon fontSize="large" />
        </IconButton>
      </Box>
    )}

    <Box sx={{ width: '100%', mt: 2 }}>
      <Typography>بلندی صدا</Typography>
      <Slider value={volume} onChange={handleVolumeChange} />
    </Box>
  </Box>
);
};

export default ChatAudio;
