import React, { useEffect, useState } from 'react';

const { ipcRenderer } = require('electron');

function Settings({ setPage }) {
    const [webhook, setWebhook] = useState('');
    const [photopath, setPhotopath] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {
        let cancelled = false;
        ipcRenderer.invoke('get-config').then((cfg) => {
            if (cancelled || !cfg) return;
            setWebhook(cfg.webhook || '');
            setPhotopath(cfg.photopath || '');
        }).catch(() => {
           //nothin
        });
        return () => { cancelled = true; };
    }, []);

    async function save() {
        try {
            const cfg = await ipcRenderer.invoke('save-config', { webhook, photopath });
            if (!cfg) {
                setStatus('Could not save: the backend is not ready yet.');
                return;
            }
            setStatus('Saved. Restart the app for changes to apply.');
        } catch (e) {
            setStatus('Could not save: ' + e.message);
        }
    }

    return (
        <>
            <h1 className="centered">Settings</h1>

            <div className="settings-row">
                <label className="settings-label" htmlFor="webhook">Webhook:</label>
                <input
                    className="settings-input"
                    type="password"
                    id="webhook"
                    placeholder="Discord Webhook"
                    value={webhook}
                    onChange={(e) => setWebhook(e.target.value)}
                />
            </div>

            <div className="settings-row">
                <label className="settings-label" htmlFor="photopath">Photo Path:</label>
                <input
                    className="settings-input"
                    type="text"
                    id="photopath"
                    placeholder="C:\Users\Gamer\Pictures\VRChat or /home/gamer/Pictures/VRChat..."
                    value={photopath}
                    onChange={(e) => setPhotopath(e.target.value)}
                />
            </div>

            <div className="button-row">
                <button className="button" onClick={save}>Save Details</button>
                <button className="button" onClick={() => ipcRenderer.send('open-config')}>Open Config Folder</button>
            </div>

            <p>{status}</p>
            <p>Photo metadata is read from VRCX data embedded in each image.</p>
            <p>You may need to restart this program for changes to apply.</p>

            <div className="button-row">
                <button className="button" onClick={() => setPage('main')}>Back</button>
            </div>
        </>
    );
}

export default Settings;
