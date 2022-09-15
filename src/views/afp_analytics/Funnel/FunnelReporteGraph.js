import React, { useEffect } from 'react'

import { ResponsiveFunnel } from '@nivo/funnel'


const FunnelReporteGraph = ({ data }) => (


  <div style={{ height: '60vh' }}>


    <ResponsiveFunnel
      data={data}
      margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
      colors={{ scheme: 'spectral' }}
      borderWidth={20}
      labelColor={{ from: 'color', modifiers: [['darker', 3]] }}
      beforeSeparatorLength={100}
      beforeSeparatorOffset={20}
      afterSeparatorLength={100}
      afterSeparatorOffset={20}
      currentPartSizeExtension={10}
      currentBorderWidth={40}
      motionConfig="wobbly"
    />
  </div>
);

export default FunnelReporteGraph;