import React from 'react'
import {
  Button,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Dialog,
} from '@mui/material'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import moment from 'moment';
import DatePicker from 'react-datepicker';
import styled from 'styled-components'
import Iconify from './Iconify'
import "./react-datepicker.css";

export default function RegularSchedule({ schedules = [], studentInfo = {}, onChangeSchedule = () => {}, applySchedule }) {
  const [addMode, setAddMode] = React.useState([
    false, false, false, false, false, false, false
  ])
  const [openEditor, setOpenEditor] = React.useState(false)
  const [selectedSchedule, setSelectedSchedule] = React.useState({
    day: undefined,
    korLabel: undefined,
    index: undefined,
    start: undefined,
    end: undefined
  })
  const [weekScheduleItems, setWeekScheduleItems] = React.useState(
      [
        {
          day: 'Sunday',
          korLabel: '일',
          schedules: [
          ]
        },
        {
          day: 'Monday',
          korLabel: '월',
          schedules: [
          ]
        },

        {
          day: 'Tuesday',
          korLabel: '화',
          schedules: [
          ]
        },

        {
          day: 'Wednesday',
          korLabel: '수',
          schedules: [
          ]
        },
        {
          day: 'Thursday',
          korLabel: '목',
          schedules: [
          ]
        },
        {
          day: 'Friday',
          korLabel: '금',
          schedules: [
          ]
        },
        {
          day: 'Saturday',
          korLabel: '토',
          schedules: [
          ]
        },
      ],
  )
  React.useEffect(() => {
    if(schedules.length) setWeekScheduleItems(schedules)
  }, [schedules])
  React.useEffect(() => {
    onChangeSchedule(weekScheduleItems)
  }, [weekScheduleItems])

  React.useEffect(() => {
    if(selectedSchedule.day) setOpenEditor(true)
  }, [selectedSchedule])

  const handleClickAddEachSchedule = (item, index) => {
    setWeekScheduleItems(prev => [
      ...prev.slice(0, index),
      {
        ...prev[index],
        schedules: [
          ...prev[index].schedules,
          item
        ]
      },
      ...prev.slice(index + 1)
    ])
    setAddMode(prev => [
      ...prev.slice(0, index),
      !prev[index],
      ...prev.slice(index + 1)

    ])
  }

  const handleRemoveScheduleItem = (dayIndex, scheduleIndex) => {
    setWeekScheduleItems(prev =>[
      ...prev.slice(0, dayIndex),
      {
        ...prev[dayIndex],
        schedules: prev[dayIndex].schedules.filter((item, index) => index !== scheduleIndex)
      },
      ...prev.slice(dayIndex + 1)
    ])
  }
  return (
    <>
      <Typography variant="h4" gutterBottom>
        정기 스케줄
      </Typography>
      {/* <DayPicker> */}
        {/* { weekScheduleItems.map((value, index) =>
          <Chip
            key={`${value.day} use selector-${index}`}
            color='primary'
            label={value.korLabel}
            variant={value.use ? 'filled' : 'outlined'}
            clickable
            onClick={() => handleClickDay(index)}
          />
        )} */}
      {/* </DayPicker> */}
      <DayTimeWrap>

        { weekScheduleItems.map((value, index) => {
          let strColor = 'default'
          if (value.day === 'Sunday') strColor = 'error'
          else if (value.day === 'Saturday') strColor = 'primary'
          return <div key={`${value.day} selector-${index}`}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                <Typography variant="h5" gutterBottom color={strColor} style={{ margin: 0 }}>
                  {value.korLabel}요일
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={
                    <Iconify icon="line-md:circle-to-confirm-circle-transition" />
                  }
                  onClick={() => applySchedule(index)}
                >
                  반영하기
                </Button>
              </div>
              <Button
                color='inherit'
                onClick={() => setAddMode(prev => [
                  ...prev.slice(0, index),
                  !prev[index],
                  ...prev.slice(index + 1)
                ])}
              >
                { !addMode[index] ? <AddCircleOutlineIcon /> : <HighlightOffIcon />}

              </Button>
            </div>
            { weekScheduleItems[index].schedules.length !== 0 &&
              <List >
                <Divider />
                { weekScheduleItems[index].schedules.map((item, scheduleIndex) =>
                  <ListItemButton divider key={`${item.day}-reg-item-${scheduleIndex}`}
                    onClick={() => {
                      // setOpenEditor(true);
                      setSelectedSchedule({
                        day: weekScheduleItems[index].day,
                        korLabel: weekScheduleItems[index].korLabel,
                        start: item.start,
                        end: item.end,
                        dayIndex: index,
                        scheduleIndex,
                      })
                    }}
                  >
                    <span>
                      {scheduleIndex + 1}
                    </span>
                    <ListItemText style={{ textAlign: 'center' }} primary={moment(item.start).format('hh:mm a')} />
                    ~
                    <ListItemText style={{ textAlign: 'center' }} primary={moment(item.end).format('hh:mm a')} />
                    <IconWrap
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveScheduleItem(index, scheduleIndex)
                      }}
                    >
                      <RemoveCircleOutlineOutlinedIcon />
                    </IconWrap>
                  </ListItemButton>
                )}

              </List>

            }
            { addMode[index] &&
              <TimeSelector
                handleClick={(item) => handleClickAddEachSchedule(item, index)}
              />
            }
          </div>
        })}
      </DayTimeWrap>
      <Dialog open={openEditor} onClose={() => setOpenEditor(false)} 
        sx={{ '& .MuiPaper-root': { overflow: 'visible' } }}
      >
        <EditorWrapper>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                {selectedSchedule.korLabel}요일 {selectedSchedule.scheduleIndex + 1}번째 정기스케줄 수정
            </Typography>
            <CloseOutlinedIcon style={{ cursor: 'pointer' }} onClick={() => setOpenEditor(false)}/>
          </div>
          <TimeSelector
            handleClick={({start, end}) => {
              setWeekScheduleItems(prev => [
                ...prev.slice(0, selectedSchedule.dayIndex),
                {
                  ...prev[selectedSchedule.dayIndex],
                  schedules: [
                    ...prev[selectedSchedule.dayIndex].schedules.slice(0, selectedSchedule.scheduleIndex),
                    { start, end },
                    ...prev[selectedSchedule.dayIndex].schedules.slice(selectedSchedule.scheduleIndex + 1)
                  ]
                },
                ...prev.slice(selectedSchedule.dayIndex + 1)
              ])
              setOpenEditor(false)
            }}
            defaultStart={selectedSchedule.start}
            defaultEnd={selectedSchedule.end}
          />
        </EditorWrapper>
      </Dialog>
    </>
  )
}

const IconWrap = styled.div`
  transition: all 0.2s ease-in-out;
  display: flex;
  justify-content: center;

  padding: 4px;
  border-radius: 8px;
  /* padding: 4px; */
  /* background-color: red; */
  &:hover {
    color: #d60000;
    background-color: #ffe9e9;
  }
`

const DayTimeWrap = styled.div`
  margin-bottom: 8px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const EditorWrapper = styled.div`
  /* background-color: red; */
  padding: 20px;
  overflow: visible;
`

const TimeSelector = ({ handleClick, defaultStart, defaultEnd }) => {
  const [start, setStart] = React.useState(setHours(setMinutes(new Date(), 0), 9))
  const [end, setEnd] = React.useState(setHours(setMinutes(new Date(), 0), 13))
  // const [use, setUse] = React.useState()

  React.useEffect(() => {
    if(defaultStart) setStart(defaultStart)
  }, [defaultStart])

  React.useEffect(() => {
    if(defaultEnd) setEnd(defaultEnd)
  }, [defaultEnd])

  return(
    <TimePickerWrap>
      <DatePicker
        placeholderText='시작시간'
        selected={start}
        onChange={(time) => {
          setStart(time)
          setEnd(moment(time).add('4', 'hour').toDate())
        }}
        showTimeSelect
        showTimeSelectOnly
        timeFormat="HH:mm a"
        timeIntervals={30}
        timeCaption="시작시간"
        dateFormat="hh:mm a"
        // disabled={!use}
        minTime={setHours(setMinutes(new Date(), 0), 9)}
        maxTime={setHours(setMinutes(new Date(), 0), 22)}
      />
      ~
      <DatePicker
        placeholderText='종료시간'
        selected={end}
        onChange={(time) => setEnd(time)}
        showTimeSelect
        showTimeSelectOnly
        timeFormat="HH:mm a"
        timeIntervals={30}
        timeCaption="종료시간"
        dateFormat="hh:mm a"
        // disabled={!use}
        minTime={setHours(setMinutes(new Date(), 0), 10)}
        maxTime={setHours(setMinutes(new Date(), 0), 23)}
      />
      <Button onClick={() => handleClick({start, end})}>
        확인
      </Button>
    </TimePickerWrap>
  )
}

const TimePickerWrap = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`
