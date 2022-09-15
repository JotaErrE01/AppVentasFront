import React from 'react';

const Logo = (props , {src}) => {
  return (
    <img
      style={{height:42}}
      alt="Logo"
      src={src}
      {...props}
    />
  );
}

export default Logo;
