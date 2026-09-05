import type { RiskLevel } from '@/lib/types';

interface RiskMeterProps {
  score: number;
  level: RiskLevel;
}

export function RiskMeter({ score, level }: RiskMeterProps) {
  const rotation = (score / 100) * 180 - 90;
  const color =
    level === 'HIGH'
      ? 'text-red-500'
      : level === 'MEDIUM'
        ? 'text-amber-500'
        : 'text-emerald-500';

  const bgColor =
    level === 'HIGH'
      ? 'from-red-500 to-red-600'
      : level === 'MEDIUM'
        ? 'from-amber-500 to-amber-600'
        : 'from-emerald-500 to-emerald-600';

  return (
    <div className="flex flex-col items-center">
      {/* Gauge */}
      <div className="relative w-48 h-28 overflow-hidden">
        {/* Background arc */}
        <div className="absolute inset-0 rounded-t-full risk-gradient opacity-90" />
        {/* Mask center */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full bg-white dark:bg-[#121826]" />
        {/* Needle */}
        <div
          className="absolute bottom-0 left-1/2 origin-bottom transition-transform duration-1000 ease-out"
          style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
        >
          <div className="w-1 h-20 bg-gray-800 dark:bg-gray-200 rounded-full" />
        </div>
        {/* Center dot */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gray-800 dark:bg-gray-200 -mb-2" />
      </div>

      {/* Score display */}
      <div className={`mt-2 text-center bg-gradient-to-r ${bgColor} bg-clip-text`}>
        <div className="flex items-baseline justify-center gap-1">
          <span className={`text-5xl font-extrabold ${color}`}>{score}</span>
          <span className="text-xl font-bold text-gray-400">/100</span>
        </div>
        <div className={`text-lg font-bold tracking-wide ${color} mt-1`}>
          {level === 'HIGH' && '⚠ HIGH RISK'}
          {level === 'MEDIUM' && '⚡ MEDIUM RISK'}
          {level === 'LOW' && '✓ LOW RISK'}
        </div>
      </div>
    </div>
  );
}
