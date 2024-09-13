import React from "react";

const InfoItem: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div>
    <p className="text-sm text-gray-400">{label}</p>
    <p className="text-base font-medium">{value}</p>
  </div>
);

const MyInfo: React.FC = () => (
  <div className="text-white p-4 rounded-lg">
    <div className="space-y-4">
      <InfoItem label="STARTING BALANCE" value="3.2 ETH" />
      <InfoItem label="ENDING BALANCE" value="12.5 ETH" />
      <InfoItem label="PREMIUMS RECEIVED" value="8.9 ETH" />
      <InfoItem label="PAYOUTS LOST" value="3.2 ETH" />
      <InfoItem label="ROUND'S REMAINING BALANCE" value="5.7 ETH" />
    </div>
  </div>
);

export default MyInfo;