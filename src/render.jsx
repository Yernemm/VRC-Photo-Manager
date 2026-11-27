import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Terminal } from '@xterm/xterm';
import '@xterm/xterm/css/xterm.css';
import './index.css';
import packageJson from '../package.json';

const { ipcRenderer, shell } = require('electron');

function App() {


    return (
        <>
            <h1 className="centered">VRChat Photo Manager</h1>

            <p><b>Work in progress... </b> Made by Yernemm. v{packageJson.version}</p>
        </>
    );
}

createRoot(document.getElementById('root')).render(<App />);
