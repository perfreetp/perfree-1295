import type { Certificate, User } from "../types";
import { formatDate } from "./date";

export function generateCertificateNo(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `MUS-${timestamp}-${random}`;
}

export async function downloadCertificate(certificate: Certificate, user: User): Promise<void> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  canvas.width = 800;
  canvas.height = 600;

  ctx.fillStyle = "#f5f0e6";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#c9a227";
  ctx.lineWidth = 4;
  ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

  ctx.strokeStyle = "#c9a227";
  ctx.lineWidth = 2;
  ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);

  ctx.fillStyle = "#1a1a2e";
  ctx.font = "bold 48px 'Noto Serif SC', serif";
  ctx.textAlign = "center";
  ctx.fillText("结业证书", canvas.width / 2, 130);

  ctx.fillStyle = "#c9a227";
  ctx.font = "24px 'Noto Serif SC', serif";
  ctx.fillText("MUSEUM ONLINE LEARNING", canvas.width / 2, 170);

  ctx.fillStyle = "#1a1a2e";
  ctx.font = "28px 'Noto Sans SC', sans-serif";
  ctx.fillText(`兹证明`, canvas.width / 2, 250);

  ctx.fillStyle = "#2d5a5b";
  ctx.font = "bold 36px 'Noto Serif SC', serif";
  ctx.fillText(user.name, canvas.width / 2, 310);

  ctx.fillStyle = "#1a1a2e";
  ctx.font = "24px 'Noto Sans SC', sans-serif";
  ctx.fillText(`已完成《${certificate.taskTitle}》学习任务，`, canvas.width / 2, 370);
  ctx.fillText("成绩合格，特发此证。", canvas.width / 2, 405);

  ctx.fillStyle = "#666";
  ctx.font = "20px 'Noto Sans SC', sans-serif";
  ctx.fillText(`证书编号：${certificate.certificateNo}`, canvas.width / 2, 470);
  ctx.fillText(`颁发日期：${formatDate(certificate.issuedDate, "YYYY年MM月DD日")}`, canvas.width / 2, 500);

  ctx.fillStyle = "#c9a227";
  ctx.font = "16px 'Noto Sans SC', sans-serif";
  ctx.fillText("— 博物馆在线学习平台 —", canvas.width / 2, 555);

  const dataUrl = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = `证书-${certificate.taskTitle}-${user.name}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
