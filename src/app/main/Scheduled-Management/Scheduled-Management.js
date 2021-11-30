import React, { useState, useRef, useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import { useTheme } from '@mui/material/styles';
import moment from 'moment';
import * as Actions from "../store/actions";
import { makeStyles } from '@mui/styles';
import Button from '@material-ui/core/Button';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import TimePicker from '@mui/lab/DateTimePicker';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Dialog, DialogActions,
    DialogContent, DialogContentText, Select, MenuItem, FormControl, InputLabel, Box, Snackbar, ButtonGroup,
    DialogTitle, ListItemText, Checkbox, OutlinedInput
} from '@mui/material';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const useStyles = makeStyles({
    root: {
        width: '100%',
    },
    container: {
        maxHeight: 440,
    },
});

const days = [
    'SUNDAY',
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY'
];


const ScheduledManagement = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const entities = useSelector(({ app }) => app.App.scheduledList);
    const [data, setData] = useState([]);
    const [open, setOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState(null);
    const [actionType, setActionType] = React.useState('add');

    useEffect(() => {
        function getFilteredArray(entities) {
            const arr = Object.keys(entities).map((id) => entities[id]);
            return arr;
        }

        if (entities) {
            setData(getFilteredArray(entities));
        }
    }, [entities]);
    useEffect(() => {
        dispatch(Actions.getAllScheduled())
    }, [])

    const goToMain = () => {
        window.location.href = "/";
    }

    const handleClickOpen = (data, type) => {
        setActionType(type)
        setSelectedValue(data);
        setOpen(true);
    };

    const handleClose = (value) => {
        dispatch(Actions.getAllScheduled())
        setOpen(false);
        setSelectedValue(value);
    };


    return (
        <div className={classes.root}>
            <ButtonGroup variant="contained" aria-label="outlined primary button group">
                <Button variant="contained" onClick={() => goToMain()} color="primary">Main Page</Button>
                <Button variant="contained" onClick={() => handleClickOpen("", 'add')} color="default">Add A Schedule</Button>
            </ButtonGroup>
            <div style={{ height: 400, width: '100%' }}>
                <EditSchedule
                    actionType={actionType}
                    selectedValue={selectedValue}
                    open={open}
                    onClose={handleClose} />
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Feeding Time</TableCell>
                                <TableCell>Feeding Days</TableCell>
                                <TableCell>Feeding Amount</TableCell>
                                <TableCell>Duck Count</TableCell>
                                <TableCell>Farm Name</TableCell>
                                <TableCell>Food Name</TableCell>
                                <TableCell>Created Date</TableCell>
                                <TableCell>Modified Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((row) => (
                                <TableRow key={row.id + 'farm'} hover onClick={() => handleClickOpen(row, 'edit')}>
                                    <TableCell>{row.schedule_time}</TableCell>
                                    <TableCell>{row.schedule_day}</TableCell>
                                    <TableCell>{row.feeding_amount}</TableCell>
                                    <TableCell>{row.duck_count}</TableCell>
                                    <TableCell>{row.farm_name}</TableCell>
                                    <TableCell>{row.food_name}</TableCell>
                                    <TableCell>{moment(row.created_date).format('MMM DD YYYY')}</TableCell>
                                    <TableCell>{moment(row.modified_date).format('MMM DD YYYY')}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                </TableContainer>
            </div>
        </div>
    )
}

const EditSchedule = (props) => {
    const { onClose, selectedValue, actionType, open } = props;
    const dispatch = useDispatch();
    const foods = useSelector(({ app }) => app.App.foods);
    const farms = useSelector(({ app }) => app.App.farms);
    const [foodList, setFoodList] = useState([]);
    const [farmList, setFarmsList] = useState([]);
    const [dayList, setDayList] = React.useState([]);
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    let [id, setId] = useState('');
    let [feeding_time, setFeedingTime] = useState("07: 30");
    let [feeding_amount, setFeedingAmount] = useState('');
    let [duckCount, setDuckCount] = useState('');
    let [selectedFarm, setSelectedFarm] = useState(null);
    let [selectedFood, setSelectedFood] = useState(null);

    const handleClose = () => {
        onClose(selectedValue);
    };

    useEffect(() => {
        if (actionType === 'edit') {
            setId(selectedValue.id);
            setFeedingTime(selectedValue.schedule_time);
            setFeedingAmount(selectedValue.feeding_amount);
            setDayList(selectedValue.schedule_day.split(","));
            setDuckCount(selectedValue.duck_count);
            setSelectedFarm(selectedValue.farm_id);
            setSelectedFood(selectedValue.food_id);
        } else {
            setId(null);
            setDuckCount("");
            setDayList([]);
            setFeedingTime("07:30");
            setFeedingAmount("");
            setSelectedFarm(null);
            setSelectedFood(null);
        }
    }, [actionType, selectedValue]);

    const handleChange = (event, type) => {
        const { target: { value }, } = event;
        if (type === 'farm') {
            setSelectedFarm(value)
        } else {
            setSelectedFood(value);
        }
    };

    useEffect(() => {
        function getFilteredArray(foods) {
            const arr = Object.keys(foods).map((id) => foods[id]);
            return arr;
        }
        if (foods) {
            setFoodList(getFilteredArray(foods));
        }
    }, [foods]);

    useEffect(() => {
        function getFilteredArray(farms) {
            const arr = Object.keys(farms).map((id) => farms[id]);
            return arr;
        }
        if (farms) {
            setFarmsList(getFilteredArray(farms));
        }
    }, [farms]);

    useEffect(() => {
        dispatch(Actions.getAllFood())
        dispatch(Actions.getAllFarm())
    }, [])

    function handleSubmit(event) {
        event.preventDefault();

        if (actionType === 'add') {
            const bodyParameters = {
                schedule_day: dayList,
                schedule_time: feeding_time,
                feeding_amount: feeding_amount,
                duck_count: duckCount,
                food_id: selectedFood,
                farm_id: selectedFarm,
            };
            dispatch(Actions.addScheduled(bodyParameters)).then(function (response) {
                if (response.payload.status === 200) {
                    setSnackbarOpen(true)
                }
            })
        } else {
            const bodyParameters = {
                id: id,
                schedule_day: dayList,
                schedule_time: feeding_time,
                feeding_amount: feeding_amount,
                duck_count: duckCount,
                food_id: selectedFood,
                farm_id: selectedFarm,
            };
            dispatch(Actions.updateScheduled(bodyParameters)).then(function (response) {
                if (response.payload.status === 200) {
                    setSnackbarOpen(true)
                }
            })
        }
    }

    const handleSnackClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const handleTimeChange = (newValue) => {
        setFeedingTime(newValue);
    };

    const handleDays = (event) => {
        const {
            target: { value },
        } = event;
        setDayList(
            // On autofill we get a the stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    return (
        <div>
            <Snackbar
                message={"Data Added/Edit Successfully"}
                open={snackbarOpen}
                onClose={handleSnackClose}
                autoHideDuration={2000}
            />
            <Dialog open={open} onClose={onClose}>
                <DialogTitle>{actionType === 'edit' ? "Edit Schedule" : "Add Schedule"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {actionType === 'edit' ? "Edit the Schedule details" : "Add Schedule"}
                    </DialogContentText>
                    <Box
                        component="form"
                        sx={{
                            '& .MuiTextField-root': { m: 1, width: '25ch' },
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <FormControl sx={{ m: 1, minWidth: 120 }} fullWidth>
                                <TextField
                                    id="time"
                                    label="Feeding Time"
                                    type="time"
                                    defaultValue="07:30"
                                    value={feeding_time}
                                    onInput={e => setFeedingTime(e.target.value)}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    inputProps={{
                                        step: 300, // 5 min
                                    }}
                                    sx={{ width: 150 }}
                                />
                            </FormControl>
                        </LocalizationProvider>
                        <FormControl sx={{ m: 1, minWidth: 120 }} fullWidth>
                            <InputLabel id="demo-simple-select-label">Select A Day</InputLabel>
                            <Select
                                multiple
                                value={dayList}
                                onChange={handleDays}
                                input={<OutlinedInput label="Tag" />}
                                renderValue={(selected) => selected.join(', ')}
                                label="Day List"
                                MenuProps={MenuProps}
                            >
                                {days.map((name) => (
                                    <MenuItem key={name} value={name}>
                                        <Checkbox checked={dayList.indexOf(name) > -1} />
                                        <ListItemText primary={name} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl sx={{ m: 1, minWidth: 120 }} fullWidth>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                value={feeding_amount}
                                onInput={e => setFeedingAmount(e.target.value)}
                                label="Feeding Amount"
                                type="text"
                                variant="standard"
                            />
                        </FormControl>
                        <FormControl sx={{ m: 1, minWidth: 120 }} fullWidth>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="duckCount"
                                value={duckCount}
                                onInput={e => setDuckCount(e.target.value)}
                                label="Duck Count"
                                type="text"
                                variant="standard"
                            />
                        </FormControl>
                        <FormControl sx={{ m: 1, minWidth: 120 }} fullWidth>
                            <InputLabel id="demo-simple-select-label">Select A Farm</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="food"
                                value={selectedFarm}
                                onChange={(e) => handleChange(e, 'farm')}
                            >
                                {farmList.map((row) => (
                                    <MenuItem key={row.id} value={row.id}>{row.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl sx={{ m: 1, minWidth: 120 }} fullWidth>
                            <InputLabel id="demo-simple-select-label">Select A Food</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="food"
                                value={selectedFood}
                                onChange={(e) => handleChange(e, 'food')}
                            >
                                {foodList.map((row) => (
                                    <MenuItem key={row.id} value={row.id}>{row.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit}>Submit</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default ScheduledManagement;