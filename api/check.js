// CD Hub Whitelist & Blacklist API with JSONBin Database
// This reads from JSONBin.io so Base44 can manage users

const JSONBIN_URL = "https://api.jsonbin.io/v3/b/YOUR_BIN_ID/latest";
const JSONBIN_API_KEY = "$2a$10$YOUR_API_KEY"; // Get from jsonbin.io

// Fallback hardcoded lists (used if JSONBin fails)
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
    
    // Try to fetch from JSONBin database
    try {
        const response = await fetch(JSONBIN_URL, {
            headers: {
                "X-Access-Key": JSONBIN_API_KEY
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.record) {
                whitelistedUsers = data.record.whitelist || FALLBACK_WHITELIST;
                blacklistedUsers = data.record.blacklist || FALLBACK_BLACKLIST;
            }
        }
    } catch (error) {
        // Use fallback lists if JSONBin fails
        console.log("JSONBin fetch failed, using fallback");
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
