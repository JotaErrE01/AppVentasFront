import React, { useEffect } from 'react'
import JSONTree from 'react-json-tree';
import { getEmbudo } from 'src/slices/intencion';
import { useDispatch, useSelector } from 'src/store'
import FunnelReporteGraph from './FunnelReporteGraph'

const FunnelReporteView = () => {

  const dispatch = useDispatch();


  function _getEmbudo() {
    dispatch(getEmbudo());
  }



  const { embudo, embudoLoading } = useSelector((state) => state.intencion);

  useEffect(() => { _getEmbudo();}, [])

  return (
    <div>


      {
        embudo && embudo.length && <FunnelReporteGraph data={embudo} />
      }

      



    </div>
  )
}

export default FunnelReporteView
