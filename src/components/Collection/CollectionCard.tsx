import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Collection } from '@/data/collections';

interface CollectionCardProps {
  item: Collection;
  className?: string;
}

export default function CollectionCard({ item, className }: CollectionCardProps) {
  const formatViewCount = (count: number): string => {
    if (count >= 10000) {
      return `${(count / 10000).toFixed(1)}万`;
    }
    return count.toString();
  };

  return (
    <Link
      to={`/exhibition/${item.id}`}
      className={cn('group block overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1', className)}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-ink/5">
        <img
          src={item.images[0]}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="mb-2 font-serif text-lg font-semibold text-white line-clamp-1">
            {item.title}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <span className="rounded bg-gold px-2 py-0.5 text-xs font-medium text-white">
                {item.dynasty}
              </span>
              <span className="rounded bg-gold px-2 py-0.5 text-xs font-medium text-white">
                {item.category}
              </span>
            </div>
            <div className="flex items-center gap-1 text-white/80">
              <Eye className="h-3.5 w-3.5" />
              <span className="text-xs">{formatViewCount(item.viewCount)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
