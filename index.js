import React from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";

export default class ControlledReadMe extends React.Component {
  state = {
    measured: false,
    shouldShowReadMore: false,
    showAllText: false,
  };

  async componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    let { measured, showAllText } = this.state;

    let { numberOfLines } = this.props;

    return (
      <View>
        <Text
          numberOfLines={measured && !showAllText ? numberOfLines : 0}
          onLayout={event => {
            if (!this._isMounted) {
              return;
            }
            if (!this.fullHeight) {
              this.fullHeight = event.nativeEvent.layout.height;
              this.setState({ measured: true });
              return;
            }
            const limitedHeight = event.nativeEvent.layout.height;
            if (this.fullHeight > limitedHeight) {
              this.setState({ shouldShowReadMore: true }, () => {
                this.props.onReady && this.props.onReady();
              });
            } else {
              this.props.onReady && this.props.onReady();
            }
          }}
          style={this.props.textStyle}
        >
          {this.props.children}
        </Text>

        {this._maybeRenderReadMore()}
      </View>
    );
  }

  _handlePressReadMore = () => {
    this.setState({ showAllText: true });
  };

  _handlePressReadLess = () => {
    this.setState({ showAllText: false });
  };

  _maybeRenderReadMore() {
    let { shouldShowReadMore, showAllText } = this.state;

    if (shouldShowReadMore && !showAllText) {
      if (this.props.renderTruncatedFooter) {
        return this.props.renderTruncatedFooter(this._handlePressReadMore);
      }

      return (
        <Text style={styles.button} onPress={this._handlePressReadMore}>
          Read more
        </Text>
      );
    } else if (shouldShowReadMore && showAllText) {
      if (this.props.renderRevealedFooter) {
        return this.props.renderRevealedFooter(this._handlePressReadLess);
      }

      return (
        <Text style={styles.button} onPress={this._handlePressReadLess}>
          Hide
        </Text>
      );
    }
  }
}

const styles = StyleSheet.create({
  button: {
    color: "#888",
    marginTop: 5,
  },
});
