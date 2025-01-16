"use client";
import React, { useState } from "react";
import { FaHome, FaUser, FaCog, FaFileAlt, FaChartPie, FaBars, FaAngleDown, FaAngleLeft, FaSun, FaMoon } from "react-icons/fa";
import Link from "next/link";

const Dashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({});
    const [currentPath, setCurrentPath] = useState("Home");
    const [rtl, setRtl] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    const items = [
        { name: "Home", icon: FaHome, link: "/dashboard/home" },
        { name: "Users", icon: FaUser, link: "/dashboard/users" },
        { name: "Settings", icon: FaCog, link: "/dashboard/settings" },
        {
            name: "Reports",
            icon: FaFileAlt,
            link: "/dashboard/reports",
            subItems: [
                { name: "Sales", link: "/dashboard/reports/sales" },
                { name: "Expenses", link: "/dashboard/reports/expenses" },
            ],
        },
        { name: "Analytics", icon: FaChartPie, link: "/dashboard/analytics" },
    ];

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const toggleSubItems = (itemName: string) => {
        setOpenItems((prev) => ({ ...prev, [itemName]: !prev[itemName] }));
    };

    const toggleRtl = () => setRtl(!rtl);
    const toggleDarkMode = () => setDarkMode(!darkMode);

    return (
        <div
            className={`min-h-screen flex transition-all ${rtl ? "direction-rtl" : "direction-ltr"
                } ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}
        >
            {/* Sidebar */}
            <div
                className={`bg-gray-800 text-white ${sidebarOpen ? "w-64" : "w-16"
                    } flex flex-col transition-all duration-300`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
                    <span className={`text-2xl font-bold ${sidebarOpen ? "block" : "hidden"}`}>Dashboard</span>
                    <button onClick={toggleSidebar} className="text-xl focus:outline-none">
                        <FaBars />
                    </button>
                </div>

                <nav className="flex-grow">
                    <ul className="space-y-2">
                        {items.map((item, index) => (
                            <li key={index}>
                                <div
                                    className="flex items-center justify-between px-4 py-2 hover:bg-gray-700 cursor-pointer"
                                    onClick={() => {
                                        toggleSubItems(item.name);
                                        setCurrentPath(item.name);
                                    }}
                                >
                                    <div className="flex items-center">
                                        <item.icon className="mr-3" />
                                        <span className={`${sidebarOpen ? "block" : "hidden"}`}>{item.name}</span>
                                    </div>
                                    {item.subItems && (
                                        <span>
                                            {openItems[item.name] ? <FaAngleDown /> : <FaAngleLeft />}
                                        </span>
                                    )}
                                </div>
                                {item.subItems && openItems[item.name] && sidebarOpen && (
                                    <ul className="ml-8 space-y-1">
                                        {item.subItems.map((subItem, subIndex) => (
                                            <li key={subIndex}>
                                                <Link
                                                    href={subItem.link}
                                                    className="block px-4 py-1 hover:bg-gray-700"
                                                    onClick={() => setCurrentPath(`${item.name} / ${subItem.name}`)}
                                                >
                                                    {subItem.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-grow p-1">
                <header className="flex items-center justify-between mb-6 bg-white dark:bg-gray-800 p-4 shadow-md">
                    <div className="flex items-center space-x-4">
                        <img
                            src="https://via.placeholder.com/40"
                            alt="User Avatar"
                            className="w-10 h-10 rounded-full"
                        />
                        <div>
                            <h2 className="text-sm font-mono">User Name</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-300">
                                Current Path: {currentPath}
                            </p>
                        </div>
                    </div>
                    <div className="flex space-x-4">
                        <button onClick={toggleRtl} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                            {rtl ? "LTR" : "RTL"}
                        </button>
                        <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                            {darkMode ? <FaSun /> : <FaMoon />}
                        </button>
                    </div>
                </header>

                <h1 className="text-3xl font-semibold mb-4">Welcome to the Dashboard</h1>
                <p>Here you can manage your application.</p>
            </div>
        </div>
    );
};

export default Dashboard;
