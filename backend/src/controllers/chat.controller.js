import { generateStreamToken } from "../lib/stream.js";

export async function getStreamToken(req, res) {
  try {
    if (!req.user?._id && !req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user._id?.toString() || req.user.id?.toString();
    const token = generateStreamToken(userId);

    res.status(200).json({ token });
  } catch (error) {
    console.error("Error in getStreamToken:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
