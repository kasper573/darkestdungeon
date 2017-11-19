import * as React from "react";
import {observer} from "mobx-react";
import {observable} from "mobx";
import {css, StyleSheet} from "aphrodite";

export type CompareFunction<T> = (a: T, b: T) => number;

@observer
export class SortOptions<T> extends React.Component<{
  comparers: {[key: string]: CompareFunction<T>},
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
    const buttons = Object.keys(this.props.comparers).map((name) => {
      const dynamicStyle = this.isInverted.get(name) ? styles.desc : styles.asc;
      return (
        <li
          key={name}
          className={css(styles.button, dynamicStyle)}
          onClick={() => this.changeSort(name)}>
          [{name}]
        </li>
      );
    });

    return (
      <ul className={css(styles.buttons)}>
        <li className={css(styles.button)}>Sort: </li>
        {buttons}
      </ul>
    );
  }
}

const borderStyle = (
  topColor: string = "transparent",
  bottomColor: string = "transparent"
) => {
  return {
    borderTop: "2px solid " + topColor,
    borderBottom: "2px solid " + bottomColor
  };
};

const styles = StyleSheet.create({
  buttons: {
    flexDirection: "row"
  },

  button: {
    ...borderStyle(),
    paddingTop: 3,
    paddingBottom: 3
  },

  asc: {
    ...borderStyle("red")
  },

  desc: {
    ...borderStyle("transparent", "red")
  }
});

function invertCompareFn<T> (compareFn: CompareFunction<T>): CompareFunction<T> {
  return (a, b) => compareFn(a, b) * -1;
}
