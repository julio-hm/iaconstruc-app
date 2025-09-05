
import React from 'react';

const WallIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    <rect x="3" y="11" width="18" height="10" stroke="currentColor" strokeWidth="1.5" rx="1" fill="none" strokeDasharray="4 2" strokeOpacity="0.5" />
    <path d="M3 15h18 M3 19h18 M7 11v10 M12 11v10 M17 11v10" stroke="currentColor" strokeWidth="1" strokeOpacity="0.7"/>
  </svg>
);

export default WallIcon;
