import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { AssetModel, SelectedAssetModel } from '../../models/assets.model';
import { AssetsService } from '../../services/assets/assets.service';
import { DecimalPipe } from '@angular/common';
import { ExecuteExtrinsicsStatusModel } from '../../models/execution-extrinsics-status.model';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrl: './transfer.component.scss',
  providers: [MessageService]
})
export class TransferComponent {
  breadcrumbHome: MenuItem | undefined;
  breadcrumbItems: MenuItem[] | undefined;

  constructor(
    public decimalPipe: DecimalPipe,
    private messageService: MessageService,
    private assetsService: AssetsService
  ) { }

  keypair = localStorage.getItem("wallet-keypair") || "";

  currencies: any[] | undefined;
  selectedCurrency: string | undefined;

  assets: AssetModel[] = [];
  selectedAsset: AssetModel | undefined;

  assetSourceBalance: SelectedAssetModel | undefined;
  assetType: string = "";

  showProcessModal: boolean = false;
  isProcessing: boolean = false;

  executionExtrinsicsStatus: ExecuteExtrinsicsStatusModel | undefined;
  transferAmount: number = 0;
  destinationAddress: string = "";

  public selectAssetOnChange(event: any): void {
    if (this.selectedAsset != undefined) {
      this.getAssetSourceBalanceByAccount(
        this.selectedAsset?.metadata.asset_id,
      );
    }
  }

  public getAssets(): void {
    this.assetsService.getAssets().subscribe(
      result => {
        let data: any = result;
        if (data.length > 0) {
          this.assets = data;

          this.selectedAsset = this.assets[0];
        }

        if (this.selectedAsset != undefined) {
          this.getAssetSourceBalanceByAccount(
            this.selectedAsset?.metadata.asset_id,
          );
        }
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

  public getAssetSourceBalanceByAccount(asset_source: number): void {
    this.assetsService.getAssetBalanceByAccount(asset_source, this.keypair).subscribe(
      result => {
        let data: any = result;
        this.assetSourceBalance = {
          asset: this.getAssetDetail(asset_source),
          balance: data
        }
        this.selectedAsset = this.assetSourceBalance.asset;
      },
      error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
      }
    );
  }

  public transferExtrinsics(): void {
    if (this.selectedAsset != undefined) {
      this.assetsService.transferExtrinsic(
        this.selectedAsset.metadata.asset_id,
        this.destinationAddress,
        this.transferAmount
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
  }

  public signAndSendExtrinsics(data: any): void {
    this.assetsService.signExtrinsics(data).then(
      (signedExtrinsics: any) => {
        this.showProcessModal = true;

        this.assetsService.executeExtrinsics(signedExtrinsics).subscribe(
          results => {
            this.executionExtrinsicsStatus = {
              message: results.message,
              isError: results.isError
            }
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
      { label: 'Transfer' }
    ];

    this.currencies = [
      { name: 'Dollar', code: 'USD' },
      { name: 'Phillipines', code: 'PHP' }
    ];
    this.selectedCurrency = this.currencies[0];

    this.getAssets();
  }
}
