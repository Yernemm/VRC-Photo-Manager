import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Terminal } from '@xterm/xterm';
import '@xterm/xterm/css/xterm.css';
import './index.css';
import MainScreen from './UI/mainScreen.jsx';
import Settings from './UI/settings.jsx';

const { ipcRenderer, shell } = require('electron');

function Placeholder({ label, setPage }) {
    return (
        <>
            <p className="centered">{label} coming soon...</p>
            <div className="button-row">
                <button className="button" onClick={() => setPage('main')}>Back</button>
            </div>
        </>
    );
}

function App() {
    const [page, setPage] = useState('main');
    const [uploadAll, setUploadAll] = useState(true);
    const [photo, setPhoto] = useState(null);

    useEffect(() => {
        ipcRenderer.send('ready');
    }, []);

    // upload restore
    useEffect(() => {
        ipcRenderer.invoke('get-config').then((cfg) => {
            if (cfg) setUploadAll(cfg.autoUpload !== false);
        }).catch(() => {

        });
    }, []);

    // upload toggle
    function toggleAutoUpload(enabled) {
        setUploadAll(enabled);
        ipcRenderer.invoke('set-auto-upload', enabled).catch(() => {});
    }

    // image preview
    useEffect(() => {
        const onPhoto = (event, detected) => setPhoto(detected);
        ipcRenderer.on('photo-detected', onPhoto);
        return () => ipcRenderer.removeListener('photo-detected', onPhoto);
    }, []);

    switch (page) {
        case 'gallery':
            return <Placeholder label="Gallery" setPage={setPage} />;
        case 'settings':
            return <Settings setPage={setPage} />;
        default:
            return (
                <MainScreen
                    setPage={setPage}
                    uploadAll={uploadAll}
                    setUploadAll={toggleAutoUpload}
                    photo={photo && photo.dataUrl}
                />
            );
    }
}

createRoot(document.getElementById('root')).render(<App />);
