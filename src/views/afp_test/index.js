import React from 'react'
import { ResponsiveFunnel } from '@nivo/funnel'
import Graph from 'src/views/afp_analytics/ProspectosOrigen'
import { Box, Card, CardContent } from '@material-ui/core';
const index = () => {
  const data = [
    {
      id: "step_sent",
      value: 76103,
      label: "Sent"
    },
    {
      id: "step_viewed",
      value: 64089,
      label: "Viewed"
    },
    {
      id: "step_clicked",
      value: 60108,
      label: "Clicked"
    },
    {
      id: "step_add_to_card",
      value: 56434,
      label: "Add To Card"
    },
    {
      id: "step_purchased",
      value: 51611,
      label: "Purchased"
    }
  ];
  return (
    <div>
      <h1>TEst</h1>

      <Box mt={3}>
        <Card>
          <CardContent>
            <div style={{height:'60vh'}}>
            <MyResponsiveFunnel data={data} />

            </div>

           
          </CardContent>
        </Card>
      </Box>

      <Graph />


    </div>
  )
}

export default index


// install (please make sure versions match peerDependencies)
// yarn add @nivo/core @nivo/funnel
// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
const MyResponsiveFunnel = ({ data /* see data tab */ }) => (
  <ResponsiveFunnel
    data={data}
    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
    valueFormat=">-.4s"
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
)
