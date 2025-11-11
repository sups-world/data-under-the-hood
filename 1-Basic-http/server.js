import http from "http";
import os from "os";
import fetch from "node-fetch";

const server = http.createServer((req, res) => {
  const start = Date.now();

  //Latency simulation
  setTimeout(() => {
    const latency = Date.now() - start;
    console.log(`---Incoming Request---`);
    console.log(`Client IP: `, req.socket.remoteAddress);
    console.log(`URL: `, req.url);
    console.log(`Headers: `, req.headers);
    console.log(`Latency (ms) `, latency);
    const ip = req.socket.remoteAddress.replace("::ffff:", "");
    fetch(`https://ipapi.co/${ip}/json/`)
      .then((r) => r.json())
      .then((data) => console.log("Location:", data.city, data.country_name));
    console.log(`-------------------------------------------\n`);

    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(`Hello from the server. Your request took ${latency} to reach.`);
  }, Math.random() * 200);
});

server.listen(3000, `0.0.0.0`, () => {
  const interfaces = os.networkInterfaces();
  console.log("Server LAN addresses:");
  for (const name in interfaces) {
    interfaces[name].forEach((iface) => {
      if (iface.family === "IPv4" && !iface.internal) {
        console.log(`http://${iface.address}:3000`);
      }
    });
  }
});
