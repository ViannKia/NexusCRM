'use client';

interface PipelineChartProps {
  data: Array<{
    stage: string;
    count: number;
    color: string;
  }>;
}

export default function PipelineChart({ data }: PipelineChartProps) {
  if (data.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No pipeline data available
      </div>
    );
  }

  const maxCount = Math.max(...data.map((item) => item.count));

  return (
    <div className="space-y-4">
      {data.map((item) => {
        const percentage = maxCount > 0 ? (item.count / maxCount) * 100 : 0;

        return (
          <div key={item.stage} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{item.stage}</span>
              <span className="text-gray-600">{item.count} deals</span>
            </div>
            <div className="h-8 w-full rounded-lg bg-gray-100 overflow-hidden">
              <div
                className="h-full rounded-lg transition-all duration-300"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
