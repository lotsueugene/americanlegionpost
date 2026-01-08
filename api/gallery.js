const { google } = require("googleapis");

// Initialize Google Drive API
const getAuth = () => {
  return new google.auth.GoogleAuth({
    credentials: process.env.GOOGLE_SERVICE_ACCOUNT
      ? JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT)
      : undefined,
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  });
};

// Folder IDs for each category
const folderIds = {
  Events: "1L4hbqEQeLYJnE4MkL39OgR5ZZDJ6mbD6",
  Facility: "1bQugC1QwAvWYbF3qrj739DL7GWBOBJnk",
  Hall: "1uQg07bp2IL84byq8zZHHLgFapGzDgmSg",
};

module.exports = async function handler(req, res) {
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
    const auth = getAuth();
    const drive = google.drive({ version: "v3", auth });
    let images = [];

    for (const [category, folderId] of Object.entries(folderIds)) {
      console.log(`Fetching files for category: ${category}, folderId: ${folderId}`);

      const response = await drive.files.list({
        q: `'${folderId}' in parents and trashed=false and mimeType contains 'image/'`,
        fields: "files(id, name, mimeType, createdTime, webContentLink, webViewLink)",
        orderBy: "createdTime desc",
      });

      const files = response.data.files || [];
      console.log(`Found ${files.length} files in ${category}`);

      // Map files to gallery objects
      const mappedFiles = files.map((file) => ({
        id: file.id,
        // Remove file extension from title (handles double extensions like .jpg.avif)
        title: file.name.replace(/\.(avif|jpg|jpeg|png|gif|webp)+$/i, '').replace(/\.(jpg|jpeg|png|gif|webp)$/i, ''),
        category,
        // Use our proxy endpoint to serve images
        src: `/api/image/${file.id}`,
        fullSrc: `/api/image/${file.id}`,
      }));

      images.push(...mappedFiles);
    }

    console.log(`Total images fetched: ${images.length}`);
    res.status(200).json(images);
  } catch (err) {
    console.error("Error fetching images:", err);
    res.status(500).json({ error: "Failed to fetch images", details: err.message });
  }
};
