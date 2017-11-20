import * as React from "react";
import {HeirloomType} from "../state/types/ItemInfo";
import {StaticState} from "../state/StaticState";
import {Row} from "../config/styles";
import {css, StyleSheet} from "aphrodite";

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
            <span key={heirloom.id} className={css(compareStyle)}>
              {heirloom.name}: {amount}
            </span>
          );
        })}
      </Row>
    );
  }
}

const styles = StyleSheet.create({
  compareEnough: {
    color: "green"
  },

  compareLess: {
    color: "red"
  }
});
