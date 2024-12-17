import { NextApiRequest, NextApiResponse } from 'next';
import dgram from 'dgram';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }

  const client = dgram.createSocket('udp4');
  const serverAddress = '127.0.0.1'; // Change this to your server address
  const serverPort = 5000; // Change this to match your server port

  const messageType = req.body.type;
  let messageBuffer: Buffer;

  if (messageType === 0) {
    // Text message
    const textMessage = req.body.data;
    messageBuffer = Buffer.from(textMessage, 'utf-8');
  } else if (messageType === 1) {
    // Audio message (ArrayBuffer)
    const audioData = new Uint8Array(req.body.data);
    messageBuffer = Buffer.from(audioData);
  } else {
    res.status(400).json({ message: 'Invalid message type' });
    return;
  }

  client.send(messageBuffer, 0, messageBuffer.length, serverPort, serverAddress, (err) => {
    client.close();
    if (err) {
      res.status(500).json({ message: 'Failed to send UDP message' });
    } else {
      res.status(200).json({ message: 'Message sent successfully' });
    }
  });
}
