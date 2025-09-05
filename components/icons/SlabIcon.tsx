
import React from 'react';

const SlabIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.211-.992-.55-1.332l-2.73-2.73a.75.75 0 00-1.06 0l-2.73 2.73a.75.75 0 01-1.06 0l-2.73-2.73a.75.75 0 00-1.06 0l-2.73 2.73a.75.75 0 01-1.06 0l-2.47-2.47a.75.75 0 00-1.06 0l-2.73 2.73a1.493 1.493 0 01-1.332.55v1.372c0 1.243.01 2.25.01 2.25H2.25z" transform="rotate(-45 12 12)" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16 M4 12h16 M4 16h16" strokeOpacity="0.5" />
  </svg>
);

export default SlabIcon;
