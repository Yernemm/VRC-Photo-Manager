const currentVersion = require('../../package.json').version;

const LATEST_RELEASE_URL = "https://api.github.com/repos/Yernemm/VRC-Photo-Manager/releases/latest";

function parseVersion(v){
    return String(v).replace(/^v/i, "").split(/[-+]/)[0].split(".").map(n => parseInt(n, 10) || 0);
}


function isNewer(a, b){
    let pa = parseVersion(a);
    let pb = parseVersion(b);
    for(let i = 0; i < Math.max(pa.length, pb.length); i++){
        let x = pa[i] || 0;
        let y = pb[i] || 0;
        if(x !== y) return x > y;
    }
    return false;
}


async function checkForUpdate(){
    try {
        let res = await fetch(LATEST_RELEASE_URL, {
            headers: { "Accept": "application/vnd.github+json", "User-Agent": "VRCPM-update-check" }
        });
        if(!res.ok) return null;
        let release = await res.json();
        let latest = String(release.tag_name || "").replace(/^v/i, "");
        if(!latest || !isNewer(latest, currentVersion)) return null;
        return { version: latest, url: release.html_url, assets: release.assets || [] };
    } catch {
        return null;
    }
}

module.exports = { checkForUpdate, isNewer, currentVersion };
