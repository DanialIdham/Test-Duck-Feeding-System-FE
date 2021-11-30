import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as _ from 'lodash';
import moment from 'moment';
import * as Actions from "../store/actions";
import { makeStyles } from '@mui/styles';
import Button from '@material-ui/core/Button';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Dialog, DialogActions,
    DialogContent, DialogContentText, Select, MenuItem, FormControl, InputLabel, Box, Snackbar, ButtonGroup,
    DialogTitle
} from '@mui/material';

const useStyles = makeStyles({
    root: {
        width: '100%',
    },
    container: {
        maxHeight: 440,
    },
});

let params_filter = {
    page: 1,
    per_page: 10,
}

const FeedingSchedule = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const entities = useSelector(({ app }) => app.App.scheduledFeedings);
    const meta = useSelector(({ app }) => app.App.meta);
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
        dispatch(Actions.getAllScheduleFeeding(params_filter))
    }, [])

    const goToFarm = () => {
        window.location.href = "/farms";
    }

    const goToFood = () => {
        window.location.href = "/foods";
    }

    const goToScheduled = () => {
        window.location.href = "/schedules";
    }

    const handleClickOpen = (data, type) => {
        setActionType(type)
        setSelectedValue(data);
        setOpen(true);
    };

    const handleClose = (value) => {
        dispatch(Actions.getAllScheduleFeeding(params_filter))
        setOpen(false);
        setSelectedValue(value);
    };

    function handleChangePage(event, newPage) {
        console.log(newPage)
        params_filter.page = newPage + 10;
        dispatch(Actions.getAllScheduleFeeding(params_filter));
    }

    function handleChangeRowsPerPage(event) {
        console.log(event)
        params_filter.per_page = event.target.value;
        dispatch(Actions.getAllScheduleFeeding(params_filter));
    }

    if (_.isEmpty(meta))
        return (
            <div className="w-full flex flex-col m-10">
                Loading...
            </div>
        );
    return (
        <div className={classes.root}>
            <ButtonGroup variant="contained" aria-label="outlined primary button group">
                <Button variant="contained" onClick={() => goToFarm()} color="primary">Farm Management</Button>
                <Button variant="contained" onClick={() => goToFood()} color="primary">Food Management</Button>
                <Button variant="contained" onClick={() => handleClickOpen("", 'add')} color="default">Add Feeding Schedule</Button>
                <Button variant="contained" onClick={() => goToScheduled()} color="primary">Schedule Listing</Button>
            </ButtonGroup>
            <div style={{ height: 400, width: '100%' }}>
                <EditFeeding
                    actionType={actionType}
                    selectedValue={selectedValue}
                    open={open}
                    onClose={handleClose} />
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Feeding Time</TableCell>
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
                                    <TableCell>{row.feeding_time === null ? <p>No Data</p> : moment(row.feeding_time).format('MMM DD YYYY HH: MM')}</TableCell>
                                    <TableCell>{row.feeding_amount}</TableCell>
                                    <TableCell>{row.duck_count}</TableCell>
                                    <TableCell>{row.farm_id}</TableCell>
                                    <TableCell>{row.food_id}</TableCell>
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

const EditFeeding = (props) => {
    const { onClose, selectedValue, actionType, open } = props;
    const dispatch = useDispatch();
    const foods = useSelector(({ app }) => app.App.foods);
    const farms = useSelector(({ app }) => app.App.farms);
    const [foodList, setFoodList] = useState([]);
    const [farmList, setFarmsList] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    let [id, setId] = useState('');
    let [feeding_time, setFeedingTime] = useState(new Date());
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
            setFeedingTime(selectedValue.feeding_time);
            setFeedingAmount(selectedValue.feeding_amount);
            setDuckCount(selectedValue.duck_count);
            setSelectedFarm(selectedValue.farm_id);
            setSelectedFood(selectedValue.food_id);
        } else {
            setId(null);
            setDuckCount("");
            setFeedingTime(new Date());
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
                feeding_amount: feeding_amount,
                duck_count: duckCount,
                food_id: selectedFood,
                farm_id: selectedFarm,
            };
            dispatch(Actions.addScheduleFeeding(bodyParameters)).then(function (response) {
                if (response.payload.status === 200) {
                    setSnackbarOpen(true)
                }
            })
        } else {
            const bodyParameters = {
                id: id,
                feeding_time: feeding_time,
                feeding_amount: feeding_amount,
                duck_count: duckCount,
                food_id: selectedFood,
                farm_id: selectedFarm,
            };
            dispatch(Actions.updateScheduleFeeding(bodyParameters)).then(function (response) {
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

    return (
        <div>
            <Snackbar
                message={"Data Added/Edit Successfully"}
                open={snackbarOpen}
                onClose={handleSnackClose}
                autoHideDuration={2000}
            />
            <Dialog open={open} onClose={onClose}>
                <DialogTitle>{actionType === 'edit' ? "Edit Farm" : "Add Farm"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {actionType === 'edit' ? "Edit the farm details" : "Add Farm"}
                    </DialogContentText>
                    <Box
                        component="form"
                        sx={{
                            '& .MuiTextField-root': { m: 1, width: '25ch' },
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        {actionType === "edit" ?
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <FormControl fullWidth>
                                    <DateTimePicker
                                        autoFocus
                                        label="Date&Time picker"
                                        value={feeding_time}
                                        onChange={handleTimeChange}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </FormControl>
                            </LocalizationProvider>
                            : null}

                        <FormControl fullWidth>
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
                        <FormControl fullWidth>
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

export default FeedingSchedule;