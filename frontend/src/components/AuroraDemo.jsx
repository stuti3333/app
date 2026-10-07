import React from 'react';
import { AuroraBars } from './AuroraBars';

const AuroraDemo = () => {
  return (
    <div style={{ height: '400px', width: '100%', position: 'relative' }}>
      <AuroraBars
        barCount={24}
        colors={['#b0faee', '#6cffeb', '#5afff7', '#2dffed', '#00000000']}
        maxHeightRatio={0.92}
        minHeightRatio={0.18}
        speed={0.5}
        gap={3}
        blur={0}
        background="#000000"
      />
      
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'white',
          textAlign: 'center',
          zIndex: 10,
        }}
      >
        <h2>Aurora Bars Animation</h2>
        <p>Beautiful animated gradient bars</p>
      </div>
    </div>
  );
};

export default AuroraDemo;
