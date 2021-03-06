import {observer} from "mobx-react"
import React from 'react'
import moment from 'moment'
import ShiftModal from './ShiftModal'
import ShiftBox from './ShiftBox'
import _ from 'lodash'
/* 
*/

const heightPerMinute = 1
const heightPerDay =heightPerMinute * 60 * 24
const DayView = observer(({shifts, date, onEdit, onDelete, onFocus, focusedShift}) => (
    (dayShifts => <div className="day-view" key={date}>
        <div className="header">
            {moment(date).format('dddd D/M')}
        </div>
        <div className="table">
            {_.map(dayShifts, shift => (
                <ShiftBox heightPerMinute={heightPerMinute} shift={shift} onEdit={() => onEdit(shift)} onDelete={() => onDelete(shift)} onFocus={onFocus} focusedShift={focusedShift} />
            ))}
        </div>
    </div>)(shifts.filter(s => moment(s.startDate).isBetween(moment(date).startOf('day'), moment(date).endOf('day'))))
))

const ShiftManagerRoster = observer(({shiftManagerModel}) => (
    <div className={`shift-manager-roster ${shiftManagerModel.weekView ? 'weekly' : 'daily'}`} style={{height: heightPerDay}}>
        <div className="row-header">
            <div className="header"></div>
            {new Array(48).fill(0).map((d, i) => 
                <div className="hour-header" style={{height: heightPerMinute * 30}}>{i % 2 ? '' : moment().startOf('day').add(i * 30, 'minutes').format('H:mm')} </div>
            )}
        </div>
        {new Array(shiftManagerModel.weekView ? 7 : 1).fill(0).map((d, i) => 
            <DayView shifts={shiftManagerModel.filteredShifts} focusedShift={shiftManagerModel.focusedShift}
                onDelete={shiftManagerModel.deleteShift}
                onEdit={shift => shiftManagerModel.currentShift = shift}
                onFocus={shift => shiftManagerModel.focusedShift = shift}
                date={moment(shiftManagerModel.dateRange[0]).add(i, 'days')} />)}
    </div>
))

export default ShiftManagerRoster;
