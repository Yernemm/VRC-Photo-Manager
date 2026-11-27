import React from 'react';
import packageJson from '../../package.json';

function MainScreen({ setPage, uploadAll, setUploadAll, photo }) {
    return (
        <>
            <h1 className="centered">VRChat Photo Manager</h1>
            
            <div className="button-row">
                <button
                    className={uploadAll ? 'button active' : 'button'}
                    aria-pressed={uploadAll}
                    onClick={() => setUploadAll(!uploadAll)}
                >
                    Upload Automatically
                </button>
                <button className="button" onClick={() => setPage('gallery')}>Gallery</button>
                <button className="button" onClick={() => setPage('settings')}>Settings</button>
            </div>
            <div className="photo-frame">
                {photo && (
                    <img
                        src={photo}
                        alt="VRChat photo"
                        onLoad={(e) => { e.currentTarget.style.visibility = 'visible'; }}
                        onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }}
                    />
                )}
            </div>
            <div className="button-row">
                <button className="button">&lt;</button>
                <button className="button">&gt;</button>
            </div>
            <div className="button-row">
                <button className="button">Upload</button>
                <button className="button">Copy</button>
            </div>

            <p><b>Work in progress... </b> Made by Yernemm. v{packageJson.version}</p>
        </>
    );
}

export default MainScreen;
