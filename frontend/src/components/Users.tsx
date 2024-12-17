import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Paper, TextField, Box } from '@mui/material';
import axios from 'axios';

interface User {
  ID: string;
  email: string;
  name: string;
  CreatedAt: string;
  UpdatedAt: string;
}

const UsersTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<keyof User>('ID');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // گرفتن لیست کاربران از API
  useEffect(() => {
    axios.get('http://127.0.0.1:4000/api/v1/users')
      .then((response) => {
        console.log('داده‌های دریافت شده:', response.data); 
        if (Array.isArray(response.data)) {
          setUsers(response.data);
        } else {
          console.error('فرمت پاسخ معتبر نیست. باید آرایه‌ای از کاربران باشد.');
        }
      })
      .catch((error) => {
        console.error('خطا در گرفتن لیست کاربران:', error);
      });
  }, []);

  // کنترل مرتب‌سازی
  const handleRequestSort = (property: keyof User) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // مرتب‌سازی کاربران بر اساس ستون انتخاب شده
  const sortedUsers = [...users].filter(user => 
    Object.values(user).some(value => 
      value && value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  ).sort((a, b) => {
    if (orderBy === 'ID') {
      return order === 'asc' ? a.ID.localeCompare(b.ID) : b.ID.localeCompare(a.ID);
    } else if (orderBy === 'email') {
      return order === 'asc' ? a.email.localeCompare(b.email) : b.email.localeCompare(a.email);
    } else if (orderBy === 'name') {
      return order === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    } else {
      return 0;
    }
  });

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
              {['ID', 'Name', 'Email', 'CreatedAt', 'UpdatedAt'].map((column) => (
                <TableCell key={column}>
                  <TableSortLabel
                    active={orderBy === column.toLowerCase() as keyof User}
                    direction={orderBy === column.toLowerCase() as keyof User ? order : 'asc'}
                    onClick={() => handleRequestSort(column.toLowerCase() as keyof User)}
                  >
                    {column}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedUsers.map((user, index) => (
              <TableRow key={user.ID} sx={{ backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#ffffff' }}>
                <TableCell>{user.ID}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.CreatedAt}</TableCell>
                <TableCell>{user.UpdatedAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UsersTable;
