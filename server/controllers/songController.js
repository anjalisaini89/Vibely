import Song from "../models/Song.js";

/* =================================
   GET ALL SONGS
================================= */

export async function getSongs(req, res) {
  try {
    const songs = await Song.find().sort({ createdAt: -1 });

    res.json(songs);
  } catch (error) {
    console.error("Failed to load songs:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load songs",
    });
  }
}

/* =================================
   GET SINGLE SONG
================================= */

export async function getSong(req, res) {
  try {
    const song = await Song.findById(req.params.id);

    if (!song) {
      return res.status(404).json({
        success: false,
        message: "Song not found",
      });
    }

    res.json(song);
  } catch (error) {
    console.error("Failed to load song:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load song",
    });
  }
}

/* =================================
   UPLOAD SONG
================================= */

export async function uploadSong(req, res) {
  try {
    const {
      title,
      artist,
      category,
      album,
    } = req.body;

    /* =============================
       VALIDATION
    ============================= */

    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Song title is required",
      });
    }

    if (!artist?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Artist is required",
      });
    }

    if (
      !req.files ||
      !req.files.audio ||
      !req.files.audio[0]
    ) {
      return res.status(400).json({
        success: false,
        message: "Audio file is required",
      });
    }

    /* =============================
       FILES
    ============================= */

    const audioFile = req.files.audio[0];
    const coverFile = req.files.cover?.[0];

    /* =============================
       CREATE MONGODB DOCUMENT
    ============================= */

    const newSong = await Song.create({
      title: title.trim(),

      artist: artist.trim(),

      album: album?.trim() || "",

      category: category?.trim() || "Custom",

      cover: coverFile
        ? `/uploads/covers/${coverFile.filename}`
        : "/covers/default.jpg",

      audio: `/uploads/songs/${audioFile.filename}`,

      duration: 0,

      plays: 0,
    });

    /* =============================
       RESPONSE
    ============================= */

    res.status(201).json({
      success: true,
      message: "Song uploaded successfully",
      song: newSong,
    });

  } catch (error) {
    console.error(
      "Failed to upload song:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to upload song",
    });
  }
}