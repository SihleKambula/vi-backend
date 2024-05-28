import express from "express";
import cors from "cors";
import multer from "multer";
import { fileURLToPath } from "url";
import path from "path";
import OpenAI from "openai";
import fs from "fs";

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
  organization: process.env.ORGANISATION,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, __dirname + "/voicenotes");
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});

const events = multer({ storage: storage });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serving running on port:${PORT} `);
});

app.get("/mindr", (req, res) => {
  res.send({
    message: "Hello from the backend",
  });
});

// post request to AI
app.post("/mindr", events.any(), async (req, res) => {
  try {
    const transciption = await openai.audio.transcriptions.create({
      model: "whisper-1",
      file: fs.createReadStream(req.files[0].path),
    });
    console.log({ data: transciption.text });
    res.json({ data: transciption.text });
    return true;

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
  } catch (error) {}
});
