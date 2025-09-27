const fs = require('fs');
const path = require('path');
const axios = require('axios');


const centerLat = -23.6412056; // Example latitude
const centerLon = -46.7118066;
const radiusMeters = 15000; // 15 km radius
const zoomLevels = [12, 13, 14, 15, 16, 17, 18]; // adjust as needed



// Folder to save tiles
const outputRoot = path.join(__dirname, 'tiles');
fs.mkdirSync(outputRoot, { recursive: true });

const metersPerDegreeLat = 111_320;
const metersPerDegreeLon = 111_320 * Math.cos(centerLat * Math.PI / 180);

const latDelta = radiusMeters / metersPerDegreeLat;
const lonDelta = radiusMeters / metersPerDegreeLon;

// Bounds and zoom levels
const bounds = {
    minLat: centerLat - latDelta,
    maxLat: centerLat + latDelta,
    minLon: centerLon - lonDelta,
    maxLon: centerLon + lonDelta,
};

// Convert lat/lon to tile numbers
function latLonToTile(lat, lon, zoom) {
    const x = Math.floor(((lon + 180) / 360) * Math.pow(2, zoom));
    const y = Math.floor(
        ((1 - Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) / 2) *
        Math.pow(2, zoom)
    );
    return { x, y };
}

(async () => {
    try {
        for (let z of zoomLevels) {
            const topLeft = latLonToTile(bounds.maxLat, bounds.minLon, z);
            const bottomRight = latLonToTile(bounds.minLat, bounds.maxLon, z);

            for (let x = topLeft.x; x <= bottomRight.x; x++) {
                for (let y = topLeft.y; y <= bottomRight.y; y++) {
                    const url = `https://tile.openstreetmap.org/${z}/${x}/${y}.png`;
                    const outDir = path.join(outputRoot, z.toString(), x.toString());
                    fs.mkdirSync(outDir, { recursive: true });
                    const filePath = path.join(outDir, `${y}.png`);

                    const response = await axios.get(url, { responseType: 'arraybuffer' });
                    fs.writeFileSync(filePath, response.data);
                    console.log(`Tile saved: ${filePath}`);
                }
            }
        }
        console.log('All tiles downloaded!');
    } catch (err) {
        console.error('Error downloading tiles:', err);
    }
})();