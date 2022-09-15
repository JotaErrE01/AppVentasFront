import _ from 'lodash';
import React, { useEffect } from 'react'
import JSONTree from 'react-json-tree';
import Nowloading from 'src/components/common/Nowloading';
import { getAnalyticsEmbudo } from 'src/slices/intencion';
import { useDispatch, useSelector } from 'src/store'
import FunnelReporteGraph from './FunnelReporteGraph'
import Grid from './Grid';
import GridAgrupado from './GridAgrupado';
import Form from 'src/views/afp_analytics/Intencion/Form'
import { format, add } from 'date-fns'
import { useState } from 'react';
import { parseISO } from 'date-fns';

const parts = (embudo) => {

  const filteredArr = embudo.reduce((acc, current) => {
    const x = acc.find(item => item.int_user_id === current.int_user_id);
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);

  const groups = filteredArr.map(item => {

    const part = embudo.filter(embudo_item =>
      embudo_item.int_user_id == item.int_user_id
    );

    return {
      int_user_id: item.int_user_id,
      int_user_name: item.int_user_name,
      data: part,
      // embudoView:embudoView,
    }
  }


  );

  return groups;

}



const FunnelReporteView = () => {

  const dispatch = useDispatch();




  const options = ['lead', 'actividad']


  var curr_date = new Date();
  var curr_day = curr_date.getDay() - 1;


  const [payload, setPayload] = useState({
    date_a: format(add(curr_date, { days: -curr_day }), 'yyyy-MM-dd'),
    date_b: format(add(curr_date, { days: -curr_day + 7 }), 'yyyy-MM-dd'),
    on: options[0]
  })


  useEffect(() => {
    dispatch(getAnalyticsEmbudo(payload));
  }, []);


  const onChangeDates = (payload) => dispatch(getAnalyticsEmbudo(payload));




  const { embudo_1, embudo_2, embudoLoading } = useSelector((state) => state.intencion);

  const embudo_parts = embudo_1 && embudo_1.length && parts(embudo_1);


  return (
    <div>

      <Form
        onChangeDates={onChangeDates}
        options={options}
        payload={payload}
        setPayload={setPayload}
      />


      <GridAgrupado title="Vista completa" data={embudo_2} loading={embudoLoading}></GridAgrupado>

      {
        embudo_parts && embudo_parts.length ? embudo_parts.map(item =>
          <Grid
            title={item.int_user_name}
            data={item.data}
            loading={embudoLoading}
          />)
          : <></>
      }


    </div>
  )

}

export default FunnelReporteView
