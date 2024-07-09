import express from "express";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import OpenAI from "openai";
import fs from "fs";
import { createNote } from "./firebase/controllers.js";

dotenv.config();

const { OPEN_API_KEY, ORGANISATION } = process.env;

const openai = new OpenAI({
  apiKey: OPEN_API_KEY,
  organization: ORGANISATION,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//middleware
const app = express();
app.use(cors());

//storing voice recordings
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, __dirname + "/voicenotes");
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});

const events = multer({ storage: storage });

//PORT number
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serving running on port:${PORT} `);
});

//Getting data
app.get("/vi", (req, res) => {
  res.send({
    message: "Hello from the backend",
  });
});

// Transcribing voice note to text
app.post("/vi", events.any(), async (req, res) => {
  try {
    const transciption = await openai.audio.transcriptions.create({
      model: "whisper-1",
      file: fs.createReadStream(req.files[0].path),
    });
    await createNote(transciption.text, req.body.uid);
    console.log({ data: transciption.text });
    res.status(200).send("product created successfully");
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

// open dialog
// const response = await openai.chat.completions.create({
//   model: "gpt-3.5-turbo",
//   messages: [
//     {
//       role: "user",
//       content: `Return this sentence '${transciption.text}' in json format. Add line breaks where needed`,
//     },
//   ],
// });
// const data = JSON.parse(response.choices[0].message.content);
// console.log(data);
