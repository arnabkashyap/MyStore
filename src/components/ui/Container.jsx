import React from 'react';

export function Container({ children, className = '', ...rest }) {
  return (
    <div className={`container ${className}`.trim()} {...rest}>
      {children}
    </div>
  );
}

