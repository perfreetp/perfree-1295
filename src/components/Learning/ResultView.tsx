import { useEffect, useState } from "react";
import { ArrowLeft, Award, RefreshCw, CheckCircle, XCircle, Medal } from "lucide-react";
import { useLearningStore } from "@/stores/useLearningStore";
import { cn } from "@/lib/utils";

interface ResultViewProps {
  score: number;
  onGetCertificate: () => void;
  onRetry: () => void;
  onBack: () => void;
}

export default function ResultView({ score, onGetCertificate, onRetry, onBack }: ResultViewProps) {
  const { currentTask } = useLearningStore();
  const [animatedScore, setAnimatedScore] = useState(0);

  const passed = score >= 80;
  const totalQuizzes = currentTask?.quizzes.length || 0;
  const correctCount = Math.round((score / 100) * totalQuizzes);
  const wrongCount = totalQuizzes - correctCount;

  useEffect(() => {
    const duration = 1500;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(score * easeOut));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [score]);

  const circumference = 2 * Math.PI * 80;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-cream/80 py-8 animate-fade-in">
      <div className="container mx-auto px-4 max-w-2xl">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-ink/70 hover:text-ink transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          <span>返回任务列表</span>
        </button>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 animate-scale-in">
          <div className="text-center mb-8">
            <div
              className={cn(
                "w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4",
                passed ? "bg-gold/10" : "bg-ink/10"
              )}
            >
              {passed ? (
                <Award className="text-gold" size={40} />
              ) : (
                <Medal className="text-ink/60" size={40} />
              )}
            </div>
            <h2 className="font-serif text-2xl text-ink/70 mb-2">
              {currentTask?.title}
            </h2>
            <p className="text-ink/50">答题结果</p>
          </div>

          <div className="flex justify-center mb-10">
            <div className="relative w-56 h-56">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 200 200">
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="12"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke={passed ? "#c9a227" : "#9ca3af"}
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference}
                  style={{
                    strokeDashoffset: strokeDashoffset,
                    transition: "stroke-dashoffset 1.5s ease-out",
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span
                  className={cn(
                    "font-serif font-bold text-shadow-gold",
                    passed ? "text-6xl text-gold" : "text-6xl text-ink/60"
                  )}
                >
                  {animatedScore}
                </span>
                <span className="text-ink/50 mt-1">分</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-teal/5 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <CheckCircle className="text-teal" size={20} />
                <span className="text-teal font-medium">答对</span>
              </div>
              <span className="font-serif text-3xl font-bold text-teal">{correctCount}</span>
              <span className="text-teal/60 ml-1">题</span>
            </div>
            <div className="bg-red-50 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <XCircle className="text-red-500" size={20} />
                <span className="text-red-500 font-medium">答错</span>
              </div>
              <span className="font-serif text-3xl font-bold text-red-500">{wrongCount}</span>
              <span className="text-red-400 ml-1">题</span>
            </div>
          </div>

          <div className="text-center">
            {passed ? (
              <div className="mb-8 animate-slide-up">
                <h3 className="font-serif text-2xl font-bold text-gold mb-2">
                  🎉 恭喜通过！
                </h3>
                <p className="text-ink/60">
                  您已成功完成《{currentTask?.title}》的学习考核，成绩优秀！
                </p>
              </div>
            ) : (
              <div className="mb-8 animate-slide-up">
                <h3 className="font-serif text-2xl font-bold text-ink/80 mb-2">
                  继续加油！
                </h3>
                <p className="text-ink/60">
                  距离及格还差 {80 - score} 分，再努力一下一定可以通过！
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {passed ? (
                <button
                  onClick={onGetCertificate}
                  className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-gold text-white rounded-xl font-medium hover:shadow-lg hover:shadow-gold/30 transition-all duration-300"
                >
                  <Award size={20} />
                  <span>获取证书</span>
                </button>
              ) : (
                <button
                  onClick={onRetry}
                  className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-gold text-white rounded-xl font-medium hover:shadow-lg hover:shadow-gold/30 transition-all duration-300"
                >
                  <RefreshCw size={20} />
                  <span>重新挑战</span>
                </button>
              )}
              <button
                onClick={onBack}
                className="flex items-center justify-center gap-2 px-8 py-3 border-2 border-ink/20 text-ink rounded-xl font-medium hover:bg-ink/5 transition-colors"
              >
                <ArrowLeft size={20} />
                <span>返回任务</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
