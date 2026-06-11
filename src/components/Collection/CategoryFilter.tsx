import { cn } from '@/lib/utils';
import type { Category } from '@/data/collections';

interface CategoryFilterProps {
  selected: Category | null;
  onChange: (category: Category | null) => void;
  className?: string;
}

const CATEGORIES: (Category | '全部')[] = ['全部', '书画', '陶瓷', '玉器', '青铜', '其他'];

export default function CategoryFilter({ selected, onChange, className }: CategoryFilterProps) {
  const handleClick = (category: Category | '全部') => {
    if (category === '全部') {
      onChange(null);
    } else {
      onChange(category);
    }
  };

  return (
    <div className={cn('flex flex-wrap gap-3', className)}>
      {CATEGORIES.map((category) => {
        const isSelected = category === '全部' ? selected === null : selected === category;
        return (
          <button
            key={category}
            onClick={() => handleClick(category)}
            className={cn(
              'rounded-lg border px-5 py-2 font-sans text-sm font-medium transition-all',
              isSelected
                ? 'bg-gold text-white border-gold shadow-md'
                : 'bg-white text-ink border-gold hover:bg-gold/5'
            )}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
