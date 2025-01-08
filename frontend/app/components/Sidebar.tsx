"use client";
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faUserShield, faDesktop, faCogs, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
    return (
        <div className="bg-dark text-white p-3" style={{ width: '250px', minHeight: '100vh' }}>
            <h4 className="text-center text-primary mb-4">
                <FontAwesomeIcon icon={faDesktop} className="me-2" />
                Dashboard
            </h4>

            {/* Menu for User Management */}
            <h5 className="text-info">Manage Users</h5>
            <ul className="list-unstyled">
                <li>
                    <a href="/dashboard/users" className="text-white d-flex align-items-center mb-3 p-2 rounded hover-bg-blue">
                        <FontAwesomeIcon icon={faUsers} className="me-3 text-warning" />
                        Users
                    </a>
                </li>
                <li>
                    <a href="/dashboard/groups" className="text-white d-flex align-items-center mb-3 p-2 rounded hover-bg-blue">
                        <FontAwesomeIcon icon={faUserShield} className="me-3 text-success" />
                        Groups
                    </a>
                </li>
            </ul>

            {/* Menu for Device Management */}
            <h5 className="text-info">Manage Devices</h5>
            <ul className="list-unstyled">
                <li>
                    <a href="/dashboard/devices" className="text-white d-flex align-items-center mb-3 p-2 rounded hover-bg-blue">
                        <FontAwesomeIcon icon={faDesktop} className="me-3 text-danger" />
                        Devices
                    </a>
                </li>
                <li>
                    <a href="/dashboard/device-setup" className="text-white d-flex align-items-center mb-3 p-2 rounded hover-bg-blue">
                        <FontAwesomeIcon icon={faCogs} className="me-3 text-warning" />
                        Setup Devices
                    </a>
                </li>
            </ul>

            {/* Logout Button */}
            <div className="mt-5">
                <a href="/logout" className="text-white d-flex align-items-center mb-3 p-2 rounded hover-bg-red">
                    <FontAwesomeIcon icon={faSignOutAlt} className="me-3 text-info" />
                    Logout
                </a>
            </div>
        </div>
    );
};

export default Sidebar;
