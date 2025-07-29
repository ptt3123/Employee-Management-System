import React from "react";

const SummaryCard = ({
  icon,
  label,
  value,
}: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-center justify-between bg-white shadow border rounded-lg p-4">
    <div>
      <div className="text-base font-semibold text-gray-700 mb-1">{label}</div>
      <div className="text-2xl font-bold text-blue-700">{value}</div>
    </div>
    <div className="text-3xl">{icon}</div>
  </div>
);

export default SummaryCard;