import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { AssetModel, SelectedAssetModel } from '../../models/assets.model';
import { AssetsService } from '../../services/assets/assets.service';
import { DecimalPipe } from '@angular/common';
import { DexService } from '../../services/dex/dex.service';
import { LiquidityPoolModel } from '../../models/liquidity-pool.model';
import { AccountLiquidityPoolModel } from '../../models/account-liquidity-pool.model';
import { ExecuteExtrinsicsStatusModel } from '../../models/execution-extrinsics-status.model';

@Component({
  selector: 'app-liquidity',
  templateUrl: './liquidity.component.html',
  styleUrl: './liquidity.component.scss',
  providers: [MessageService]
})
export class LiquidityComponent {
  breadcrumbHome: MenuItem | undefined;
  breadcrumbItems: MenuItem[] | undefined;

  constructor(
    public decimalPipe: DecimalPipe,
    private messageService: MessageService,
    private assetsService: AssetsService,
    private dexService: DexService
  ) { }

  keypair = localStorage.getItem("wallet-keypair") || "";

  currencies: any[] | undefined;
  selectedCurrency: string | undefined;

  assets: AssetModel[] = [];
  liquidityPools: LiquidityPoolModel[] = [];
  selectedLiquidityPool: LiquidityPoolModel = new LiquidityPoolModel();
  accountLiquidityPools: AccountLiquidityPoolModel[] = [];
  executionExtrinsicsStatus: ExecuteExtrinsicsStatusModel | undefined;

  showNewLiquidityModal: boolean = false;

  showProcessModal: boolean = false;
  isProcessing: boolean = false;

  public getAssets(): void {
    this.assetsService.getAssets().subscribe(
      result => {
        let data: any = result;
        if (data.length > 0) {
          this.assets = data;
        }

        this.getLiquidityPools();
      },
      error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
      }
    )
  }

  public getAssetDetail(asset_id: number): AssetModel {
    let asset: AssetModel = new AssetModel();
    if (this.assets.length > 0) {
      asset = this.assets.filter(d => d.metadata.asset_id == asset_id)[0];
    }

    return asset;
  }

  public getLiquidityPools(): void {
    this.liquidityPools = [];
    this.dexService.getLiquidityPools().subscribe(
      result => {
        let data: any = result;
        if (data.length > 0) {
          this.liquidityPools = data;
        }
      },
      error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
      }
    )
  }

  public openExistingLiquidityPoolsModal(): void {
    this.getLiquidityPools();
  }

  public getAccountLiquidityPools(): void {
    this.accountLiquidityPools = [];
    this.dexService.getAccountLiquidityPools().subscribe(
      result => {
        let data: any = result;
        if (data.length > 0) {
          this.accountLiquidityPools = data;
        }

        this.accountLiquidityPools.sort((a, b) => (a.id < b.id ? -1 : 1));
      },
      error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
      }
    )
  }

  public newLiquidityExtrinsic(): void {
    this.dexService.newLiquidityExtrinsic(
      this.selectedLiquidityPool.assetPair.assetX,
      this.selectedLiquidityPool.assetXBalance,
      this.selectedLiquidityPool.assetPair.assetY,
      this.selectedLiquidityPool.assetYBalance
    ).subscribe(
      result => {
        let data: any = result;
        this.signAndSendExtrinsics(data);
      },
      error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
      }
    );
  }

  public signAndSendExtrinsics(data: any): void {
    this.dexService.signExtrinsics(data).then(
      (signedExtrinsics: any) => {
        this.showProcessModal = true;

        this.dexService.executeExtrinsics(signedExtrinsics).subscribe(
          results => {
            this.executionExtrinsicsStatus = {
              message: results.message,
              isError: results.isError
            }

            this.getAccountLiquidityPools();
          },
          error => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
            this.showProcessModal = false;
          }
        );
      }
    );
  }

  ngOnInit() {
    this.breadcrumbHome = { icon: 'pi pi-home', routerLink: '/app/dashboard' };
    this.breadcrumbItems = [
      { label: 'Dashboard' },
      { label: 'Liquidity' },
    ];

    this.currencies = [
      { name: 'Dollar', code: 'USD' },
      { name: 'Phillipines', code: 'PHP' }
    ];
    this.selectedCurrency = this.currencies[0];

    this.getAssets();
  }
}
