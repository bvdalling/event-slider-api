/**
 * This socket API is meant to run the Southern Utah Code Camps Event Slider.
 */

var http = require("http");
var app = require("express")();
var server = http.createServer(app);
var io = require("socket.io")(server);
const path = require("path");

var PORT = process.env.PORT || 3000;

const apiKey = process.env.API_KEY || "some-bacon-and-eggs-for-breakfast-1920-blender";

function SenderIsAuthorized(socket) {
  const authHeader = socket.handshake.auth['token']
  return authHeader === apiKey; // Simple token check
}

function videoStart(socket, data) {
  if (!SenderIsAuthorized(socket)) return;
  console.log("Video started:", data);
  socket.broadcast.emit("video:start", data);
  console.log("Broadcasted video start");
}

function videoPause(socket, data) {
  if (!SenderIsAuthorized(socket)) return;
  console.log("Video paused:", data);
  socket.broadcast.emit("video:pause", data);
}

function v(socket, data) {
  if (!SenderIsAuthorized(socket)) return;
  console.log("Video resume:", data);
  socket.broadcast.emit("video:resume", data);
}

function videoStop(socket, data) {
  if (!SenderIsAuthorized(socket)) return;
  console.log("Video stopped:", data);
  socket.broadcast.emit("video:stop", data);
}

function videoSetVolume(socket, data) {
  if (!SenderIsAuthorized(socket)) return;
  console.log("Video volume set to:", data);
  socket.broadcast.emit("video:set-volume", data);
}

function musicStart(socket, data) {
  if (!SenderIsAuthorized(socket)) return;
  console.log("Music started:", data);
  socket.broadcast.emit("audio:start", data);
}

function musicPause(socket, data) {
  if (!SenderIsAuthorized(socket)) return;
  console.log("Music paused:", data);
  socket.broadcast.emit("audio:pause", data);
}

function musicStop(socket, data) {
  if (!SenderIsAuthorized(socket)) return;
  console.log("Music stopped:", data);
  socket.broadcast.emit("audio:stop", data);
}

function musicSetVolume(socket, data) {
  if (!SenderIsAuthorized(socket)) return;
  console.log("Music volume set to:", data);
  socket.broadcast.emit("audio:set-volume", data);
}

function setAlert(socket, data) {
  if (!SenderIsAuthorized(socket)) return;
  console.log("Alert set:", data);
  socket.broadcast.emit("alert:set", data);
}

function reload(socket, data) {
  if (!SenderIsAuthorized(socket)) return;
  console.log("Reload requested:", data);
  socket.broadcast.emit("reload", data);
}

io.on("connection", (socket) => {
  console.log(`New connection: ${socket.id}`);

  socket.on("video-start", (data) => videoStart(socket, data));
  socket.on("video-pause", (data) => videoPause(socket, data));
  socket.on("video-resume", (data) => videoResume(socket, data));
  socket.on("video-stop", (data) => videoStop(socket, data));
  socket.on("video-set-volume", (data) => videoSetVolume(socket, data));

  socket.on("audio-start", (data) => musicStart(socket, data));
  socket.on("audio-pause", (data) => musicPause(socket, data));
  socket.on("audio-stop", (data) => musicStop(socket, data));
  socket.on("audio-set-volume", (data) => musicSetVolume(socket, data));

  socket.on("alert-msg", (data) => setAlert(socket, data));
  socket.on("reload", (data) => reload(socket, data));

  socket.on('qr-code', (data) => {
    if (!SenderIsAuthorized(socket)) return;
    console.log("QR Code:", data);
    socket.broadcast.emit("qr-code", data);
  });

  socket.on("disconnect", () => {
    console.log(`Disconnected: ${socket.id}`);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "./", "index.html"))
);