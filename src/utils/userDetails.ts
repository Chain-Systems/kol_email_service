import { formatUnits } from "ethers";
import { contract } from "./contractProvider";

export const fetchUserDetails = async (walletAddress: string) => {
    if(!contract) {
        throw new Error("Contract not initialized");
    }
    const user = await contract.users!(walletAddress);
    const data =  {
        totalDeposited: formatUnits(user[1], 18),
        totalEarned: formatUnits(user[2], 18),
        totalWithdrawn: formatUnits(user[3], 18),
        pendingReward: formatUnits(user[4], 18),
        downlineCount: user[5],
        registered: user[6]
    }
    return data;
}