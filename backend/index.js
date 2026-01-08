import express from "express";
import cors from "cors";
import { google } from "googleapis";

const app = express();
app.use(cors());

// Authenticate with Google Drive using service-account.json
const auth = new google.auth.GoogleAuth({
  keyFile: "service-account.json",
  scopes: ["https://www.googleapis.com/auth/drive.readonly"],
});

const drive = google.drive({ version: "v3", auth });

// Folder IDs for each category
const folderIds = {
  Events: "1L4hbqEQeLYJnE4MkL39OgR5ZZDJ6mbD6",
  Facility: "1bQugC1QwAvWYbF3qrj739DL7GWBOBJnk",
  Hall: "1uQg07bp2IL84byq8zZHHLgFapGzDgmSg",
};

// Proxy endpoint to serve images from Google Drive
app.get("/api/image/:fileId", async (req, res) => {
  try {
    const { fileId } = req.params;

    // Get file metadata to determine content type
    const metadata = await drive.files.get({
      fileId: fileId,
      fields: 'mimeType'
    });

    // Download the file
    const response = await drive.files.get(
      { fileId: fileId, alt: 'media' },
      { responseType: 'stream' }
    );

    // Set appropriate headers
    res.setHeader('Content-Type', metadata.data.mimeType || 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 1 day

    // Pipe the image stream to response
    response.data.pipe(res);
  } catch (err) {
    console.error("Error proxying image:", err);
    res.status(500).json({ error: "Failed to load image" });
  }
});

app.get("/api/gallery", async (req, res) => {
  try {
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
      files.forEach((file) => {
        console.log(`  - ${file.name} (${file.mimeType})`);
      });

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
    res.json(images);
  } catch (err) {
    console.error("Error fetching images:", err);
    res.status(500).json({ error: "Failed to fetch images" });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));