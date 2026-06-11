import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Volume2,
  Play,
  Pause,
  Eye,
  Heart,
  Share2,
  Download,
  Globe,
  X,
  MessageCircle,
  ThumbsUp,
  Send,
} from "lucide-react";
import { collections } from "@/data/collections";
import { useUserStore } from "@/stores/useUserStore";
import { useCollectionStore } from "@/stores/useCollectionStore";
import VirtualTour from "@/components/Collection/VirtualTour";
import { defaultUsers } from "@/data/users";

interface CommentItem {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  type: "comment" | "question";
  createdAt: string;
  likes: number;
  liked: boolean;
  reviewStatus: "pending" | "approved" | "rejected";
}

const mockComments: CommentItem[] = [
  {
    id: "cmt001",
    userId: "u002",
    userName: defaultUsers[1].nickname,
    userAvatar: defaultUsers[1].avatar,
    content: "这件文物真是太精美了！青铜工艺达到如此高超的水平，让人叹为观止。每次来博物馆都要仔细欣赏一番。",
    type: "comment",
    createdAt: "2025-05-15 14:30",
    likes: 28,
    liked: false,
    reviewStatus: "approved",
  },
  {
    id: "cmt002",
    userId: "u003",
    userName: defaultUsers[2].nickname,
    userAvatar: defaultUsers[2].avatar,
    content: "请问这件文物的具体出土地点是哪里？有没有相关的考古报告可以参考？",
    type: "question",
    createdAt: "2025-05-14 09:15",
    likes: 12,
    liked: false,
    reviewStatus: "approved",
  },
  {
    id: "cmt003",
    userId: "u001",
    userName: defaultUsers[0].nickname,
    userAvatar: defaultUsers[0].avatar,
    content: "作为博物馆工作人员，很高兴看到大家对传统文化的热爱。这件文物承载着中华民族几千年的智慧结晶，值得我们细细品味。",
    type: "comment",
    createdAt: "2025-05-13 16:45",
    likes: 56,
    liked: false,
    reviewStatus: "approved",
  },
  {
    id: "cmt004",
    userId: "u002",
    userName: defaultUsers[1].nickname,
    userAvatar: defaultUsers[1].avatar,
    content: "纹饰细节太精致了，特别是兽面纹的雕刻，每一笔都蕴含着深厚的文化内涵。",
    type: "comment",
    createdAt: "2025-05-12 11:20",
    likes: 34,
    liked: false,
    reviewStatus: "approved",
  },
  {
    id: "cmt005",
    userId: "u003",
    userName: defaultUsers[2].nickname,
    userAvatar: defaultUsers[2].avatar,
    content: "想了解一下当时铸造这件青铜器需要多长时间？使用的是什么工艺方法？",
    type: "question",
    createdAt: "2025-05-11 20:10",
    likes: 18,
    liked: false,
    reviewStatus: "approved",
  },
];

export default function CollectionDetail() {
  const { id } = useParams<{ id: string }>();
  const items = useCollectionStore((s) => s.items);
  const storeComments = useCollectionStore((s) => s.comments);
  const incrementViewCount = useCollectionStore((s) => s.incrementViewCount);
  const addComment = useCollectionStore((s) => s.addComment);
  const toggleFavorite = useUserStore((s) => s.toggleFavorite);
  const favorites = useUserStore((s) => s.favorites);
  const addBrowseHistory = useUserStore((s) => s.addBrowseHistory);

  const collection = items.find((c) => c.id === id) || items[0] || collections[0];

  const [currentImage, setCurrentImage] = useState(0);
  const [imageKey, setImageKey] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isVirtualTourOpen, setIsVirtualTourOpen] = useState(false);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [activeTab, setActiveTab] = useState<"comment" | "question">("comment");
  const [inputValue, setInputValue] = useState("");
  const [viewed, setViewed] = useState(false);

  const userAvatarMap: Record<string, string> = {
    "u001": defaultUsers[0].avatar,
    "u002": defaultUsers[1].avatar,
    "u003": defaultUsers[2].avatar,
  };

  const mergedComments: CommentItem[] = [
    ...storeComments
      .filter((c) => c.collectionId === collection.id)
      .map((c) => ({
        id: c.id,
        userId: c.userId,
        userName: c.username,
        userAvatar: userAvatarMap[c.userId] || defaultUsers[1].avatar,
        content: c.content,
        type: c.type,
        createdAt: c.date,
        likes: 0,
        liked: false,
        reviewStatus: c.reviewStatus,
      })),
    ...mockComments,
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const [localComments, setLocalComments] = useState<CommentItem[]>(mergedComments);

  const isFavorite = favorites.includes(collection.id);

  useEffect(() => {
    if (!viewed && collection) {
      incrementViewCount(collection.id);
      addBrowseHistory(collection.id, collection.title, collection.images[0]);
      setViewed(true);
    }
  }, [collection, viewed, incrementViewCount, addBrowseHistory]);

  useEffect(() => {
    setLocalComments(mergedComments);
  }, [mergedComments]);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % collection.images.length);
    setImageKey((k) => k + 1);
  };

  const prevImage = () => {
    setCurrentImage(
      (prev) => (prev - 1 + collection.images.length) % collection.images.length
    );
    setImageKey((k) => k + 1);
  };

  const selectImage = (index: number) => {
    setCurrentImage(index);
    setImageKey((k) => k + 1);
  };

  const toggleAudio = () => {
    setIsPlayingAudio((prev) => !prev);
  };

  const toggleVideo = () => {
    setIsPlayingVideo((prev) => !prev);
  };

  const handleToggleFavorite = () => {
    toggleFavorite(collection.id);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: collection.title,
        text: collection.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = collection.images[0];
    link.download = `${collection.title}.jpg`;
    link.target = "_blank";
    link.click();
  };

  const handleLike = (commentId: string) => {
    setLocalComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? {
              ...c,
              liked: !c.liked,
              likes: c.liked ? c.likes - 1 : c.likes + 1,
            }
          : c
      )
    );
  };

  const handleSubmit = () => {
    if (!inputValue.trim()) return;
    const content = inputValue.trim();
    const newComment: CommentItem = {
      id: `cmt_${Date.now()}`,
      userId: defaultUsers[1].id,
      userName: defaultUsers[1].nickname,
      userAvatar: defaultUsers[1].avatar,
      content,
      type: activeTab,
      createdAt: new Date().toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
      likes: 0,
      liked: false,
      reviewStatus: "pending",
    };
    addComment(collection.id, defaultUsers[1].id, defaultUsers[1].nickname, content, 0, activeTab, "pending");
    setLocalComments((prev) => [newComment, ...prev]);
    setInputValue("");
  };

  const filteredComments = localComments.filter((c) => c.type === activeTab);

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        to="/exhibition"
        className="inline-flex items-center text-gray-600 hover:text-gold mb-6 transition-colors"
      >
        <ChevronLeft size={20} />
        <span>返回展厅</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden aspect-square">
              <img
                key={imageKey}
                src={collection.images[currentImage]}
                alt={collection.title}
                className="w-full h-full object-cover animate-fade-in"
              />
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center hover:bg-white transition-colors"
              >
                <ChevronLeft size={24} className="text-ink" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center hover:bg-white transition-colors"
              >
                <ChevronRight size={24} className="text-ink" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {collection.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => selectImage(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      idx === currentImage
                        ? "bg-gold w-6"
                        : "bg-white/60 hover:bg-white/80"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="w-20 flex flex-col gap-2 overflow-y-auto scrollbar-hide">
            {collection.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => selectImage(idx)}
                className={`relative w-full aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                  idx === currentImage
                    ? "border-gold shadow-md"
                    : "border-transparent hover:border-gold/50"
                }`}
              >
                <img
                  src={img}
                  alt={`${collection.title} ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                {idx === currentImage && (
                  <div className="absolute inset-0 bg-gold/10" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center space-x-3 mb-3">
            <span className="px-3 py-1 bg-teal/10 text-teal rounded-full text-sm font-medium">
              {collection.category}
            </span>
            <span className="px-3 py-1 bg-gold/10 text-gold rounded-full text-sm font-medium">
              {collection.dynasty}代
            </span>
            <span className="flex items-center text-sm text-gray-500">
              <Eye size={14} className="mr-1" />
              {collection.viewCount.toLocaleString()} 次浏览
            </span>
          </div>

          <h1 className="text-3xl font-serif font-bold text-ink mb-4">
            {collection.title}
          </h1>

          <div className="prose prose-gray max-w-none mb-8">
            <p className="text-gray-700 leading-relaxed text-lg">
              {collection.description}
            </p>
          </div>

          <div className="bg-cream rounded-xl p-6 mb-6">
            <h3 className="font-serif text-lg font-bold text-ink mb-4">相关信息</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-500">文物名称</span>
                <p className="font-medium text-ink">{collection.title}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">所属朝代</span>
                <p className="font-medium text-ink">{collection.dynasty}代</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">文物类别</span>
                <p className="font-medium text-ink">{collection.category}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">浏览次数</span>
                <p className="font-medium text-ink">
                  {collection.viewCount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={toggleAudio}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg transition-all ${
                isPlayingAudio
                  ? "bg-gold text-white"
                  : "bg-ink text-white hover:bg-ink/90"
              }`}
            >
              {isPlayingAudio ? <Pause size={18} /> : <Volume2 size={18} />}
              <span className="text-sm">{isPlayingAudio ? "暂停讲解" : "语音讲解"}</span>
            </button>

            <button
              onClick={() => setIsVideoModalOpen(true)}
              className="flex items-center space-x-2 px-5 py-2.5 border border-gold text-gold rounded-lg hover:bg-gold hover:text-white transition-colors"
            >
              <Play size={18} />
              <span className="text-sm">视频介绍</span>
            </button>

            <button
              onClick={() => setIsVirtualTourOpen(true)}
              className="flex items-center space-x-2 px-5 py-2.5 border border-teal text-teal rounded-lg hover:bg-teal hover:text-white transition-colors"
            >
              <Globe size={18} />
              <span className="text-sm">虚拟漫游</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleFavorite}
                className={`p-2.5 border rounded-lg transition-all ${
                  isFavorite
                    ? "border-gold bg-gold/10 text-gold"
                    : "border-gray-200 hover:border-gold hover:text-gold"
                }`}
              >
                <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
              </button>
              <button
                onClick={handleShare}
                className="p-2.5 border border-gray-200 rounded-lg hover:border-gold hover:text-gold transition-colors"
              >
                <Share2 size={20} />
              </button>
              <button
                onClick={handleDownload}
                className="p-2.5 border border-gray-200 rounded-lg hover:border-gold hover:text-gold transition-colors"
              >
                <Download size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="border-b border-gray-100">
          <div className="flex">
            <button
              onClick={() => setActiveTab("comment")}
              className={`flex-1 px-6 py-4 font-medium transition-all relative ${
                activeTab === "comment"
                  ? "text-gold"
                  : "text-gray-500 hover:text-ink"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <MessageCircle size={18} />
                <span>评论 ({localComments.filter((c) => c.type === "comment").length})</span>
              </div>
              {activeTab === "comment" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("question")}
              className={`flex-1 px-6 py-4 font-medium transition-all relative ${
                activeTab === "question"
                  ? "text-gold"
                  : "text-gray-500 hover:text-ink"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <MessageCircle size={18} />
                <span>提问 ({localComments.filter((c) => c.type === "question").length})</span>
              </div>
              {activeTab === "question" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />
              )}
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex gap-4 mb-6">
            <img
              src={defaultUsers[1].avatar}
              alt={defaultUsers[1].nickname}
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1 flex gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder={
                  activeTab === "comment"
                    ? "发表你的评论..."
                    : "提出你的问题..."
                }
                className="flex-1 px-4 py-2.5 bg-cream rounded-lg border border-gray-200 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-colors"
              />
              <button
                onClick={handleSubmit}
                disabled={!inputValue.trim()}
                className="px-5 py-2.5 bg-gradient-gold text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send size={18} />
                <span>提交</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredComments.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <MessageCircle size={48} className="mx-auto mb-3 opacity-30" />
                <p>暂无{activeTab === "comment" ? "评论" : "提问"}，快来第一条吧！</p>
              </div>
            ) : (
              filteredComments.map((comment) => (
                <div
                  key={comment.id}
                  className="flex gap-4 p-4 bg-cream/50 rounded-xl animate-fade-in"
                >
                  <img
                    src={comment.userAvatar}
                    alt={comment.userName}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-ink">{comment.userName}</span>
                        {comment.type === "question" && (
                          <span className="px-2 py-0.5 bg-teal/10 text-teal text-xs rounded-full">
                            提问
                          </span>
                        )}
                        {comment.reviewStatus === "pending" && (
                          <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                            审核中
                          </span>
                        )}
                        {comment.reviewStatus === "rejected" && (
                          <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
                            已驳回
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-gray-400">{comment.createdAt}</span>
                    </div>
                    {comment.reviewStatus === "rejected" ? (
                      <p className="text-gray-400 italic leading-relaxed mb-3">
                        该评论已被驳回
                      </p>
                    ) : (
                      <p className={`leading-relaxed mb-3 ${comment.reviewStatus === "pending" ? "text-gray-600" : "text-gray-700"}`}>
                        {comment.content}
                      </p>
                    )}
                    <div className="flex items-center">
                      <button
                        onClick={() => handleLike(comment.id)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm transition-all ${
                          comment.liked
                            ? "bg-gold/10 text-gold"
                            : "text-gray-400 hover:text-gold hover:bg-gold/5"
                        }`}
                      >
                        <ThumbsUp
                          size={16}
                          fill={comment.liked ? "currentColor" : "none"}
                        />
                        <span>{comment.likes}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 animate-fade-in">
          <div className="relative w-full max-w-4xl mx-4 bg-ink rounded-2xl overflow-hidden shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gold/30">
              <h2 className="font-serif text-xl font-bold text-gold">
                {collection.title} - 视频介绍
              </h2>
              <button
                onClick={() => {
                  setIsVideoModalOpen(false);
                  setIsPlayingVideo(false);
                }}
                className="p-2 rounded-full hover:bg-gold/20 text-cream hover:text-gold transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="relative aspect-video bg-black">
              <img
                src={collection.images[0]}
                alt={collection.title}
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={toggleVideo}
                  className="w-20 h-20 rounded-full bg-gold/90 flex items-center justify-center hover:bg-gold transition-colors shadow-2xl"
                >
                  {isPlayingVideo ? (
                    <Pause size={36} className="text-ink" />
                  ) : (
                    <Play size={36} className="text-ink ml-1" />
                  )}
                </button>
              </div>
              {isPlayingVideo && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gold/30">
                  <div className="h-full bg-gold animate-pulse" style={{ width: "45%" }} />
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gold/30">
              <p className="text-cream/70 text-sm text-center">
                {isPlayingVideo ? "正在播放视频介绍..." : "点击播放按钮观看视频介绍"}
              </p>
            </div>
          </div>
        </div>
      )}

      <VirtualTour
        isOpen={isVirtualTourOpen}
        onClose={() => setIsVirtualTourOpen(false)}
      />
    </div>
  );
}
