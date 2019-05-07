import React, { useState, useEffect } from 'react'
import axios from 'axios'
import moment from 'moment'
import styled from 'styled-components'
import {
  FlexibleXYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  AreaSeries,
  LineSeries,
  DiscreteColorLegend
} from 'react-vis'

import {
  TitleBoard,
  TitleContainer,
  GraphContainer,
  DashboardContainer
} from './Styled.jsx'

const Dashboard = () => {
  const [data, setData] = useState([])
  // const [dateText, setDateText] = useState('')
  // const [intvText, setIntvText] = useState('') 
  const [startDateText, setStartDateText] = useState('')
  const [endDateText, setEndDateText] = useState('')
  const [startDate, setStartDate] = useState('2018-11-01')
  const [endDate, setEndDate] = useState('2018-12-01')
  // const [date, setDate] = useState('2018-11-01')
  // const [intv, setIntv] = useState(2)

  const refDate = React.createRef

  useEffect(() => {
    startDate
    getData()
  }, [startDate])
  useEffect(() => {
    endDate
    getData()
  }, [endDate])

  const getData = async () => {
    try{
      const res = await axios.get(`http://localhost:3000/api/thermostat?startDate=${moment(startDate).format('YYYY/MM/DD')}&endDate=${moment(endDate).format('YYYY/MM/DD')}`)
      let useData1 = res.data.map(item=>{
        return {...item, date:item.time.split(' ')[0], time:item.time.split(' ')[1]}
      })
      let useData2 = Object.values(useData1.reduce((acc, { date, ...rest }) => {
        if (acc[date]) {
          acc[date].data.push({...rest});
        } else {
          acc[date] = { date, data: [{ ...rest }] };
        }
        return acc;
      }, {}));

      console.log('useData2', useData2)
      setData(useData2)
    } catch (err) {
      setData([])
    }
  }

  


  return (
    <DashboardContainer>
      <TitleContainer>
        <TitleBoard>
          
          <div>
          <h3>Nest Home Climate Control Data</h3>
          <div>
            start date:
            <input
              type='date'
              value={startDate}
              onChange={e => {
                setStartDate(e.target.value)
                getData()
              }}
            />
            end date:
            <input
              type='date'
              value={endDate}
              onChange={e => {
                setEndDate(e.target.value)
                getData()
              }}
            />
          </div>
          </div>
        </TitleBoard>
        <div>
          <DiscreteColorLegend
            items={[
                {title: 'current temp', color: '#0182C8', strokeWidth:'3px'},
                {title: 'target temp', color: '#6C8893', strokeWidth:'3px'},
                {title: 'outside temp', color: 'pink', strokeWidth:'3px'},
              ]}
            orientation="horizontal"
          />
        </div>
      </TitleContainer>
      {
        data.length === 0 &&
        <GraphContainer>
          <p>Data Not Available</p>
          <p>Please Pick A Range Between: 11/01/2018 - 03/06/2019</p>
        </GraphContainer>
      }
      {
        data.length !== 0 &&
        <GraphContainer>
          <FlexibleXYPlot yDomain={[45,100]}  colorType="linear"
                          colorDomain={[0, 9]}
                          colorRange={['yellow', 'orange']}>
            <HorizontalGridLines />
            <XAxis
              attr="x"
              attrAxis="y"
              orientation="bottom"
              tickFormat={function tickFormat(d){return `${d}:00`}}
              title="local time"
            />
            <YAxis
              attr="y"
              attrAxis="x"
              orientation="left"
              title="°F"
            />
            {data.map((props,index) => (
              <LineSeries data={props.map( item => (
                {x:item.data.time, y:item.data.current_temp}
              ))} 
              opacity = {0.8}
              color = {index}
              key = {index}

            />
            ))}
            
            {/* <LineSeries data={data.map(item => (
              { x: item.time, y: item.current_temp }))}
              opacity={.75}
              color="#0182C8"
              strokeStyle="solid"
              style={{}}
              curve="curveBasis"
              strokeWidth="3px"
            />
            <LineSeries data={data.map(item => (
              { x: item.time, y: item.target_temp }))}
              opacity={.75}
              color="#6C8893"
              strokeStyle="solid"
              style={{}}
              curve="curveBasis"
              strokeWidth="3px"
            /> */}
          </FlexibleXYPlot>
        </GraphContainer>
      }
    </DashboardContainer>
  )
}

export default Dashboard
