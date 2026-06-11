import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { BookOpen, CheckCircle, Award, Clock, Play, RotateCcw, Eye } from "lucide-react";
import { useLearningStore, type TaskProgressStatus } from "@/stores/useLearningStore";
import { useUserStore, type Certificate as StoreCertificate } from "@/stores/useUserStore";
import QuizView from "@/components/Learning/QuizView";
import ResultView from "@/components/Learning/ResultView";
import CertificateModal from "@/components/Learning/CertificateModal";
import LoginModal from "@/components/LoginModal";
import type { LearningTask } from "@/data/learning";
import { cn } from "@/lib/utils";

type ViewMode = "list" | "quiz" | "result";

export default function Learning() {
  const {
    tasks,
    currentTask,
    taskProgress,
    userAnswers,
    setCurrentTask,
    completeTask,
    resetTask,
  } = useLearningStore();

  const { user, isLoggedIn, certificates, addCertificate } = useUserStore();
  const prevIsLoggedIn = useRef(isLoggedIn);

  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [score, setScore] = useState(0);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [currentCertificate, setCurrentCertificate] = useState<StoreCertificate | null>(null);
  const [currentCertificateNo, setCurrentCertificateNo] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingCertificateRequest, setPendingCertificateRequest] = useState(false);
  const [pendingViewCertTaskId, setPendingViewCertTaskId] = useState<string | null>(null);

  const stats = useMemo(() => {
    const completed = Object.values(taskProgress).filter(
      (p) => p.status === "completed"
    ).length;
    const certCount = certificates.length;
    return { total: tasks.length, completed, certCount };
  }, [taskProgress, certificates, tasks.length]);

  const getTaskProgress = (taskId: string) => {
    return taskProgress[taskId] || { status: "not_started" as TaskProgressStatus, score: 0 };
  };

  const getAnsweredCount = (task: LearningTask) => {
    return task.quizzes.filter((_, index) => {
      const key = `${task.id}_${index}`;
      return userAnswers[key] !== undefined;
    }).length;
  };

  const handleGetCertificate = useCallback(() => {
    if (!currentTask) return;

    if (!isLoggedIn) {
      setPendingCertificateRequest(true);
      setShowLoginModal(true);
      return;
    }

    addCertificate(currentTask.id, currentTask.title, score);
    setTimeout(() => {
      const cert = useUserStore.getState().certificates.find((c) => c.taskId === currentTask.id);
      if (cert) {
        setCurrentCertificate(cert);
        setCurrentCertificateNo(`MUS-${cert.id.replace(/cert_/g, '').toUpperCase()}`);
        setShowCertificateModal(true);
      }
    }, 50);
  }, [currentTask, isLoggedIn, score, addCertificate]);

  useEffect(() => {
    if (isLoggedIn && !prevIsLoggedIn.current && pendingCertificateRequest) {
      setPendingCertificateRequest(false);
      handleGetCertificate();
    }
    prevIsLoggedIn.current = isLoggedIn;
  }, [isLoggedIn, pendingCertificateRequest, handleGetCertificate]);

  const handleStartTask = (task: LearningTask) => {
    setCurrentTask(task);
    setViewMode("quiz");
  };

  const handleResetTask = (taskId: string) => {
    resetTask(taskId);
  };

  const handleRetryTask = (task: LearningTask) => {
    resetTask(task.id);
    setCurrentTask(task);
    setViewMode("quiz");
  };

  const handleQuizComplete = () => {
    if (!currentTask) return;
    const finalScore = completeTask(currentTask.id);
    setScore(finalScore);
    setViewMode("result");
  };

  const handleBackToList = () => {
    setCurrentTask(null);
    setViewMode("list");
  };

  const handleViewCertificate = (taskId: string) => {
    if (!isLoggedIn) {
      setPendingViewCertTaskId(taskId);
      setPendingCertificateRequest(false);
      setShowLoginModal(true);
      return;
    }

    const cert = useUserStore.getState().certificates.find((c) => c.taskId === taskId);
    if (cert) {
      setCurrentCertificate(cert);
      setCurrentCertificateNo(`MUS-${cert.id.replace(/cert_/g, '').toUpperCase()}`);
      setShowCertificateModal(true);
    }
  };

  const renderStatusBadge = (task: LearningTask) => {
    const progress = getTaskProgress(task.id);
    const answered = getAnsweredCount(task);
    const progressPercent = Math.round((answered / task.quizzes.length) * 100);

    switch (progress.status) {
      case "completed":
        return (
          <span className="px-2.5 py-1 bg-teal/10 text-teal rounded-full text-xs font-medium flex items-center gap-1">
            <CheckCircle size={12} />
            已完成 {progress.score}分
          </span>
        );
      case "in_progress":
        return (
          <span className="px-2.5 py-1 bg-gold/10 text-gold rounded-full text-xs font-medium flex items-center gap-1">
            <Clock size={12} />
            进行中 {progressPercent}%
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-medium">
            未开始
          </span>
        );
    }
  };

  const renderActionButton = (task: LearningTask) => {
    const progress = getTaskProgress(task.id);
    const hasCertificate = certificates.some((c) => c.taskId === task.id);

    if (progress.status === "completed" && hasCertificate) {
      return (
        <button
          onClick={() => handleViewCertificate(task.id)}
          className="w-full py-3 bg-gradient-teal text-white rounded-lg hover:shadow-lg hover:shadow-teal/30 transition-all duration-300 font-medium flex items-center justify-center gap-2"
        >
          <Eye size={18} />
          查看证书
        </button>
      );
    }

    if (progress.status === "completed") {
      return (
        <button
          onClick={() => handleResetTask(task.id)}
          className="w-full py-3 bg-ink text-white rounded-lg hover:bg-ink/90 transition-colors font-medium flex items-center justify-center gap-2"
        >
          <RotateCcw size={18} />
          重新学习
        </button>
      );
    }

    if (progress.status === "in_progress") {
      return (
        <button
          onClick={() => handleStartTask(task)}
          className="w-full py-3 bg-gradient-gold text-white rounded-lg hover:shadow-lg hover:shadow-gold/30 transition-all duration-300 font-medium flex items-center justify-center gap-2"
        >
          <Play size={18} />
          继续学习
        </button>
      );
    }

    return (
      <button
        onClick={() => handleStartTask(task)}
        className="w-full py-3 bg-ink text-white rounded-lg hover:bg-ink/90 transition-colors font-medium flex items-center justify-center gap-2"
      >
        <Play size={18} />
        开始学习
      </button>
    );
  };

  if (viewMode === "quiz") {
    return (
      <QuizView
        onComplete={handleQuizComplete}
        onBack={handleBackToList}
      />
    );
  }

  if (viewMode === "result") {
    return (
      <>
        <ResultView
          score={score}
          isLoggedIn={isLoggedIn}
          onGetCertificate={handleGetCertificate}
          onNeedLogin={() => {
            setPendingCertificateRequest(true);
            setShowLoginModal(true);
          }}
          onRetry={() => currentTask && handleRetryTask(currentTask)}
          onBack={handleBackToList}
        />
        <CertificateModal
          open={showCertificateModal}
          onClose={() => setShowCertificateModal(false)}
          certificate={currentCertificate}
          user={user}
          certificateNo={currentCertificateNo}
        />
        <LoginModal
          open={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={() => {
            setShowLoginModal(false);
            if (pendingCertificateRequest && currentTask) {
              addCertificate(currentTask.id, currentTask.title, score);
              setTimeout(() => {
                const cert = useUserStore.getState().certificates.find((c) => c.taskId === currentTask.id);
                if (cert) {
                  setCurrentCertificate(cert);
                  setCurrentCertificateNo(`MUS-${cert.id.replace(/cert_/g, '').toUpperCase()}`);
                  setShowCertificateModal(true);
                  setPendingCertificateRequest(false);
                }
              }, 50);
            }
            if (pendingViewCertTaskId) {
              const cert = useUserStore.getState().certificates.find((c) => c.taskId === pendingViewCertTaskId);
              if (cert) {
                setCurrentCertificate(cert);
                setCurrentCertificateNo(`MUS-${cert.id.replace(/cert_/g, '').toUpperCase()}`);
                setShowCertificateModal(true);
              }
              setPendingViewCertTaskId(null);
            }
          }}
        />
      </>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-10 text-center animate-slide-down">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-ink mb-3">学习任务</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          系统学习中华传统文化知识，完成测验获取证书，让学习更有趣味。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-xl shadow-md p-6 text-center animate-slide-up" style={{ animationDelay: "0ms" }}>
          <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-3">
            <BookOpen className="text-gold" size={28} />
          </div>
          <div className="text-3xl font-bold text-ink mb-1">{stats.total}</div>
          <div className="text-sm text-gray-500">学习任务</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 text-center animate-slide-up" style={{ animationDelay: "100ms" }}>
          <div className="w-14 h-14 rounded-full bg-teal/10 flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="text-teal" size={28} />
          </div>
          <div className="text-3xl font-bold text-ink mb-1">{stats.completed}</div>
          <div className="text-sm text-gray-500">已完成</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 text-center animate-slide-up" style={{ animationDelay: "200ms" }}>
          <div className="w-14 h-14 rounded-full bg-ink/10 flex items-center justify-center mx-auto mb-3">
            <Award className="text-ink" size={28} />
          </div>
          <div className="text-3xl font-bold text-ink mb-1">{stats.certCount}</div>
          <div className="text-sm text-gray-500">获得证书</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task, index) => {
          const progress = getTaskProgress(task.id);
          const isCompleted = progress.status === "completed";
          const isInProgress = progress.status === "in_progress";

          return (
            <div
              key={task.id}
              className={cn(
                "bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300",
                "hover:shadow-xl hover:-translate-y-1 group animate-slide-up"
              )}
              style={{ animationDelay: `${(index + 3) * 100}ms` }}
            >
              <div
                className={cn(
                  "h-44 flex items-center justify-center relative overflow-hidden",
                  isCompleted
                    ? "bg-gradient-to-br from-teal via-teal/90 to-ink"
                    : isInProgress
                    ? "bg-gradient-to-br from-gold via-gold/90 to-ink"
                    : "bg-gradient-to-br from-ink via-ink/90 to-teal"
                )}
              >
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-4 left-4 w-20 h-20 border-2 border-gold/50 rounded-full" />
                  <div className="absolute bottom-4 right-4 w-16 h-16 border-2 border-gold/30 rounded-full" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-gold/20 rounded-full" />
                </div>
                <BookOpen
                  size={64}
                  className={cn(
                    "relative z-10 transition-transform duration-500",
                    "group-hover:scale-110",
                    isCompleted ? "text-gold" : "text-gold"
                  )}
                />
                {isCompleted && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="w-8 h-8 rounded-full bg-teal flex items-center justify-center">
                      <CheckCircle className="text-white" size={18} />
                    </div>
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="font-serif text-xl font-bold text-ink mb-2">
                  {task.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {task.description}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock size={14} className="mr-1" />
                    {task.quizzes.length} 道测验题
                  </div>
                  {renderStatusBadge(task)}
                </div>
                {renderActionButton(task)}
              </div>
            </div>
          );
        })}
      </div>

      <CertificateModal
        open={showCertificateModal}
        onClose={() => setShowCertificateModal(false)}
        certificate={currentCertificate}
        user={user}
        certificateNo={currentCertificateNo}
      />

      <LoginModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={() => {
          setShowLoginModal(false);
          if (pendingCertificateRequest && currentTask) {
            addCertificate(currentTask.id, currentTask.title, score);
            setTimeout(() => {
              const cert = useUserStore.getState().certificates.find((c) => c.taskId === currentTask.id);
              if (cert) {
                setCurrentCertificate(cert);
                setCurrentCertificateNo(`MUS-${cert.id.replace(/cert_/g, '').toUpperCase()}`);
                setShowCertificateModal(true);
                setPendingCertificateRequest(false);
              }
            }, 50);
          }
          if (pendingViewCertTaskId) {
            const cert = useUserStore.getState().certificates.find((c) => c.taskId === pendingViewCertTaskId);
            if (cert) {
              setCurrentCertificate(cert);
              setCurrentCertificateNo(`MUS-${cert.id.replace(/cert_/g, '').toUpperCase()}`);
              setShowCertificateModal(true);
            }
            setPendingViewCertTaskId(null);
          }
        }}
      />
    </div>
  );
}
