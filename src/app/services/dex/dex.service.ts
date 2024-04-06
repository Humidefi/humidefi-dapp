import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings } from '../../app-settings';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { AccountLiquidityPoolModel } from '../../models/account-liquidity-pool.model';
import { Observable, Subject } from 'rxjs';
import { web3FromAddress } from '@polkadot/extension-dapp';
import { LiquidityPoolModel } from '../../models/liquidity-pool.model';
import { AssetPairModel } from '../../models/assets.model';

@Injectable({
  providedIn: 'root'
})
export class DexService {

  constructor(
    private appSettings: AppSettings,
    private httpClient: HttpClient
  ) { }

  wsProvider = new WsProvider(this.appSettings.wsProviderEndpoint);
  api = ApiPromise.create({ provider: this.wsProvider });
  keypair = this.appSettings.keypair;

  defaultApiEndpoint: string = this.appSettings.apiEndpoint;
  options: any = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
  };

  public getLiquidityPools(): Observable<LiquidityPoolModel[] | string> {
    return new Observable<LiquidityPoolModel[]>((observer) => {
      let liquidityPools: LiquidityPoolModel[] = [];

      this.httpClient.get(this.defaultApiEndpoint + '/api/dex/get/liquidity-pools', this.options).subscribe(
        response => {
          let results: any = response;

          if (results.length > 0) {
            for (let i = 0; i < results.length; i++) {
              let assetPair: AssetPairModel = {
                assetX: results[i].assetPair.assetX,
                assetY: results[i].assetPair.assetY,
              }

              liquidityPools.push({
                assetPair: assetPair,
                assetXBalance: results[i].assetXBalance,
                assetYBalance: results[i].assetYBalance,
                price: results[i].price,
                assetXFee: results[i].assetXFee,
                assetYFee: results[i].assetYFee,
                lpToken: results[i].lpToken,
                lpTokenBalance: results[i].lpTokenBalance,
              });
            }
          }

          observer.next(liquidityPools);
          observer.complete();
        },
        error => {
          if (error.status == 0) {
            observer.error(error.message);
          } else {
            observer.error(error['error'].message);
          }

          observer.complete();
        }
      )
    });
  }

  public getLiquidityPool(assetX: number, assetY: number): Observable<LiquidityPoolModel | string> {
    return new Observable<LiquidityPoolModel>((observer) => {
      let liquidityPool: LiquidityPoolModel = new LiquidityPoolModel();

      this.httpClient.get(this.defaultApiEndpoint + '/api/dex/get/liquidity-pool/' + assetX + '/' + assetY, this.options).subscribe(
        response => {
          let results: any = response;

          let assetPair: AssetPairModel = {
            assetX: results.assetPair.assetX,
            assetY: results.assetPair.assetY,
          }

          liquidityPool = {
            assetPair: assetPair,
            assetXBalance: results.assetXBalance,
            assetYBalance: results.assetYBalance,
            price: results.price,
            assetXFee: results.assetXFee,
            assetYFee: results.assetYFee,
            lpToken: results.lpToken,
            lpTokenBalance: results.lpTokenBalance,
          };

          observer.next(liquidityPool);
          observer.complete();
        },
        error => {
          if (error.status == 0) {
            observer.error(error.message);
          } else {
            observer.error(error['error'].message);
          }

          observer.complete();
        }
      )
    });
  }

  public getAccountLiquidityPools(): Observable<AccountLiquidityPoolModel[] | string> {
    return new Observable<AccountLiquidityPoolModel[]>((observer) => {
      let accountLiquidityPools: AccountLiquidityPoolModel[] = [];

      this.httpClient.get(this.defaultApiEndpoint + '/api/dex/get/account-liquidity-pool-by-account/' + this.keypair, this.options).subscribe(
        response => {
          let results: any = response;

          if (results.length > 0) {
            for (let i = 0; i < results.length; i++) {
              accountLiquidityPools.push({
                id: results[i].id,
                accountId: results[i].accountId,
                assetPair: results[i].assetPair,
                assetXBalance: results[i].assetXBalance,
                assetYBalance: results[i].assetYBalance,
                lpToken: results[i].lpToken,
                lpTokenBalance: results[i].lpTokenBalance,
              });
            }
          }

          observer.next(accountLiquidityPools);
          observer.complete();
        },
        error => {
          if (error.status == 0) {
            observer.error(error.message);
          } else {
            observer.error(error['error'].message);
          }

          observer.complete();
        }
      )
    });
  }

  public newLiquidityExtrinsic(assetX: number, assetXBalance: number, assetY: number, assetYBalance: number): Observable<any> {
    return new Observable<any>((observer) => {
      let data = {
        assetX: assetX,
        assetXBalance: assetXBalance,
        assetY: assetY,
        assetYBalance: assetYBalance
      }

      this.httpClient.post(this.defaultApiEndpoint + "/api/dex/extrinsic/new-liquidity", JSON.stringify(data), this.options).subscribe(
        response => {
          let results: any = response;

          observer.next(results);
          observer.complete();
        },
        error => {
          if (error.status == 0) {
            observer.error(error.message);
          } else {
            observer.error(error['error'].message);
          }

          observer.complete();
        }
      );
    });
  }

  public redeemLiquidityExtrinsic(assetX: number, assetY: number, lpToken: number, id: number): Observable<any> {
    return new Observable<any>((observer) => {
      let data = {
        assetX: assetX,
        assetY: assetY,
        lpToken: lpToken,
        id: id
      }

      this.httpClient.post(this.defaultApiEndpoint + "/api/dex/extrinsic/redeem-liquidity", JSON.stringify(data), this.options).subscribe(
        response => {
          let results: any = response;

          observer.next(results);
          observer.complete();
        },
        error => {
          if (error.status == 0) {
            observer.error(error.message);
          } else {
            observer.error(error['error'].message);
          }

          observer.complete();
        }
      );
    });
  }

  public swapExactInForOutExtrinsic(assetExactIn: number, assetExactInBalance: number, assetMaxOut: number): Observable<any> {
    return new Observable<any>((observer) => {
      let data = {
        assetExactIn: assetExactIn,
        assetExactInBalance: assetExactInBalance,
        assetMaxOut: assetMaxOut
      }

      this.httpClient.post(this.defaultApiEndpoint + "/api/dex/extrinsic/swap-exact-in-for-out", JSON.stringify(data), this.options).subscribe(
        response => {
          let results: any = response;

          observer.next(results);
          observer.complete();
        },
        error => {
          if (error.status == 0) {
            observer.error(error.message);
          } else {
            observer.error(error['error'].message);
          }

          observer.complete();
        }
      );
    });
  }

  public swapInForExactOutExtrinsic(assetExactOut: number, assetExactOutBalance: number, assetMinIn: number): Observable<any> {
    return new Observable<any>((observer) => {
      let data = {
        assetExactOut: assetExactOut,
        assetExactOutBalance: assetExactOutBalance,
        assetMinIn: assetMinIn
      }

      this.httpClient.post(this.defaultApiEndpoint + "/api/dex/extrinsic/swap-in-for-exact-out", JSON.stringify(data), this.options).subscribe(
        response => {
          let results: any = response;

          observer.next(results);
          observer.complete();
        },
        error => {
          if (error.status == 0) {
            observer.error(error.message);
          } else {
            observer.error(error['error'].message);
          }

          observer.complete();
        }
      );
    });
  }

  public transferAssetExtrinsic(asset: number, assetBalance: number, accountId: number): Observable<any> {
    return new Observable<any>((observer) => {
      let data = {
        asset: asset,
        assetBalance: assetBalance,
        accountId: accountId
      }

      this.httpClient.post(this.defaultApiEndpoint + "/api/dex/extrinsic/transfer-asset", JSON.stringify(data), this.options).subscribe(
        response => {
          let results: any = response;

          observer.next(results);
          observer.complete();
        },
        error => {
          if (error.status == 0) {
            observer.error(error.message);
          } else {
            observer.error(error['error'].message);
          }

          observer.complete();
        }
      );
    });
  }

  public async signExtrinsics(extrinsics: string): Promise<any> {
    const api = await this.api;

    const injector = await web3FromAddress(this.keypair);
    api.setSigner(injector.signer);

    const unsignedExtrinsics = api.tx(extrinsics);
    let signedExtrinsics = (await unsignedExtrinsics.signAsync(this.keypair)).toHex();

    if (signedExtrinsics) {
      return signedExtrinsics;
    }
  }

  public executeExtrinsics(signedExtrinsics: string): Observable<any> {
    return new Observable<any>((observer) => {
      let data = {
        signedExtrincs: signedExtrinsics
      }

      this.httpClient.post(this.defaultApiEndpoint + "/api/dex/extrinsics/execute", JSON.stringify(data), this.options).subscribe(
        response => {
          let results: any = response;

          observer.next(results);
          observer.complete();
        },
        error => {
          if (error.status == 0) {
            observer.error(error.message);
          } else {
            observer.error(error['error'].message);
          }

          observer.complete();
        }
      );
    });
  }
}
