// Envía el recordatorio a los celulares suscritos (lo ejecuta GitHub Actions).
const webpush = require("web-push");
const subs = require("./subscriptions.json");

const PUBLIC = "BOh92WsmsIIIGY9hJB_2u86RE-tCpjAXQifbksPmtVZbux_7dWUuGtIfE3PakkIlH-NGp9Ajzqt5FqdEXzAdSSk";
const PRIVATE = process.env.VAPID_PRIVATE_KEY;
if (!PRIVATE) { console.error("Falta el secreto VAPID_PRIVATE_KEY"); process.exit(1); }
if (!subs.length) { console.log("No hay celulares suscritos todavía."); process.exit(0); }

webpush.setVapidDetails("https://benjazamorano8.github.io/inner-angel/", PUBLIC, PRIVATE);

// Hora en Chile para elegir el mensaje
const hour = Number(new Intl.DateTimeFormat("es-CL", { hour: "numeric", hour12: false, timeZone: "America/Santiago" }).format(new Date()));
const kind = process.env.KIND || (hour < 15 ? "manana" : "noche");
const msgs = {
  manana: { title: "Buenos días 😇", body: "5 minutos de oído: cadencia y a adivinar notas." },
  noche:  { title: "Antes de dormir 🌙", body: "Una ronda de 20 en Inner Angel y listo." },
  prueba: { title: "Inner Angel", body: "¡Los recordatorios están funcionando! 🎧" }
};
const payload = JSON.stringify(msgs[kind] || msgs.manana);

Promise.allSettled(subs.map(s => webpush.sendNotification(s, payload, { TTL: 3 * 3600 })))
  .then(rs => {
    rs.forEach((r, i) => console.log(`#${i}:`, r.status === "fulfilled" ? "enviado" : `error ${r.reason.statusCode || ""} ${r.reason.body || r.reason.message}`));
    if (rs.every(r => r.status === "rejected")) process.exit(1);
  });
