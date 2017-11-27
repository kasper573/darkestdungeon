import * as React from "react";
import {observer} from "mobx-react";
import {observable} from "mobx";
import {StyleSheet} from "aphrodite";
import {Icon} from "./Icon";
import {Row} from "../config/styles";
import {grid} from "../config/Grid";
import {VerticalOutlineBox} from "./VerticalOutlineBox";

export type CompareFunction<T> = (a: T, b: T) => number;

@observer
export class SortOptions<T> extends React.Component<{
  comparers: {[key: string]: CompareFunction<T>},
  icons: {[key: string]: string},
  onChange: (fn: CompareFunction<T>) => void
}> {
  @observable private isInverted = new Map<string, boolean>();
  @observable private activeComparerName: string = Object.keys(this.props.comparers)[0];

  changeSort (comparerName: string) {
    const compareFn = (this.props.comparers as any)[comparerName];
    const isInverted = this.isInverted.get(comparerName);
    const actualFn = isInverted ?
      invertCompareFn(compareFn) :
      compareFn;

    this.activeComparerName = comparerName;
    this.isInverted.set(comparerName, !isInverted);

    this.props.onChange(actualFn);
  }

  render () {
    const options = Object.keys(this.props.comparers).map((name) => {
      const isInverted = !!this.isInverted.get(name);
      const isActive = this.activeComparerName === name;
      return (
        <Icon
          tip={"Sort by " + name}
          key={name}
          src={this.props.icons[name]}
          classStyle={styles.option}
          iconStyle={styles.optionIcon}
          onClick={() => this.changeSort(name)}>
          {isActive && (
            <VerticalOutlineBox above={isInverted} below={!isInverted}/>
          )}
        </Icon>
      );
    });

    return (
      <Row>
        {options}
      </Row>
    );
  }
}

const styles = StyleSheet.create({
  option: {
    ":not(:last-child)": {
      marginRight: grid.gutter / 2
    }
  },

  optionIcon: {
    width: grid.gutter * 3,
    height: grid.gutter * 3
  }
});

function invertCompareFn<T> (compareFn: CompareFunction<T>): CompareFunction<T> {
  return (a, b) => compareFn(a, b) * -1;
}
