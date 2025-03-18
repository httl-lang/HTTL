import React from 'react';
import LogoSvg from './logo.svg';

export interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    className
      ? <div className={className}> <LogoSvg />  </div >
      : <LogoSvg />
  );
};

export default Logo;