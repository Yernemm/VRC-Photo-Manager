const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { Readable } = require('stream');
const { pipeline } = require('stream/promises');
const { spawn } = require('child_process');

const { isNewer, currentVersion } = require('./updatecheck');

const RELEASE_DOWNLOAD_PREFIX = "https://github.com/Yernemm/VRC-Photo-Manager/releases/download/";

// $APPIMAGE is set by the AppImage runtime to the file that was launched.
function appImagePath(){
    return process.platform === 'linux' && process.env.APPIMAGE ? process.env.APPIMAGE : null;
}

// True when we are running from an AppImage whose folder we can write to.
function canSelfUpdate(){
    let file = appImagePath();
    if(!file) return false;
    try {
        fs.accessSync(path.dirname(file), fs.constants.W_OK);
        fs.accessSync(file, fs.constants.W_OK);
        return true;
    } catch {
        return false;
    }
}

function pendingPaths(file){
    return { download: file + ".download", ready: file + ".new", meta: file + ".new.json", old: file + ".old" };
}

function remove(file){
    try { fs.rmSync(file, { force: true }); } catch {}
}


// Call at startup, before any window is created, swaps in the updated ver
function applyPendingUpdate(){
    let file = appImagePath();
    if(!file) return false;
    let p = pendingPaths(file);
    if(!fs.existsSync(p.ready)) return false;

    try {
        let meta = JSON.parse(fs.readFileSync(p.meta, "utf8"));
        if(!isNewer(meta.version, currentVersion)){
            // Stale: the user already updated by other means.
            remove(p.ready); remove(p.meta);
            return false;
        }

        fs.chmodSync(p.ready, 0o755);
        remove(p.old);
        fs.renameSync(file, p.old);
        try {
            fs.renameSync(p.ready, file);
        } catch(e) {
            fs.renameSync(p.old, file); // put the working version back
            throw e;
        }
        remove(p.meta);

        spawn(file, process.argv.slice(1), { detached: true, stdio: "ignore" }).unref();
        return true;
    } catch(e) {
        console.log("[UPDATER] Could not apply pending update: " + e.message);
        return false;
    }
}

// Once the new version has started fine, the backup is no longer needed.
function cleanupOldVersion(){
    let file = appImagePath();
    if(file) remove(pendingPaths(file).old);
}

async function fetchChecked(url, baseUrl){
    if(!url.startsWith(baseUrl)) throw new Error("Refusing to download from " + url);
    let res = await fetch(url, { headers: { "User-Agent": "VRCPM-update-check" } });
    if(!res.ok) throw new Error(`Download failed (HTTP ${res.status})`);
    return res;
}

// update: { version, assets } from updatecheck. Resolves true once a verified
// update is staged; throws otherwise. baseUrl only exists so tests can point
// it at a local server.
async function downloadUpdate(update, baseUrl = RELEASE_DOWNLOAD_PREFIX){
    let file = appImagePath();
    if(!file || !canSelfUpdate()) throw new Error("Not running from a writable AppImage");
    let p = pendingPaths(file);

    // Already staged (e.g. downloaded on a previous launch)?
    try {
        let meta = JSON.parse(fs.readFileSync(p.meta, "utf8"));
        if(fs.existsSync(p.ready) && !isNewer(update.version, meta.version)) return true;
    } catch {}

    let assets = update.assets || [];
    let image = assets.find(a => /\.AppImage$/i.test(a.name));
    if(!image) throw new Error("Release has no AppImage asset");
    let sumAsset = assets.find(a => a.name === image.name + ".sha256");
    if(!sumAsset) throw new Error("Release has no checksum for the AppImage");

    let sumText = await (await fetchChecked(sumAsset.browser_download_url, baseUrl)).text();
    let expected = (sumText.trim().split(/\s+/)[0] || "").toLowerCase();
    if(!/^[0-9a-f]{64}$/.test(expected)) throw new Error("Checksum file is not a SHA-256 hash");

    remove(p.download);
    let res = await fetchChecked(image.browser_download_url, baseUrl);
    let hash = crypto.createHash("sha256");
    let hashing = async function*(source){
        for await (let chunk of source){ hash.update(chunk); yield chunk; }
    };
    try {
        await pipeline(Readable.fromWeb(res.body), hashing, fs.createWriteStream(p.download, { mode: 0o755 }));
        if(hash.digest("hex") !== expected) throw new Error("Checksum mismatch; discarding download");
        remove(p.ready);
        fs.renameSync(p.download, p.ready);
        fs.writeFileSync(p.meta, JSON.stringify({ version: update.version }));
    } catch(e) {
        remove(p.download);
        throw e;
    }
    return true;
}

module.exports = { canSelfUpdate, downloadUpdate, applyPendingUpdate, cleanupOldVersion };
