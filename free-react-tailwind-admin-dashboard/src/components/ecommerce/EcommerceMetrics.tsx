import {
  ArrowDownIcon,
  ArrowUpIcon,
  BoxIconLine,
  GroupIcon,
} from "../../icons";
import Badge from "../ui/badge/Badge";

export default function EcommerceMetrics() {
   return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* Tổng số ca làm trong tuần */}
      <div className="rounded-2xl border bg-white p-5 dark:bg-white/[0.03]">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl">
          <GroupIcon className="text-gray-800 size-6" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500">Số ca trong tuần</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm">
              10 ca
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            +2 ca
          </Badge>
        </div>
      </div>

      {/* Ca tiếp theo */}
      <div className="rounded-2xl border bg-white p-5 dark:bg-white/[0.03]">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl">
          <BoxIconLine className="text-gray-800 size-6" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500">Ca tiếp theo</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm">
              8:30 - 12:30, 5/7/2025
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
}
