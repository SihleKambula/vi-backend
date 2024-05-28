import { google } from "googleapis";

const calendar = google.calendar({
  version: "v3",
  auth: process.env.API_KEY,
});

const events = await calendar.events
  .list({
    calendarId: "primary",
    timeMin: new Date().toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: "startTime",
  })
  .then((res) => res.data.items);

events.map((event, index) => {
  const start = event.start.dateTime || event.start.date;
  console.log(`${start} - ${event.summary}`);
});
