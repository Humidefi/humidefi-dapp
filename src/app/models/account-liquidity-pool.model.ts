import { AssetPairModel } from "./assets.model";

export class AccountLiquidityPoolModel {
    id: number = 0;
    accountId: number = 0;
    assetPair: AssetPairModel = new AssetPairModel();
    assetXBalance: number = 0;
    assetYBalance: number = 0;
    lpToken: number = 0;
    lpTokenBalance: number = 0;
}