import * as zksync from "zksync";
import * as ethers from "ethers";
const syncProvider = await zksync.getDefaultProvider("rinkeby");
const ethersProvider = ethers.getDefaultProvider("rinkeby");


export default class ZKSyncFun {

    constructor(seed) {
        return this.initialise(seed);
    }

    async initialise(seed) {
        // Create ethereum wallet using ethers.js
        this.ethWallet = ethers.Wallet.fromMnemonic(seed).connect(ethersProvider);
        // Derive zksync.Signer from ethereum wallet.
        this.syncWallet = await zksync.Wallet.fromEthSigner(this.ethWallet, syncProvider);
    }

    async walletMagic() {
        this.ethWallet.approveERC20TokenDeposits();
        this.ethWallet.getAccountId()
    }

    async depositEth(to) {
        const deposit = await this.syncWallet.depositToSyncFromEthereum({
            depositTo: to,
            token: "ETH",
            amount: ethers.utils.parseEther("1.0"),
        });

        return {
            receipt: await deposit.awaitReceipt(),
            verifiedReceipt: await deposit.awaitVerifyReceipt()
        }
    }



}