import mongoose from "mongoose";

const songSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    artist: {
      type: String,
      required: true,
      trim: true,
    },

    album: {
      type: String,
      default: "",
      trim: true,
    },

    cover: {
      type: String,
      default: "",
    },

    audio: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      default: "Other",
      trim: true,
    },

    duration: {
      type: Number,
      default: 0,
    },

    plays: {
      type: Number,
      default: 0,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Song = mongoose.model("Song", songSchema);

export default Song;