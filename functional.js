import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

const styles = StyleSheet.create({
  button: {
    color: '#888',
    marginTop: 5,
  },
});

function ReadMe({
  numberOfLines,
  children,
  text,
  renderTruncatedFooter,
  renderRevealedFooter,
  onReady,
  textStyle,
}) {
  const isMountedRef = useRef(false);
  const fullHeightRef = useRef(0);

  useLayoutEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const [shouldShowReadMore, setShouldShowReadMore] = useState(false);
  const [measured, setMeasured] = useState(false);
  const [showAllText, setShowAllText] = useState(false);

  useEffect(() => () => {
    fullHeightRef.current = 0;
    setShowAllText(false);
    setMeasured(false);
    setShouldShowReadMore(false);
  }, [text]);

  const handlePressReadMore = useCallback(() => {
    setShowAllText(true);
  }, []);

  const handlePressReadLess = useCallback(() => {
    setShowAllText(false);
  }, []);

  const maybeRenderReadMore = useCallback(() => {
    if (shouldShowReadMore && !showAllText) {
      if (renderTruncatedFooter) {
        return renderTruncatedFooter(handlePressReadMore);
      }

      return (
        <Text style={styles.button} onPress={handlePressReadMore}>
          Read more
        </Text>
      );
    }

    if (shouldShowReadMore && showAllText) {
      if (renderRevealedFooter) {
        return renderRevealedFooter(handlePressReadLess);
      }

      return (
        <Text style={styles.button} onPress={handlePressReadLess}>
          Hide
        </Text>
      );
    }

    return undefined;
  }, [
    handlePressReadLess,
    handlePressReadMore,
    renderTruncatedFooter,
    renderRevealedFooter,
    shouldShowReadMore,
    showAllText,
  ]);

  const handleLayout = useCallback((event) => {
    if (!isMountedRef.current) {
      return;
    }
    if (!fullHeightRef.current) {
      fullHeightRef.current = event.nativeEvent.layout.height;
      setMeasured(true);
      return;
    }
    const limitedHeight = event.nativeEvent.layout.height;
    if (fullHeightRef.current > limitedHeight) {
      setShouldShowReadMore(true);
    }
    if (onReady) {
      onReady();
    }
  }, [onReady]);

  return (
    <View>
      <Text
        numberOfLines={measured && !showAllText ? numberOfLines : 0}
        onLayout={handleLayout}
        style={textStyle}
      >
        {children}
      </Text>
      {maybeRenderReadMore()}
    </View>
  );
}

ReadMe.propTypes = {
  numberOfLines: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
  text: PropTypes.string.isRequired,
  renderTruncatedFooter: PropTypes.func.isRequired,
  renderRevealedFooter: PropTypes.func.isRequired,
  onReady: PropTypes.func,
  textStyle: PropTypes.object,
};

export default ReadMe;
