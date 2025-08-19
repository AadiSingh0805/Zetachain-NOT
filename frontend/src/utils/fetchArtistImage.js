// src/utils/fetchArtistImage.js
export const fetchArtistImage = async (artist) => {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
        artist
      )}`
    );
    const data = await res.json();

    if (data.thumbnail?.source) {
      return data.thumbnail.source;
    }

    return `https://via.placeholder.com/300x300/000000/ffffff?text=${encodeURIComponent(
      artist
    )}`;
  } catch (err) {
    console.error("Wikipedia fetch error:", err);
    return `https://via.placeholder.com/300x300/000000/ffffff?text=${encodeURIComponent(
      artist
    )}`;
  }
};
