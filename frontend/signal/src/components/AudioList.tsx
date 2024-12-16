import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Paper, TextField } from '@mui/material';

// مدل داده‌های صوتی
interface Audio {
  id: string;
  client_id: string;
  ip: string;
  port: number;
  duration: number;
  createdAt: string;
  updatedAt: string;
  data: string; // داده‌های صوتی به صورت Base64
}

const AudioTable: React.FC = () => {
  const [audioFiles, setAudioFiles] = useState<Audio[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<keyof Audio>('id');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // گرفتن لیست فایل‌های صوتی از API
  useEffect(() => {
    axios.get('http://127.0.0.1:4000/audios')
      .then((response) => {
        if (Array.isArray(response.data)) {
          // داده‌های دریافتی را تنظیم می‌کنیم
          const formattedData = response.data.map((audio: any) => ({
            id: audio.id,
            client_id: audio.client_id,
            ip: audio.ip,
            port: audio.port,
            duration: audio.duration,
            createdAt: audio.createdAt,
            updatedAt: audio.updatedAt,
            data: audio.data, // داده‌های Base64
          }));
          setAudioFiles(formattedData);
        } else {
          console.error('فرمت پاسخ معتبر نیست. باید آرایه‌ای از فایل‌های صوتی باشد.', response.data);
          setAudioFiles([]);
        }
      })
      .catch((error) => {
        console.error('خطا در گرفتن لیست فایل‌های صوتی:', error);
        setAudioFiles([]);
      });
  }, []);

  // کنترل مرتب‌سازی
  const handleRequestSort = (property: keyof Audio) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // مرتب‌سازی و فیلتر فایل‌های صوتی
  const sortedAudioFiles = [...audioFiles]
    .filter(audio =>
      Object.values(audio).some(value =>
        value && value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
    .sort((a, b) => {
      const aValue = a[orderBy] || '';
      const bValue = b[orderBy] || '';

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return order === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        return order === 'asc' ? aValue - bValue : bValue - aValue;
      } else {
        return 0;
      }
    });

  // ذخیره داده صوتی به فایل
  const handleDownload = (audio: Audio) => {
    try {
      const decodedData = atob(audio.data); // تبدیل Base64 به باینری
      const uintArray = new Uint8Array(decodedData.split("").map(c => c.charCodeAt(0)));
      const blob = new Blob([uintArray], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const filename = `audio_${audio.id}_${audio.createdAt}.mp3`.replace(/:/g, '-');
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("خطا در دیکد کردن Base64:", error);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <TableContainer component={Paper} sx={{ maxWidth: 1200, width: '100%' }}>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
          <TextField
            label="جستجو"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ mb: 2 }}
          />
        </Box>
        <Table>
          <TableHead>
            <TableRow>
              {['id', 'client_id', 'ip', 'port', 'duration', 'createdAt', 'updatedAt', 'Player', 'Download'].map((column) => (
                <TableCell key={column}>
                  <TableSortLabel
                    active={orderBy === column.toLowerCase() as keyof Audio}
                    direction={orderBy === column.toLowerCase() as keyof Audio ? order : 'asc'}
                    onClick={() => handleRequestSort(column.toLowerCase() as keyof Audio)}
                  >
                    {column}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedAudioFiles.map((audio, index) => (
              <TableRow key={audio.id || index} sx={{ backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#ffffff' }}>
                <TableCell>{audio.id}</TableCell>
                <TableCell>{audio.client_id}</TableCell>
                <TableCell>{audio.ip}</TableCell>
                <TableCell>{audio.port}</TableCell>
                <TableCell>{audio.duration ? audio.duration.toFixed(2) : '0.00'} ثانیه</TableCell>
                <TableCell>{audio.createdAt}</TableCell>
                <TableCell>{audio.updatedAt}</TableCell>

                {/* پلیر صوتی */}
                <TableCell>
                  <audio controls style={{ width: '150px' }}>
                    <source
                      src={`data:audio/mpeg;base64,${audio.data}`}
                      type="audio/mpeg"
                    />
                    مرورگر شما از این نوع فایل پشتیبانی نمی‌کند.
                  </audio>
                </TableCell>

                {/* دکمه دانلود */}
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleDownload(audio)}
                  >
                    دانلود
                  </Button>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AudioTable;
