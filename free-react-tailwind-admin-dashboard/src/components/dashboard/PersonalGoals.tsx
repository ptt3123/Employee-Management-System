import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface Goal {
  name: string;
  current: number;
  target: number;
  color: string;
  icon: string;
}

export default function PersonalGoals() {
  const goals: Goal[] = [
    {
      name: "Chấm công đúng giờ",
      current: 16,
      target: 20,
      color: "#10B981",
      icon: "⏰"
    },
    {
      name: "Hoàn thành task",
      current: 25,
      target: 25,
      color: "#3B82F6",
      icon: "✅"
    },
    {
      name: "Không nghỉ phép",
      current: 25,
      target: 30,
      color: "#F59E0B",
      icon: "🎯"
    }
  ];

  // Calculate overall progress
  const overallProgress = goals.reduce((acc, goal) => {
    return acc + (goal.current / goal.target);
  }, 0) / goals.length * 100;

  const chartOptions: ApexOptions = {
    chart: {
      type: "radialBar",
      height: 200,
      sparkline: {
        enabled: true
      }
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        hollow: {
          size: "60%"
        },
        track: {
          background: "#E5E7EB",
          strokeWidth: "100%",
          margin: 5
        },
        dataLabels: {
          name: {
            show: false
          },
          value: {
            fontSize: "24px",
            fontWeight: "600",
            color: "#1F2937",
            formatter: (val) => `${Math.round(val)}%`
          }
        }
      }
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        shadeIntensity: 0.1,
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 50, 53, 91]
      }
    },
    colors: ["#3B82F6"]
  };

  const chartSeries = [overallProgress];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Mục tiêu cá nhân</h3>
          <p className="text-sm text-gray-500 mt-1">Tiến độ tháng này</p>
        </div>
      </div>

      {/* Overall Progress Chart */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <Chart options={chartOptions} series={chartSeries} type="radialBar" height={200} />
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
              Tổng tiến độ
            </span>
          </div>
        </div>
      </div>

      {/* Individual Goals */}
      <div className="space-y-4">
        {goals.map((goal, index) => {
          const percentage = Math.min((goal.current / goal.target) * 100, 100);
          const isCompleted = goal.current >= goal.target;
          
          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{goal.icon}</span>
                  <span className="text-sm font-medium text-gray-700">{goal.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {goal.current}/{goal.target}
                  </span>
                  {isCompleted && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                      Hoàn thành
                    </span>
                  )}
                </div>
              </div>
              
              <div className="relative">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full transition-all duration-500 ease-out rounded-full"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: goal.color
                    }}
                  ></div>
                </div>
                
                {/* Progress percentage */}
                <div className="flex justify-end mt-1">
                  <span className="text-xs text-gray-500">
                    {Math.round(percentage)}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Achievement Badge */}
      {overallProgress >= 90 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🏆</div>
            <div>
              <h4 className="text-sm font-semibold text-green-800">Xuất sắc!</h4>
              <p className="text-xs text-green-600">Bạn đang đạt hiệu suất cao trong tháng này</p>
            </div>
          </div>
        </div>
      )}

      {/* Motivational Message */}
      {overallProgress < 50 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
          <div className="flex items-center gap-3">
            <div className="text-2xl">💪</div>
            <div>
              <h4 className="text-sm font-semibold text-blue-800">Cố lên!</h4>
              <p className="text-xs text-blue-600">Bạn có thể cải thiện thêm trong thời gian tới</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
