import React, { useState, ReactNode } from "react";
import { ChevronLeft } from "lucide-react";
import ActionButton from "@/components/Vault/Utils/ActionButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEthereum } from "@fortawesome/free-brands-svg-icons";
import InputField from "@/components/Vault/Utils/InputField";
import { LayerStackIcon } from "@/components/Icons";
import { formatUnits, parseUnits } from "ethers";
import { useProtocolContext } from "@/context/ProtocolProvider";

interface EditModalProps {
  onConfirm: () => void;
  onClose: () => void;
  showConfirmation: (
    modalHeader: string,
    action: ReactNode,
    onConfirm: () => Promise<void>,
  ) => void;
}
const EditModal: React.FC<EditModalProps> = ({
  onConfirm,
  onClose,
  showConfirmation,
}) => {
  const bidId = "0x123345";
  const oldAmount = "123456789";
  const oldPrice = "1234000000";
  const oldPriceGwei = formatUnits(oldPrice, "gwei");

  const [newPriceGwei, setNewPriceGwei] = useState<string>("");
  const { roundActions } = useProtocolContext();

  // Ensure `priceIncreaseGwei` is valid
  const priceIncreaseGwei =
    newPriceGwei && Number(newPriceGwei) > Number(oldPriceGwei)
      ? Number(newPriceGwei) - Number(oldPriceGwei)
      : 0;

  // Ensure `totalGwei` calculation is valid
  const totalGwei = oldAmount ? Number(oldAmount) * priceIncreaseGwei : 0;

  // Parse `totalGwei` only if it’s valid
  const totalWei = !isNaN(totalGwei)
    ? parseUnits(totalGwei.toString(), "gwei")
    : 0;
  const totalEth = !isNaN(Number(totalWei))
    ? formatUnits(totalWei, "ether")
    : "0";

  const handleEditBid = async (): Promise<void> => {
    await roundActions?.updateBid({
      bidId,
      priceIncrease: parseUnits(priceIncreaseGwei.toString(), "gwei"),
    });
  };

  const isButtonDisabled = () => {
    return !newPriceGwei || Number(newPriceGwei) <= Number(oldPriceGwei);
  };

  const handleSubmit = async () => {
    console.log("Edit Bid confirmation");
    showConfirmation(
      "Update Bid",
      <>
        update your bid? You will be spending an additional
        <br />
        <span className="font-semibold text-[#fafafa]">{totalEth} ETH</span>
      </>,
      handleEditBid,
    );
  };

  return (
    <>
      <div className="bg-[#121212] border border-[#262626] rounded-xl p-4 w-full flex flex-col h-full">
        <div className="flex items-center mb-4">
          <button
            onClick={onClose}
            className="flex justify-center items-center mr-4 w-[44px] h-[44px] rounded-lg border-[1px] border-[#262626] bg-[#0D0D0D]"
          >
            <ChevronLeft className="size-[16px] stroke-[4px] text-[#F5EBB8]" />
          </button>
          <h2 className="text-[#FAFAFA] text-[16px] font-medium text-md">
            Edit Bid
          </h2>
        </div>

        <div className="flex flex-col h-full">
          <div className="flex-grow space-y-6 pt-2">
            <div>
              <InputField
                type="number"
                value={oldAmount}
                label="Current Amount"
                onChange={(_e) => {}}
                placeholder="asdf"
                disabled={true}
                className="text-[#8c8c8c] bg-[#161616] border-[#262626]"
                icon={
                  <LayerStackIcon
                    stroke="#8C8C8C"
                    fill="transparent"
                    classname="absolute right-2 top-1/2 -translate-y-1/2"
                  />
                }
              />
            </div>
            <div>
              <InputField
                type="number"
                value={newPriceGwei}
                label="Enter Price"
                label2={`Current: ${oldPriceGwei} GWEI`}
                onChange={(e) => {
                  const value = e.target.value;
                  const formattedValue = value.includes(".")
                    ? value.slice(0, value.indexOf(".") + 10)
                    : value;
                  setNewPriceGwei(formattedValue);
                }}
                placeholder={`e.g. ${oldPriceGwei}`}
                icon={
                  <FontAwesomeIcon
                    icon={faEthereum}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                }
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between text-sm px-6 pb-1">
          <span className="text-gray-400">Total</span>
          <span>{totalEth} ETH</span>
        </div>
        <div className="flex justify-between text-sm px-6 pb-6">
          <span className="text-gray-400">Balance</span>
          <span>{77.67} ETH</span>
        </div>
        <div className="mt-auto">
          <div className="px-6 flex justify-between text-sm mb-6 pt-6 border-t border-[#262626]">
            <ActionButton
              onClick={() => handleSubmit()}
              disabled={isButtonDisabled()}
              text="Update Bid"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default EditModal;
//const EditModal: React.FC<EditModalProps> = ({
//  onConfirm,
//  onClose,
//  showConfirmation,
//}) => {
//  const bidId = "0x123345";
//  const oldAmount = "123456789";
//  const oldPrice = "1234000000";
//  const oldPriceGwei = formatUnits(oldPrice, "gwei");
//  //  const oldPriceEth = formatUnits(oldPrice, "ether");
//  //  const oldTotalEth = Number(oldAmount) * Number(oldPriceEth);
//  //  const [newTotalEth, setNewTotalEth] = useState<number>();
//
//  const [newPriceGwei, setNewPriceGwei] = useState<string>();
//  const [totalIncrease, setTotalIncrease] = useState<number>();
//  const { roundActions } = useProtocolContext();
//
//  const priceIncreaseGwei =
//    Number(newPriceGwei) <= Number(oldPriceGwei)
//      ? 0
//      : Number(newPriceGwei) - Number(oldPriceGwei);
//
//  const totalGwei = Number(oldAmount) * priceIncreaseGwei;
//  const totalWei = parseUnits(totalGwei.toString(), "gwei");
//  const totalEth = formatUnits(totalWei, "ether");
//
//  const handleEditBid = async (): Promise<void> => {
//    await roundActions?.updateBid({
//      bidId,
//      priceIncrease: parseUnits(priceIncreaseGwei.toString(), "gwei"),
//    });
//  };
//
//  const isButtonDisabled = () => {
//    if (!newPriceGwei || !oldAmount || !oldPriceGwei) {
//      return true;
//    }
//
///    if (newPriceGwei <= oldPriceGwei) {
//      return true;
//    }
//
//    return false;
//  };
//
//  const handleSubmit = () => {
//    console.log("Place Bid confirmation");
//    showConfirmation(
//      "Update Bid",
//      <>
///        update your bid ?
//        <br />
//        You will be spending an additional{" "}
//        <span className="font-semibold text-[#fafafa]">{} ETH</span>
//      </>,
//
//      handleEditBid,
//    );
//  };
//
//  return (
//    <>
//      <div className="bg-[#121212] border border-[#262626] rounded-xl p-4 w-full flex flex-col h-full">
//        <div className="flex items-center mb-4">
//          <button
//            onClick={onClose}
//            className="flex justify-center items-center mr-4 w-[44px] h-[44px] rounded-lg border-[1px] border-[#262626] bg-[#0D0D0D]"
//          >
//            <ChevronLeft className="size-[16px] stroke-[4px] text-[#F5EBB8]" />
//          </button>
//          <h2 className="text-[#FAFAFA] text-[16px] font-medium text-md">
//            Edit Bid
//          </h2>
//        </div>
//
//        <div className="flex flex-col h-full">
//          <div className="flex-grow space-y-6 pt-2">
//            <div>
//              <InputField
//                type="number"
//                value={oldAmount}
//                label="Current Amount"
//                onChange={(_e) => {}}
//                placeholder="asdf"
//                disabled={true}
//                className="text-[#8c8c8c] bg-[#161616] border-[#262626]"
//                icon={
//                  <LayerStackIcon
//                    stroke="#8C8C8C"
//                    fill="transparent"
//                    classname="absolute right-2 top-1/2 -translate-y-1/2"
//                  />
//                }
//              />
//            </div>
//            <div>
//              <InputField
//                type="number"
//                value={newPriceGwei ? newPriceGwei.toString() : "0"}
//                label="Enter Price"
//                label2={`Current: ${oldPriceGwei} GWEI`}
//                onChange={(e) => {
//                  setNewPriceGwei(e.target.value);
//                }}
//                placeholder={`e.g. ${oldPriceGwei}`}
//                icon={
///                  <FontAwesomeIcon
//                    icon={faEthereum}
//                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
//                  />
//                }
//              />
//            </div>
//          </div>
//        </div>
//
//        <div className="flex justify-between text-sm px-6 pb-1">
//          <span className="text-gray-400">Total</span>
//          <span>{totalEth} ETH</span>
//        </div>
//        <div className="flex justify-between text-sm px-6 pb-6">
//          <span className="text-gray-400">Balance</span>
//          <span>{1.234} ETH</span>
//        </div>
//        <div className="mt-auto">
//          <div className="px-6 flex justify-between text-sm mb-6 pt-6 border-t border-[#262626]">
//            <ActionButton
//              onClick={handleSubmit}
//              disabled={isButtonDisabled()}
//              text="Update Bid"
//            />
//          </div>
//        </div>
//      </div>
//    </>
//  );
//};
//
//export default EditModal;
