import React from "react";
import PropTypes from "prop-types";

const Typography = ({
  variant = "body1",
  children,
  className = "",
  color = "text-gray-900",
  align = "left",
  ...rest
}) => {
  const baseStyles = "leading-relaxed";

  const variants = {
    h1: `text-4xl font-bold ${color}`,
    h2: `text-3xl font-semibold ${color}`,
    h3: `text-2xl font-medium ${color}`,
    h4: `text-xl font-medium ${color}`,
    h5: `text-lg font-medium ${color}`,
    h6: `text-base font-medium ${color}`,
    subtitle1: `text-base font-semibold ${color}`,
    subtitle2: `text-sm font-semibold ${color}`,
    body1: `text-base ${color}`,
    body2: `text-sm ${color}`,
    caption: `text-xs ${color}`,
    overline: `text-xs uppercase tracking-wider ${color}`,
  };

  const Component = ["h1", "h2", "h3", "h4", "h5", "h6"].includes(variant)
    ? variant
    : "p";

  return (
    <Component
      className={`${baseStyles} ${variants[variant]} ${className} text-${align}`}
      {...rest}
    >
      {children}
    </Component>
  );
};

Typography.propTypes = {
  variant: PropTypes.oneOf([
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "subtitle1",
    "subtitle2",
    "body1",
    "body2",
    "caption",
    "overline",
  ]),
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  color: PropTypes.string,
  align: PropTypes.oneOf(["left", "center", "right", "justify"]),
};

export default Typography;
