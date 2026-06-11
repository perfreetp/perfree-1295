import { useState } from "react";
import { X, ChevronLeft, ChevronRight, MapPin } from "lucide-react";

interface VirtualTourProps {
  isOpen: boolean;
  onClose: () => void;
}

const sceneImages = (prompt: string) =>
  `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=landscape_16_9`;

const scenes = [
  {
    id: "main",
    name: "正厅",
    description: "博物馆主大厅，宏伟的穹顶与金色装饰",
    image: sceneImages("中国国家博物馆正厅大厅，宏伟穹顶，金色装饰，大理石柱子，博物馆内景，国潮风格，高端大气"),
  },
  {
    id: "east",
    name: "东展厅",
    description: "东方艺术珍品展厅，展示历代书画与陶瓷",
    image: sceneImages("博物馆东展厅，中国古代书画和陶瓷陈列，展柜精美，灯光柔和，国潮风格，文化氛围"),
  },
  {
    id: "west",
    name: "西展厅",
    description: "西方文明交流展厅，展示丝绸之路文物",
    image: sceneImages("博物馆西展厅，丝绸之路文物，中西文化交流展品，历史遗迹，国潮风格，典雅设计"),
  },
  {
    id: "treasure",
    name: "珍宝馆",
    description: "镇馆之宝专馆，展示最珍贵的文物",
    image: sceneImages("博物馆珍宝馆，珍贵文物展示，独立展柜，聚光灯照射，国宝级文物，国潮风格，尊贵大气"),
  },
];

export default function VirtualTour({ isOpen, onClose }: VirtualTourProps) {
  const [currentScene, setCurrentScene] = useState(0);
  const [rotation, setRotation] = useState(0);

  const nextScene = () => {
    setCurrentScene((prev) => (prev + 1) % scenes.length);
    setRotation(0);
  };

  const prevScene = () => {
    setCurrentScene((prev) => (prev - 1 + scenes.length) % scenes.length);
    setRotation(0);
  };

  const rotateLeft = () => {
    setRotation((prev) => prev - 30);
  };

  const rotateRight = () => {
    setRotation((prev) => prev + 30);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 animate-fade-in">
      <div className="relative w-full max-w-5xl mx-4 bg-ink rounded-2xl overflow-hidden shadow-2xl animate-scale-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gold/30">
          <div>
            <h2 className="font-serif text-xl font-bold text-gold">360° 虚拟漫游</h2>
            <p className="text-sm text-cream/60 mt-1">
              {scenes[currentScene].name} - {scenes[currentScene].description}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gold/20 text-cream hover:text-gold transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="relative aspect-video bg-black overflow-hidden">
          <img
            src={scenes[currentScene].image}
            alt={scenes[currentScene].name}
            className="w-full h-full object-cover transition-transform duration-500"
            style={{ transform: `scale(1.2) rotateY(${rotation}deg)` }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          <button
            onClick={rotateLeft}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gold/20 backdrop-blur-sm flex items-center justify-center hover:bg-gold/40 text-gold transition-colors border border-gold/30"
          >
            <ChevronLeft size={28} />
          </button>
          <button
            onClick={rotateRight}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gold/20 backdrop-blur-sm flex items-center justify-center hover:bg-gold/40 text-gold transition-colors border border-gold/30"
          >
            <ChevronRight size={28} />
          </button>

          <button
            onClick={prevScene}
            className="absolute left-4 bottom-20 w-10 h-10 rounded-full bg-ink/60 backdrop-blur-sm flex items-center justify-center hover:bg-gold text-cream hover:text-ink transition-colors"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={nextScene}
            className="absolute right-4 bottom-20 w-10 h-10 rounded-full bg-ink/60 backdrop-blur-sm flex items-center justify-center hover:bg-gold text-cream hover:text-ink transition-colors"
          >
            <ChevronRight size={22} />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
            {scenes.map((scene, idx) => (
              <button
                key={scene.id}
                onClick={() => {
                  setCurrentScene(idx);
                  setRotation(0);
                }}
                className={`group flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                  idx === currentScene
                    ? "bg-gold text-ink"
                    : "bg-ink/60 text-cream hover:bg-gold/30"
                }`}
              >
                <MapPin size={16} />
                <span className="text-sm font-medium">{scene.name}</span>
              </button>
            ))}
          </div>

          <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-gold/20 backdrop-blur-sm border border-gold/30">
            <span className="text-gold text-sm font-medium">
              {currentScene + 1} / {scenes.length}
            </span>
          </div>
        </div>

        <div className="px-6 py-3 border-t border-gold/30">
          <p className="text-cream/60 text-xs text-center">
            提示：使用左右箭头切换场景，使用旋转按钮查看360°全景
          </p>
        </div>
      </div>
    </div>
  );
}
