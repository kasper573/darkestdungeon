import * as React from "react";
import {HeirloomType} from "../state/types/ItemInfo";
import {StaticState} from "../state/StaticState";
import {Row} from "../config/styles";
import {StyleSheet} from "aphrodite";
import {HeirloomIcon} from "./HeirloomIcon";
import {TooltipArea} from "../lib/TooltipArea";

export class Heirlooms extends React.Component<{
  counts: Map<HeirloomType, number>,
  compare?: Map<HeirloomType, number>
  showAll?: boolean
}> {
  render () {
    const visibleHeirlooms = this.props.showAll ?
      StaticState.instance.heirlooms :
      Array.from(this.props.counts.keys())
        .map((heirloomType) =>
          StaticState.instance.heirlooms.find(
            (info) => info.heirloomType === heirloomType
          )
        );

    return (
      <Row>
        {visibleHeirlooms.map((heirloom) => {
          let compareStyle;
          const amount = this.props.counts.get(heirloom.heirloomType) || 0;
          if (this.props.compare) {
            const compareAmount = this.props.compare.get(heirloom.heirloomType) || 0;
            compareStyle = amount <= compareAmount ? styles.compareEnough : styles.compareLess;
          }
          return (
            <TooltipArea
              tip={heirloom.pluralName}
              key={heirloom.id}
              classStyle={[styles.heirloom, compareStyle]}>
              <HeirloomIcon info={heirloom}/>
              <span>: {amount}</span>
            </TooltipArea>
          );
        })}
      </Row>
    );
  }
}

const styles = StyleSheet.create({
  heirloom: {
    flexDirection: "row"
  },

  compareEnough: {
    color: "green"
  },

  compareLess: {
    color: "red"
  }
});
