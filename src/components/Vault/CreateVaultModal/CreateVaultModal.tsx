// import { InputNumber, Modal, Radio, RadioChangeEvent } from "antd";
// import { Vault, VaultCreationParams, VaultTimeForLiquidity, VaultTimeForTrading, VaultTimeToMaturity } from "types";
// import { parseEther, parseUnits } from "@ethersproject/units";
// import { useContext, useState } from "react";

// import DepositsControllerABI from "../../abis/DepositsController.json";
// import ERC20ABI from "../../abis/ERC20.json";
// import Footer from "./Footer";
// import GlobalContext from "context";
// import { TransactionStatus } from "@usedapp/core";
// import VaultABI from "../../abis/BaseOptionsSellingVault.json";
// import VaultDeployerABI from "../../abis/VaultsDeployer.json";
// import classes from "./CreateVaultModal.module.css";
// import { ethers } from "ethers";
// import { getPitchlakeFactoryInstance } from "utils";
// import inputs from "styles/Input.module.css";
// import moment from "moment";
// import useTransaction from "hooks/useTransaction";

// type Props = {
//   isModalVisible: boolean;
//   closeModal: () => void;
// };

// const CreateVaultModal = ({ isModalVisible, closeModal }: Props) => {
//   const { vaults } = useContext(GlobalContext);
//   const sendTransactionWithToasts = useTransaction();
//   const [timeToMaturity, setTimeToMaturity] = useState<VaultTimeToMaturity>(VaultTimeToMaturity.ONE_MONTH);
//   const [liquidityTimeframe, setLiquidityTimeframe] = useState<VaultTimeForLiquidity>(VaultTimeForLiquidity.THREE_DAYS);
//   const [tradingTimeframe, setTradingTimeframe] = useState<VaultTimeForTrading>(VaultTimeForTrading.THREE_DAYS);
//   const [newVaultParams, setNewVaultParams] = useState<Partial<VaultCreationParams>>(getVaultParams);

//   const [isPut, setIsPut] = useState(true);
//   const [optionTimeToMaturity, setOptionTimeToMaturity] = useState("86400");

//   const onTxSuccess = (status: TransactionStatus) => {
//     // const vault = Vault.fromTxReceipt(status.receipt);
//     const vault = new Vault();
//     vaults.addNew(vault);
//     console.log("added");
//   };
//   // const createVault = async () => {
//   //   const factory = getPitchlakeFactoryInstance();
//   //   const creationTx = await factory.populateTransaction.createStrategy(newVaultParams);
//   //   sendTransactionWithToasts(creationTx, onTxSuccess);
//   //   closeModal();
//   // };

//   const onTimeToMaturitySelect = (e: RadioChangeEvent) => {
//     setTimeToMaturity(e.target.value);
//     const [amount, unit]: any[] = e.target.value.split(" ");
//     setNewVaultParams({
//       ...newVaultParams,
//       strategyLength: moment.duration(amount, unit).asSeconds().toString(),
//     });
//   };

//   const onLiquidityTimeframeSelect = (e: RadioChangeEvent) => {
//     setLiquidityTimeframe(e.target.value);
//     const [amount, unit]: any[] = e.target.value.split(" ");
//     const liquidityPeriod = moment.duration(amount, unit).asSeconds();
//     setNewVaultParams({
//       ...newVaultParams,
//       liquidityTimeframeLength: liquidityPeriod.toString(),
//     });
//   };

//   const onTradingTimeframeSelect = (e: RadioChangeEvent) => {
//     setTradingTimeframe(e.target.value);
//     const [amount, unit]: any[] = e.target.value.split(" ");
//     const tradingPeriod = moment.duration(amount, unit).asSeconds();
//     setNewVaultParams({
//       ...newVaultParams,
//       tradingTimeframeLength: tradingPeriod.toString(),
//     });
//   };

//   const onCrChange = (value: number) => {
//     const crToBone = parseEther("1")
//       .mul(value || 0)
//       .div(100);
//     setNewVaultParams({ ...newVaultParams, cr: crToBone.toString() });
//   };

//   const onStrikeChange = (value: number) => {
//     const strikeToGwei = parseUnits(String(value || 0), "gwei");
//     setNewVaultParams({
//       ...newVaultParams,
//       strike: strikeToGwei.toString(),
//     });
//   };

//   const createVault = async () => {
//     const vaultDeployerAddr = process.env.NEXT_PUBLIC_VAULT_DEPLOYER_ADDRESS;
//     const vaultDeployer = new ethers.Contract(vaultDeployerAddr, VaultDeployerABI);
//     const creationTx = await vaultDeployer.populateTransaction.deployVault({
//       isPut,
//       optionTimeToMaturity,
//       auctionDuration: Number(optionTimeToMaturity) / 2,
//       auctionMinOptionsAmount: "100",
//     });
//     sendTransactionWithToasts(creationTx, (status: TransactionStatus) => {
//       console.log("vault created");
//     });
//   };

//   const approve = async () => {
//     const depositAmount = "10000000000000000000";
//     const depositsControllerAddr = "0x5720df00ad4bc84620e6aec6c5f9a4294726f5ba";
//     const weth9Addr = "0x3783c2688ec3a10f3afcfcf8c44d35d85bf19ab8";

//     const weth9Instance = new ethers.Contract(weth9Addr, ERC20ABI);

//     const creationTx = await weth9Instance.populateTransaction.approve(depositsControllerAddr, depositAmount);
//     sendTransactionWithToasts(creationTx, (status: TransactionStatus) => {
//       console.log("Approve token spend");
//     });
//   };

//   const deposit = async () => {
//     const userAddr = "0x8a7f1b9ABC33083aecd0d7f024B5aC9BB78DC04f";
//     const depositAmount = "10000000000000000000";
//     const depositsControllerAddr = "0x5720df00ad4bc84620e6aec6c5f9a4294726f5ba";

//     const depositsControllerInstance = new ethers.Contract(depositsControllerAddr, DepositsControllerABI);
//     const creationTx = await depositsControllerInstance.populateTransaction.deposit(depositAmount, userAddr);
//     sendTransactionWithToasts(creationTx, (status: TransactionStatus) => {
//       console.log("Deposits spend");
//     });
//   };

//   return (
//     <Modal
//       title="Create a Vault"
//       visible={isModalVisible}
//       className={classes.modal}
//       onCancel={closeModal}
//       footer={<Footer createVault={createVault} />}
//     >
//       <label>
//         isPut
//         <input
//           type="checkbox"
//           defaultChecked={isPut}
//           onChange={(e) => setIsPut(e.target.checked)}
//           placeholder="premium"
//           style={{ margin: "10px", color: "black" }}
//         />
//       </label>
//       <label>
//         optionTimeToMaturity (sec)
//         <input
//           type="number"
//           min="0"
//           defaultValue={optionTimeToMaturity}
//           onChange={(e) => setOptionTimeToMaturity(e.target.value)}
//           placeholder="premium"
//           style={{ margin: "10px", color: "black" }}
//         />
//       </label>

//       {/* <Radio.Group
//         value={liquidityTimeframe}
//         onChange={(e) => onLiquidityTimeframeSelect(e)}
//         className={inputs.radioGroup}
//       >
//         <Radio.Button value={VaultTimeForLiquidity.ONE_DAY}>
//           One day
//         </Radio.Button>
//         <Radio.Button value={VaultTimeForLiquidity.THREE_DAYS}>
//           Three days
//         </Radio.Button>
//         <Radio.Button value={VaultTimeForLiquidity.ONE_WEEK}>
//           One week
//         </Radio.Button>
//       </Radio.Group>
//       <p>Trading timeframe</p>
//       <Radio.Group
//         value={tradingTimeframe}
//         onChange={(e) => onTradingTimeframeSelect(e)}
//         className={inputs.radioGroup}
//       >
//         <Radio.Button value={VaultTimeForTrading.ONE_DAY}>One day</Radio.Button>
//         <Radio.Button value={VaultTimeForTrading.THREE_DAYS}>
//           Three days
//         </Radio.Button>
//         <Radio.Button value={VaultTimeForTrading.ONE_WEEK}>
//           One week
//         </Radio.Button>
//       </Radio.Group>
//       <p>Time to maturity</p>
//       <Radio.Group
//         value={timeToMaturity}
//         onChange={(e) => onTimeToMaturitySelect(e)}
//         className={inputs.radioGroup}
//       >
//         <Radio.Button value={VaultTimeToMaturity.THREE_MONTHS}>
//           Three months
//         </Radio.Button>
//         <Radio.Button value={VaultTimeToMaturity.ONE_MONTH}>
//           One month
//         </Radio.Button>
//         <Radio.Button value={VaultTimeToMaturity.TWO_WEEKS}>
//           Two weeks
//         </Radio.Button>
//       </Radio.Group>
//       <div className={inputs.inputsGroup}>
//         <div>
//           <p>Collateralization ratio</p>
//           <InputNumber
//             className={inputs.input}
//             placeholder="% CR"
//             onChange={onCrChange}
//             controls={false}
//           />
//         </div>
//         <div>
//           <p>Strike</p>
//           <InputNumber
//             className={inputs.input}
//             placeholder="Strike"
//             onChange={onStrikeChange}
//             controls={false}
//           />
//         </div>
//       </div> */}
//     </Modal>
//   );
// };

// export default CreateVaultModal;

// const getVaultParams = () => ({
//   volatility: "99999",
//   collateral: "0xbb4e5DEfF560ea57c78C8F5849A3A23b7Ed2B1D4",
//   cr: parseEther("1").mul(0).div(100).toString(),
//   strike: parseUnits("0", "gwei").toString(),
//   liquidityTimeframeLength: moment
//     .duration(...VaultTimeForLiquidity.THREE_DAYS.split(" "))
//     .asSeconds()
//     .toString(),
//   tradingTimeframeLength: moment
//     .duration(...VaultTimeForTrading.THREE_DAYS.split(" "))
//     .asSeconds()
//     .toString(),
//   strategyLength: moment
//     .duration(...VaultTimeToMaturity.ONE_MONTH.split(" "))
//     .asSeconds()
//     .toString(),
// });
