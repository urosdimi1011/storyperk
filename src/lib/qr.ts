import "server-only";
import QRCode from "qrcode";

export const offerUrl = (slug: string) => `${process.env.APP_URL ?? "http://localhost:3000"}/l/${slug}`;

/** QR ostaje isti i kad se promeni nagrada — vodi na stalnu adresu lokala. */
export function qrSvg(slug: string) {
  return QRCode.toString(offerUrl(slug), { type: "svg", margin: 0, color: { dark: "#1b1d25", light: "#0000" } });
}
