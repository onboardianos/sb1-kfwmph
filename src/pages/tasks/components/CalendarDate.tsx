import { Badge } from "@mui/material";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers";
import { Moment } from "moment";

const CalendarDate = (props: PickersDayProps<Moment> & { highlightedDays?: string[], dueDates?: Record<string, boolean> }) => {
    const { highlightedDays = [], dueDates = {}, day, outsideCurrentMonth, ...other } = props;

    const isSelected =
        !outsideCurrentMonth && 
        highlightedDays.indexOf(day.format('YYYY-MM-DD')) >= 0 && 
        !props.selected 

    const isOverdue = dueDates[day.format('YYYY-MM-DD')] === true;
    
    return (
        <Badge
            key={props.day.toString()}
            overlap="circular"
            color={isOverdue ? "error" : "primary"} // Red if overdue, blue otherwise
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
            }}
            sx={{
                '& .MuiBadge-dot': {
                    right:"50%"
                }
            }}
            variant="dot"
            invisible={!isSelected}
        >
            <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
        </Badge>
    );
}
export default CalendarDate;