import React, { useState, useMemo, useEffect } from "react";
import { Image, StyleSheet } from "react-native";
import PropTypes from "prop-types";

function AutoScaleImage({ style, source, ...restProps }) {
  const flattenedStyles = useMemo(() => StyleSheet.flatten(style), [style]);
  if (
    typeof flattenedStyles.width !== "number" &&
    typeof flattenedStyles.height !== "number"
  ) {
    throw new Error("AutoScaleImage requires either width or height");
  }

  const hasURI = ('uri' in source) && !!source.uri

  if (!hasURI) {
    throw new Error("AutoScaleImage requires a source uri")
  }

  const [size, setSize] = useState({
    width: flattenedStyles.width,
    height: flattenedStyles.height
  });

  useEffect(() => {
    if (!flattenedStyles.width || !flattenedStyles.height && source && hasURI) {
      Image.getSize(source.uri, (w, h) => {
        const ratio = w / h;
        setSize({
          width: flattenedStyles.width || ratio * flattenedStyles.height || 0,
          height: flattenedStyles.height || flattenedStyles.width / ratio || 0
        });
      });
    }
  }, [source, flattenedStyles.width, flattenedStyles.height]);

  return <Image source={source} style={[style, size]} {...restProps} />;
}

AutoScaleImage.propTypes = {
  style: PropTypes.object
};

AutoScaleImage.defaultProps = {
  style: {}
};

export default AutoScaleImage;
