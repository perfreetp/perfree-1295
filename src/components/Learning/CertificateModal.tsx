import { useEffect, useRef } from "react";
import { X, Download } from "lucide-react";
import { downloadCertificate } from "@/utils/certificate";
import { formatDate } from "@/utils/date";
import type { Certificate as StoreCertificate } from "@/stores/useUserStore";
import type { User as StoreUser } from "@/data/users";
import type { Certificate as UtilsCertificate } from "@/types";
import type { User as UtilsUser } from "@/types";
import { cn } from "@/lib/utils";

interface CertificateModalProps {
  open: boolean;
  onClose: () => void;
  certificate: StoreCertificate | null;
  user: StoreUser | null;
  certificateNo: string;
}

export default function CertificateModal({
  open,
  onClose,
  certificate,
  user,
  certificateNo,
}: CertificateModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!open || !certificate || !user || !canvasRef.current) return;

    const drawCornerDecoration = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      dirX: number = 1,
      dirY: number = 1
    ) => {
      ctx.strokeStyle = "#c9a227";
      ctx.lineWidth = 2;
      const len = 30;
      ctx.beginPath();
      ctx.moveTo(x, y + dirY * len);
      ctx.lineTo(x, y);
      ctx.lineTo(x + dirX * len, y);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x + dirX * 8, y + dirY * len);
      ctx.lineTo(x + dirX * 8, y + dirY * 8);
      ctx.lineTo(x + dirX * len, y + dirY * 8);
      ctx.stroke();
    };

    const drawStar = (
      ctx: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      spikes: number,
      outerRadius: number,
      innerRadius: number
    ) => {
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      ctx.beginPath();
      ctx.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.lineTo(cx, cy - outerRadius);
      ctx.closePath();
      ctx.fillStyle = "#b91c1c";
      ctx.fill();
    };

    const drawSeal = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
      const radius = 45;
      ctx.save();
      ctx.translate(x, y);

      ctx.strokeStyle = "#b91c1c";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = "#b91c1c";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, radius - 5, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = "#b91c1c";
      ctx.font = "bold 14px 'Noto Serif SC', serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const text = "博物馆";
      for (let i = 0; i < text.length; i++) {
        const angle = -Math.PI / 2 + (i - (text.length - 1) / 2) * 0.4;
        const charX = Math.cos(angle) * (radius - 15);
        const charY = Math.sin(angle) * (radius - 15);
        ctx.save();
        ctx.translate(charX, charY);
        ctx.rotate(angle + Math.PI / 2);
        ctx.fillText(text[i], 0, 0);
        ctx.restore();
      }

      ctx.fillStyle = "#b91c1c";
      ctx.font = "bold 16px 'Noto Serif SC', serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("之印", 0, 10);

      const starAngle = -Math.PI / 2;
      const starX = Math.cos(starAngle) * 10;
      const starY = Math.sin(starAngle) * 10 - 5;
      drawStar(ctx, starX, starY, 5, 5, 2);

      ctx.restore();
    };

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = 800 * dpr;
    canvas.height = 600 * dpr;
    canvas.style.width = "800px";
    canvas.style.height = "600px";
    ctx.scale(dpr, dpr);

    ctx.fillStyle = "#f5f0e6";
    ctx.fillRect(0, 0, 800, 600);

    ctx.strokeStyle = "#c9a227";
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, 740, 540);

    ctx.strokeStyle = "#c9a227";
    ctx.lineWidth = 2;
    ctx.strokeRect(50, 50, 700, 500);

    drawCornerDecoration(ctx, 50, 50, 1);
    drawCornerDecoration(ctx, 750, 50, -1, 1);
    drawCornerDecoration(ctx, 50, 550, 1, -1);
    drawCornerDecoration(ctx, 750, 550, -1, -1);

    ctx.fillStyle = "#1a1a2e";
    ctx.font = "bold 48px 'Noto Serif SC', serif";
    ctx.textAlign = "center";
    ctx.fillText("结业证书", 400, 130);

    ctx.fillStyle = "#c9a227";
    ctx.font = "20px 'Noto Serif SC', serif";
    ctx.fillText("MUSEUM ONLINE LEARNING", 400, 165);

    ctx.fillStyle = "#c9a227";
    ctx.beginPath();
    ctx.moveTo(300, 185);
    ctx.lineTo(500, 185);
    ctx.strokeStyle = "#c9a227";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = "#1a1a2e";
    ctx.font = "26px 'Noto Sans SC', sans-serif";
    ctx.fillText("兹证明", 400, 250);

    const userName = user.nickname || "学习者";
    ctx.fillStyle = "#2d5a5b";
    ctx.font = "bold 38px 'Noto Serif SC', serif";
    ctx.fillText(userName, 400, 315);

    ctx.fillStyle = "#1a1a2e";
    ctx.font = "22px 'Noto Sans SC', sans-serif";
    ctx.fillText(`已完成《${certificate.taskTitle}》学习任务，`, 400, 375);
    ctx.fillText(`考核成绩 ${certificate.score} 分，成绩合格，特发此证。`, 400, 408);

    drawSeal(ctx, 650, 480);

    ctx.fillStyle = "#666";
    ctx.font = "18px 'Noto Sans SC', sans-serif";
    ctx.fillText(`证书编号：${certificateNo}`, 400, 480);
    ctx.fillText(
      `颁发日期：${formatDate(certificate.issueDate, "YYYY年MM月DD日")}`,
      400,
      510
    );

    ctx.fillStyle = "#c9a227";
    ctx.font = "16px 'Noto Sans SC', sans-serif";
    ctx.fillText("— 博物馆在线学习平台 —", 400, 560);
  }, [open, certificate, user, certificateNo]);

  const handleDownload = async () => {
    if (!certificate || !user) return;

    const utilsCert: UtilsCertificate = {
      id: certificate.id,
      userId: user.id,
      taskId: certificate.taskId,
      taskTitle: certificate.taskTitle,
      issuedDate: certificate.issueDate,
      certificateNo: certificateNo,
    };

    const utilsUser: UtilsUser = {
      id: user.id,
      name: user.nickname || "学习者",
      avatar: user.avatar,
      email: user.email,
      role: user.role,
      points: 0,
      level: "",
    };

    await downloadCertificate(utilsCert, utilsUser);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl mx-4 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 flex items-center justify-center w-10 h-10 rounded-full bg-white/90 text-ink hover:bg-white transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-ink via-ink/95 to-teal px-6 py-4">
            <h3 className="font-serif text-xl font-bold text-gold">电子结业证书</h3>
          </div>

          <div className="p-6 bg-cream/50">
            <div className="flex justify-center">
              <canvas
                ref={canvasRef}
                className="rounded-lg shadow-lg"
                style={{ maxWidth: "100%", height: "auto" }}
              />
            </div>
          </div>

          <div className="px-6 py-4 bg-white border-t border-ink/10 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg border-2 border-ink/20 text-ink font-medium hover:bg-ink/5 transition-colors"
            >
              关闭
            </button>
            <button
              onClick={handleDownload}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-gold text-white font-medium",
                "hover:shadow-lg hover:shadow-gold/30 transition-all duration-300"
              )}
            >
              <Download size={18} />
              <span>下载证书</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
