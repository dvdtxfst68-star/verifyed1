// CD Hub Whitelist & Blacklist API
const WHITELISTED_USERS = [
    "16773546",
];

const BLACKLISTED_USERS = [
    // Add blacklisted user IDs here
    // Example: "123456789",
];

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    
    const userid = req.query.userid;
    
    if (!userid) {
        return res.status(400).json({ allowed: false, message: "No userid provided" });
    }
    
    // Check blacklist FIRST - blacklist takes priority
    const isBlacklisted = BLACKLISTED_USERS.includes(userid.toString());
    if (isBlacklisted) {
        return res.status(200).json({ 
            allowed: false,
            blacklisted: true,
            userId: userid,
            message: "User is blacklisted"
        });
    }
    
    // Then check whitelist
    const isWhitelisted = WHITELISTED_USERS.includes(userid.toString());
    
    return res.status(200).json({ 
        allowed: isWhitelisted,
        blacklisted: false,
        userId: userid
    });
}
