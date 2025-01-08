// components/Header.tsx
"use client";
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Header = () => {
    return (
        <header className="bg-dark text-white p-1">
            <div className="container d-flex justify-content-between align-items-center">
                <h2 className="mb-0">Signal</h2>
                <div className="d-flex align-items-center">
                    <img
                        src="https://www.w3schools.com/howto/img_avatar.png"
                        alt="User Avatar"
                        className="rounded-circle"
                        style={{ width: '32px', height: '32px', marginRight: '10px' }}
                    />
                    <div>
                        <p className="mb-0">Hello, User</p>
                        <small>user@example.com</small>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
