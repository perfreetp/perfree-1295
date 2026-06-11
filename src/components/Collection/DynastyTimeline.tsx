import { cn } from '@/lib/utils';
import type { Dynasty } from '@/data/collections';

interface DynastyTimelineProps {
  selected: Dynasty | null;
  onChange: (dynasty: Dynasty | null) => void;
  className?: string;
}

const DYNASTIES: (Dynasty | '全部')[] = ['全部', '商', '周', '秦', '汉', '唐', '宋', '元', '明', '清', '近代'];

export default function DynastyTimeline({ selected, onChange, className }: DynastyTimelineProps) {
  const handleClick = (dynasty: Dynasty | '全部') => {
    if (dynasty === '全部') {
      onChange(null);
    } else {
      onChange(dynasty);
    }
  };

  return (
    <div className={cn('w-full', className)}>
      <div className="relative overflow-x-auto pb-2 md:pb-0">
        <div className="flex flex-col md:flex-row md:items-center min-w-max md:min-w-0 gap-4 md:gap-0 pl-4 md:pl-0">
          {DYNASTIES.map((dynasty, index) => {
            const isSelected = dynasty === '全部' ? selected === null : selected === dynasty;
            const isLast = index === DYNASTIES.length - 1;

            return (
              <div key={dynasty} className="flex items-center">
                <button
                  onClick={() => handleClick(dynasty)}
                  className="group relative flex flex-col md:flex-row md:items-center gap-2 md:gap-3 flex-shrink-0"
                >
                  <div className="relative flex items-center justify-center">
                    {!isLast && (
                      <div
                        className={cn(
                          'hidden md:block absolute h-0.5 top-1/2 left-full transition-colors duration-300',
                          'w-12 lg:w-16',
                          isSelected ? 'bg-gold' : 'bg-gold/30'
                        )}
                      />
                    )}
                    <div
                      className={cn(
                        'relative z-10 flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full border-2 transition-all duration-300',
                        isSelected
                          ? 'border-gold bg-gold text-white shadow-lg shadow-gold/30 scale-110'
                          : 'border-gold/50 bg-white text-ink hover:border-gold hover:bg-gold/5'
                      )}
                    >
                      <span className="text-xs md:text-sm font-bold">{dynasty.charAt(0)}</span>
                    </div>
                  </div>
                  <span
                    className={cn(
                      'text-sm md:text-base font-sans transition-colors duration-300 whitespace-nowrap pl-10 md:pl-0',
                      isSelected ? 'text-gold font-semibold' : 'text-ink/70 group-hover:text-ink'
                    )}
                  >
                    {dynasty}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
