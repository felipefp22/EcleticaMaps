export function filterLoccationsOverLaping(locations) {
    const placedMarkers = [];

    locations.forEach(x => {
        if (!x.entregador && x.flag_dely !== "V") {
            let index = 0;

            while (placedMarkers.some(pos => isClose(x.latitude, x.longitude, pos.lat, pos.lng))) {
                [x.latitude, x.longitude] = getOffsetPosition(x.latitude, x.longitude, index);
                index++;
            }

            placedMarkers.push({ lat: x.latitude, lng: x.longitude });
        }
    });

    return locations;
}

export function isClose(lat1, lng1, lat2, lng2, thresholdMeters = 10) {
    const R = 6371000; // Earth radius in meters
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c < thresholdMeters;
}

export function getOffsetPosition(lat, lng, index, zoom) {
    const offsetMeters = 30;
    const angle = (index * 45) * (Math.PI / 180);
    const earthRadius = 6378137;

    const dLat = (offsetMeters * Math.sin(angle)) / earthRadius;
    const dLng = (offsetMeters * Math.cos(angle)) / (earthRadius * Math.cos(Math.PI * lat / 180));

    const newLat = lat + dLat * (180 / Math.PI);
    const newLng = lng + dLng * (180 / Math.PI);

    return [newLat, newLng]; // 🟢 Return array (already correct)
}