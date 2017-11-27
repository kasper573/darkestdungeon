import * as React from "react";
import {HeirloomType} from "../state/types/ItemInfo";
import {StaticState} from "../state/StaticState";
import {commonStyles, Row} from "../config/styles";
import {StyleSheet} from "aphrodite";
import {HeirloomIcon} from "./HeirloomIcon";
import {grid} from "../config/Grid";

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
            compareStyle = amount > compareAmount ? commonStyles.negativeText : undefined;
          }
          return (
            <HeirloomIcon
              key={heirloom.id}
              info={heirloom}
              amount={amount}
              classStyle={[styles.heirloom, compareStyle]}
            />
          );
        })}
      </Row>
    );
  }
}

const styles = StyleSheet.create({
  heirloom: {
    ":not(:last-child)": {
      marginRight: grid.gutter
    }
  }
});
