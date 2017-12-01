import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {commonColors, commonStyleFn, commonStyles} from "../config/styles";
import {grid} from "../config/Grid";
import {fonts} from "../../assets/fonts";
import {credits} from "../config/credits";

const sectionTexts = credits.trim().split(/\n\n+/);
const sections = sectionTexts.map((text) => text.split(/\n/));
const startScrollWaitTime = 2000;
const scrollFrequency = 32;
const scrollFrameOffset = 1;

export class Credits extends React.Component {
  private frameTimeoutId: any;
  private startTimeoutId: any;
  private scrollbarNode: HTMLDivElement;

  componentDidMount () {
    this.startScrolling();
  }

  componentWillUnmount () {
    this.stopScrolling();
  }

  startScrolling () {
    this.startTimeoutId = setTimeout(() => this.nextScroll(), startScrollWaitTime);
  }

  nextScroll () {
    // Perform one frame worth of a scroll,
    this.scrollbarNode.scrollTop += scrollFrameOffset;

    if (this.startTimeoutId !== undefined) {
      this.frameTimeoutId = setTimeout(() => this.nextScroll(), scrollFrequency);
    }
  }

  stopScrolling () {
    clearTimeout(this.frameTimeoutId);
    clearTimeout(this.startTimeoutId);
    delete this.startTimeoutId;
  }

  render () {
    return (
      <div className={css(styles.credits)}>
        <div
          ref={(node) => this.scrollbarNode = node}
          className={css(styles.clipper, commonStyles.customScrollbar)}>
          {sections.map(([title, ...entries], sectionIndex) => {
            const isBigTitle = title[0] === "#";
            if (isBigTitle) {
              title = title.substr(1);
            }
            return (
              <div key={sectionIndex} className={css(styles.section)}>
                <h1 className={css(styles.title, isBigTitle && styles.bigTitle)}>
                  {title}
                </h1>
                {entries.length > 0 && (
                  <ul>
                    {entries.map((entry, entryIndex) => (
                      <li key={entryIndex}>
                        {entry}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  credits: {
    flex: 1,
    background: `url(${require("../../assets/dd/images/shared/credits/credits.background.png")})`,
    ...commonStyleFn.singleBackground(),
    textAlign: "center",
    paddingTop: grid.paddingTop,
    paddingRight: grid.paddingRight,
    paddingBottom: grid.paddingBottom,
    paddingLeft: grid.paddingLeft
  },

  clipper: {
    flex: 1,
    overflowY: "scroll"
  },

  section: {
    marginBottom: grid.ySpan(1),

    ":first-child": {
      marginTop: grid.ySpan(7.5),
      marginBottom: grid.ySpan(7.5)
    }
  },

  title: {
    fontSize: grid.fontSize(0.75),
    fontFamily: fonts.Darkest,
    fontWeight: "normal",
    color: commonColors.gold
  },

  bigTitle: {
    fontSize: grid.fontSize(1.25)
  }
});
