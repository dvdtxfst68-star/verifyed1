// CD Hub Whitelist & Blacklist API
// Reads from GitHub raw file for easy management

const GITHUB_DATA_URL = "https://raw.githubusercontent.com/dvdtxfst68-star/verifyed1/main/data/users.json";

// Fallback hardcoded lists (used if GitHub fetch fails)
const FALLBACK_WHITELIST = ["16773546"];
const FALLBACK_BLACKLIST = [];

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    
    const userid = req.query.userid;
    
    if (!userid) {
        return res.status(400).json({ allowed: false, message: "No userid provided" });
    }
    
    let whitelistedUsers = FALLBACK_WHITELIST;
    let blacklistedUsers = FALLBACK_BLACKLIST;
    
    // Fetch from GitHub raw file (add cache buster to avoid caching)
    try {
        const response = await fetch(GITHUB_DATA_URL + "?t=" + Date.now());
        
        if (response.ok) {
            const data = await response.json();
            whitelistedUsers = data.whitelist || FALLBACK_WHITELIST;
            blacklistedUsers = data.blacklist || FALLBACK_BLACKLIST;
        }
    } catch (error) {
        console.log("GitHub fetch failed, using fallback");
    }
    
    const userIdStr = userid.toString();
    
    // Check blacklist FIRST - blacklist takes priority
    if (blacklistedUsers.includes(userIdStr)) {
        return res.status(200).json({ 
            allowed: false,
            blacklisted: true,
            userId: userid,
            message: "You are BLACKLISTED from CD Hub"
        });
    }
    
    // Then check whitelist
    const isWhitelisted = whitelistedUsers.includes(userIdStr);
    
    return res.status(200).json({ 
        allowed: isWhitelisted,
        blacklisted: false,
        userId: userid
    });
}
