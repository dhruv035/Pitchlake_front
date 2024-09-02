const BalanceTooltip: React.FC<BalanceTooltipProps> = ({
  balance,
  children,
}) => {
  return (
    <div className="relative group">
      {children}
      <div className="absolute bottom-full mb-2 hidden group-hover:block text-white p-4 rounded-md border border-[#262626] border-1 bg-[#121212] shadow-sm">
        <h2 className="text-lg font-bold mb-2 border-b border-[#262626]">Balance Distribution</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Locked</span>
            <span>{balance.locked || "0"} ETH</span>
          </div>
          <div className="flex justify-between">
            <span>Unlocked</span>
            <span> {balance.unlocked || "0"} ETH</span>
          </div>
          <div className="flex justify-between">
            <span>Stashed</span>
            <span>{balance.stashed || "0"} ETH</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Tooltip: React.FC<MessageProps> = ({ text, children }) => {
  return (
    <div className="relative group">
      {children}
      <div className="absolute bottom-full mb-2 hidden group-hover:block text-white p-2 rounded-md border border-[#262626] border-1 bg-[#121212] shadow-sm">
        {text}
      </div>
    </div>
  );
};

interface MessageProps {
  text: string;
  children: React.ReactNode;
}

interface BalanceTooltipProps {
  balance: {
    locked: string;
    unlocked: string;
    stashed: string;
  };
  children: React.ReactNode;
}

export { Tooltip, BalanceTooltip };
