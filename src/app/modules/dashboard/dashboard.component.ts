import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { UserAssetModel } from '../../models/user-asset.model';
import { AssetsService } from '../../services/assets/assets.service';
import { DecimalPipe } from '@angular/common';
import { AssetModel } from '../../models/assets.model';
import { AccountLiquidityPoolModel } from '../../models/account-liquidity-pool.model';
import { DexService } from '../../services/dex/dex.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  providers: [MessageService]
})
export class DashboardComponent {
  breadcrumbHome: MenuItem | undefined;
  breadcrumbItems: MenuItem[] | undefined;

  constructor(
    public decimalPipe: DecimalPipe,
    private messageService: MessageService,
    private assetsService: AssetsService,
    private dexService: DexService
  ) { }

  currencies: any[] | undefined;
  selectedCurrency: string | undefined;

  walletName = localStorage.getItem("wallet-meta-name") || "";
  address = localStorage.getItem("wallet-address") || "";
  keypair = localStorage.getItem("wallet-keypair") || "";

  showChangeWalletModal: boolean = false;

  iframeSrc = "";

  assets: AssetModel[] = [];
  userAssets: UserAssetModel[] = [];
  accountLiquidityPools: AccountLiquidityPoolModel[] = [];

  public getAssets(): void {
    this.assetsService.getAssets().subscribe(
      async result => {
        let data: any = result;
        if (data.length > 0) {
          for (let i = 0; i < data.length; i++) {
            await this.getAssetBalanceByAcccount(data[i]);
          }

          this.assets = data;
        }

        this.getAccountLiquidityPools();
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

  public async getAssetBalanceByAcccount(asset: AssetModel): Promise<void> {
    this.assetsService.getAssetBalanceByAccount(asset.metadata.asset_id, this.keypair).subscribe(
      result => {
        let data: any = result;
        this.userAssets.push({
          asset_id: asset.metadata.asset_id,
          asset_symbol: asset.metadata.symbol,
          asset_name: asset.metadata.name,
          quantity: data,
          value: 0,
          amount: 0
        });
      },
      error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
      }
    );
  }

  public changeWallet(): void {
    this.showChangeWalletModal = true;
  }

  public getAccountLiquidityPools(): void {
    console.log(this.accountLiquidityPools);
    this.accountLiquidityPools = [];
    this.dexService.getAccountLiquidityPools().subscribe(
      result => {
        let data: any = result;
        if (data.length > 0) {
          this.accountLiquidityPools = data;
          this.accountLiquidityPools.sort((a, b) => (a.id < b.id ? -1 : 1));
        }
      },
      error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
      }
    )
  }

  ngOnInit() {
    this.breadcrumbHome = { icon: 'pi pi-home', routerLink: '/app/dashboard' };
    this.breadcrumbItems = [
      { label: 'Dashboard' }
    ];

    this.currencies = [
      { name: 'Dollar', code: 'USD' },
      { name: 'Phillipines', code: 'PHP' }
    ];
    this.selectedCurrency = this.currencies[0];

    let url = location.origin + "/polkadot-identicon";
    this.iframeSrc = url;

    this.getAssets();
  }
}
