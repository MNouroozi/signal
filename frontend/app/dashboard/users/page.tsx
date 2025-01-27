"use client"
import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, TableSortLabel, TextField, Button, CircularProgress, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

type User = {
    ID: string;
    name: string;
    email: string;
};

const Users = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [orderBy, setOrderBy] = useState<'name' | 'email' | 'ID'>('name');
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');
    const [filter, setFilter] = useState('');
    const [newUser, setNewUser] = useState({ name: '', email: '' });
    const [editingUser, setEditingUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:4000/api/v1/users');
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }
                const data = await response.json();
                setUsers(data);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleSort = (property: 'name' | 'email' | 'ID') => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handlePageChange = (_: any, newPage: number) => setPage(newPage);
    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(filter.toLowerCase())
    );

    const handleAddUser = () => {
        const newUserEntry = { ID: (users.length + 1).toString(), ...newUser };
        setUsers([...users, newUserEntry]);
        setNewUser({ name: '', email: '' });
    };

    const handleEditUser = (user: User) => {
        setEditingUser(user);
    };

    const handleSaveEdit = () => {
        if (editingUser) {
            setUsers(users.map((user) => (user.ID === editingUser.ID ? editingUser : user)));
            setEditingUser(null);
        }
    };

    return (
        <>
            <TableContainer component={Paper}>
                <TextField
                    label="Search"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />
                {loading ? (
                    <CircularProgress style={{ display: 'block', margin: '20px auto' }} />
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'name'}
                                        direction={order}
                                        onClick={() => handleSort('name')}
                                    >
                                        Name
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>ID</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
                                    <TableRow key={user.ID}>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.ID}</TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => handleEditUser(user)}>
                                                <EditIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        Empty Table
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredUsers.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                />
            </TableContainer>
            <Paper sx={{ padding: 2, marginTop: 2 }}>
                <TextField
                    label="Name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={editingUser ? editingUser.name : newUser.name}
                    onChange={(e) =>
                        editingUser
                            ? setEditingUser({ ...editingUser, name: e.target.value })
                            : setNewUser({ ...newUser, name: e.target.value })
                    }
                />
                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={editingUser ? editingUser.email : newUser.email}
                    onChange={(e) =>
                        editingUser
                            ? setEditingUser({ ...editingUser, email: e.target.value })
                            : setNewUser({ ...newUser, email: e.target.value })
                    }
                />
                <Button variant="contained" color="primary" onClick={editingUser ? handleSaveEdit : handleAddUser}>
                    {editingUser ? 'Save' : 'Add User'}
                </Button>
            </Paper>
        </>
    );
};

export default Users;
