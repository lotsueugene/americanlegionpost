import { google } from "googleapis";

// Initialize Google Drive API
const getAuth = () => {
  return new google.auth.GoogleAuth({
    credentials: process.env.GOOGLE_SERVICE_ACCOUNT
      ? JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT)
      : undefined,
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  });
};

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { fileId } = req.query;

    if (!fileId) {
      res.status(400).json({ error: 'File ID is required' });
      return;
    }

    const auth = getAuth();
    const drive = google.drive({ version: "v3", auth });

    // Get file metadata to determine content type
    const metadata = await drive.files.get({
      fileId: fileId,
      fields: 'mimeType'
    });

    // Download the file
    const response = await drive.files.get(
      { fileId: fileId, alt: 'media' },
      { responseType: 'arraybuffer' }
    );

    // Set appropriate headers
    res.setHeader('Content-Type', metadata.data.mimeType || 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 1 day

    // Send the image buffer
    res.status(200).send(Buffer.from(response.data));
  } catch (err) {
    console.error("Error proxying image:", err);
    res.status(500).json({ error: "Failed to load image", details: err.message });
  }
}
