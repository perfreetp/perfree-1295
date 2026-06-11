import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { X, Landmark } from 'lucide-react';
import { useCollectionStore } from '@/stores/useCollectionStore';
import { exhibitions } from '@/data/exhibitions';
import type { Category, Dynasty } from '@/data/collections';
import SearchBar from '@/components/Collection/SearchBar';
import CategoryFilter from '@/components/Collection/CategoryFilter';
import DynastyTimeline from '@/components/Collection/DynastyTimeline';
import CollectionCard from '@/components/Collection/CollectionCard';

const EXHIBITION_FILTER_MAP: Record<string, { category?: Category; dynasty?: Dynasty }> = {
  e001: { category: '青铜' },
  e002: { category: '陶瓷' },
  e003: { category: '书画' },
  e004: { dynasty: '唐' },
  e005: { category: '玉器' },
  e006: { dynasty: '秦' },
};

export default function Exhibition() {
  const [searchParams, setSearchParams] = useSearchParams();
  const exhibitionId = searchParams.get('exhibition');

  const {
    items,
    searchKeyword,
    selectedCategory,
    selectedDynasty,
    setSearchKeyword,
    setCategory,
    setDynasty,
  } = useCollectionStore();

  useEffect(() => {
    if (exhibitionId && EXHIBITION_FILTER_MAP[exhibitionId]) {
      const filter = EXHIBITION_FILTER_MAP[exhibitionId];
      if (filter.category) {
        setCategory(filter.category);
      }
      if (filter.dynasty) {
        setDynasty(filter.dynasty);
      }
    }
  }, [exhibitionId, setCategory, setDynasty]);

  const activeExhibition = useMemo(() => {
    if (!exhibitionId) return null;
    return exhibitions.find((e) => e.id === exhibitionId) ?? null;
  }, [exhibitionId]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = !searchKeyword || item.title.includes(searchKeyword) || item.description.includes(searchKeyword);
      const matchesCategory = !selectedCategory || item.category === selectedCategory;
      const matchesDynasty = !selectedDynasty || item.dynasty === selectedDynasty;
      return matchesSearch && matchesCategory && matchesDynasty;
    });
  }, [items, searchKeyword, selectedCategory, selectedDynasty]);

  const handleCloseExhibition = () => {
    setCategory(null);
    setDynasty(null);
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-cream">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-ink mb-3">云展厅</h1>
          <p className="text-ink/60 max-w-2xl mx-auto">
            足不出户，畅游千年文化瑰宝。在这里，您可以浏览各类主题展览，欣赏珍贵文物。
          </p>
        </div>

        <div className="mb-6">
          <SearchBar value={searchKeyword} onChange={setSearchKeyword} />
        </div>

        <div className="mb-6">
          <CategoryFilter selected={selectedCategory} onChange={setCategory} />
        </div>

        <div className="mb-8">
          <DynastyTimeline selected={selectedDynasty} onChange={setDynasty} />
        </div>

        {activeExhibition && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-gold/30 bg-gradient-to-r from-gold/10 to-gold/5 px-5 py-3">
            <Landmark className="h-5 w-5 flex-shrink-0 text-gold" />
            <span className="font-serif text-sm font-semibold text-ink md:text-base">
              当前主题：{activeExhibition.title}
            </span>
            <span className="text-xs text-ink/50 md:text-sm">
              — 已为您筛选相关藏品
            </span>
            <button
              onClick={handleCloseExhibition}
              className="ml-auto flex-shrink-0 rounded-full p-1 text-ink/40 transition-colors hover:bg-ink/10 hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-5">
            {filteredItems.map((item) => (
              <CollectionCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Landmark className="mb-4 h-16 w-16 text-gold/30" />
            <p className="font-serif text-xl font-semibold text-ink/40">暂无匹配的藏品</p>
            <p className="mt-2 text-sm text-ink/30">请尝试调整搜索条件或筛选选项</p>
          </div>
        )}
      </div>
    </div>
  );
}
