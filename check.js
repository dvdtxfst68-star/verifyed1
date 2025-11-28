// CD Hub Whitelist API
const WHITELISTED_USERS = [
    "16773546",
];

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    
    const userid = req.query.userid;
    
    if (!userid) {
        return res.status(400).json({ allowed: false, message: "No userid provided" });
    }
    
    const isWhitelisted = WHITELISTED_USERS.includes(userid.toString());
    
    return res.status(200).json({ 
        allowed: isWhitelisted,
        userId: userid
    });
}