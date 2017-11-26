import * as React from "react";
import {StaticState} from "../state/StaticState";
import {Column, commonStyles, Row} from "../config/styles";
import {computed, observable} from "mobx";
import {observer} from "mobx-react";
import {without} from "../lib/Helpers";
import {ItemInfo} from "../state/types/ItemInfo";
import {AppStateComponent} from "../AppStateComponent";
import {cap} from "../lib/Helpers";
import {Heirloom} from "./Heirloom";
import {css, StyleSheet} from "aphrodite";

@observer
export class HeirloomTrader extends AppStateComponent {
  heirloomList = StaticState.instance.heirlooms;
  @observable heirloomIndex: number = 0;
  @observable tradeAmount: number = this.minTradableHeirlooms;

  @computed get selectedHeirloom () {
    let normalizedIndex = this.heirloomIndex < 0 ?
      (this.heirloomList.length - this.heirloomIndex) :
      this.heirloomIndex;
    normalizedIndex %= this.heirloomList.length;
    return this.heirloomList[normalizedIndex];
  }

  @computed get maxTradableHeirlooms () {
    return this.activeProfile.heirloomCounts.get(this.selectedHeirloom.heirloomType) || 0;
  }

  get minTradableHeirlooms () {
    return this.maxTradableHeirlooms ? 1 : 0;
  }

  @computed get otherHeirlooms () {
    return without(this.heirloomList, [this.selectedHeirloom]);
  }

  offsetSelectedHeirloom (offset: number) {
    this.heirloomIndex += offset;
    this.refreshTradeAmount();
  }

  tradeSelectedHeirlooms (targetHeirloom: ItemInfo) {
    this.activeProfile.tradeHeirlooms(
      this.tradeAmount, this.selectedHeirloom.heirloomType, targetHeirloom.heirloomType
    );
    this.refreshTradeAmount();
  }

  refreshTradeAmount () {
    this.tradeAmount = cap(this.tradeAmount, this.minTradableHeirlooms, this.maxTradableHeirlooms);
  }

  render () {
    const canIncrease = (this.tradeAmount + 1) <= this.maxTradableHeirlooms;
    const canDecrease = (this.tradeAmount - 1) >= this.minTradableHeirlooms;
    return (
      <Row>
        <Column classStyle={commonStyles.fill}>
          <span className={css(commonStyles.fill)} onClick={() => this.offsetSelectedHeirloom(1)}>[^]</span>
          <span>{this.selectedHeirloom.name}</span>
          <span
            className={css(commonStyles.fill, styles.end)}
            onClick={() => this.offsetSelectedHeirloom(-1)}>
            [v]
          </span>
        </Column>

        <Column classStyle={commonStyles.fill}>
          <span className={css(commonStyles.fill)}>
            {canIncrease && (
              <span onClick={() => this.tradeAmount++}>[+]</span>
            )}
          </span>
          <span>x{this.tradeAmount}</span>
          <span className={css(commonStyles.fill, styles.end)}>
            {canDecrease && (
              <span onClick={() => this.tradeAmount--}>[-]</span>
            )}
          </span>
        </Column>

        <Column style={{flex: 2}}>
          {this.otherHeirlooms.map((targetHeirloom) => {
            const convertedAmount = this.activeProfile.getConvertedHeirloomValue(
              this.tradeAmount, this.selectedHeirloom.heirloomType, targetHeirloom.heirloomType
            );
            return (
              <Row classStyle={commonStyles.fill} key={targetHeirloom.id}>
                <span className={css(commonStyles.fill, styles.center)}>
                  <Heirloom info={targetHeirloom}/>
                </span>
                <span className={css(commonStyles.fill, styles.center, styles.amount)}>
                  x{convertedAmount}
                </span>
                <span className={css(styles.convertButton)}>
                  {convertedAmount > 0 && (
                    <button onClick={() => this.tradeSelectedHeirlooms(targetHeirloom)}>
                      >
                    </button>
                  )}
                </span>
              </Row>
            );
          })}
        </Column>
      </Row>
    );
  }
}

const styles = StyleSheet.create({
  end: {
    justifyContent: "flex-end"
  },

  center: {
    justifyContent: "center"
  },

  amount: {
    marginLeft: 10,
    marginRight: 10
  },

  convertButton: {
    width: 25,
    height: 22
  }
});
