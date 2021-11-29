import React, { useState, useRef, useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from 'moment';
import * as Actions from "../store/actions";
import { makeStyles } from "@material-ui/core/styles";
import Button from '@material-ui/core/Button';
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
    }
});

const FarmManagement = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const entities = useSelector(({ app }) => app.App.farms);
    const [data, setData] = useState([]);
    const [open, setOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState(null);
    const [actionType, setActionType] = React.useState('add');

    const handleClickOpen = (data, type) => {
        setActionType(type)
        setSelectedValue(data);
        setOpen(true);
    };

    const handleClose = (value) => {
        dispatch(Actions.getAllFarm())
        setOpen(false);
        setSelectedValue(value);
    };

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
        dispatch(Actions.getAllFarm())
    }, [])

    const backToMain = () => {
        window.location.href = "/";
    }

    const gotToFood = () => {
        window.location.href = "/food";
    }

    return (
        <div className={classes.root}>
            <ButtonGroup variant="contained" aria-label="outlined primary button group">
                <Button variant="contained" onClick={() => backToMain()} color="primary">Back To Schedule Feeding</Button>
                <Button variant="contained" onClick={() => gotToFood()} color="primary">Food Management</Button>
                <Button variant="outlined" onClick={() => handleClickOpen('', 'add')} color="default">Add A Farm</Button>
                <Button variant="contained" color="primary">Schedule A Feeding</Button>
            </ButtonGroup>
            <div style={{ height: 400, width: '100%' }}>
                <EditFarm
                    actionType={actionType}
                    selectedValue={selectedValue}
                    open={open}
                    onClose={handleClose} />
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Duck Count</TableCell>
                                <TableCell>Location</TableCell>
                                <TableCell>Food Name</TableCell>
                                <TableCell>Created Date</TableCell>
                                <TableCell>Modified Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((row) => (
                                <TableRow key={row.id + 'farm'} hover onClick={() => handleClickOpen(row, 'edit')}>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>{row.duck_count}</TableCell>
                                    <TableCell>{row.location}</TableCell>
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

const EditFarm = (props) => {
    const { onClose, selectedValue, actionType, open } = props;
    const dispatch = useDispatch();
    const foods = useSelector(({ app }) => app.App.foods);
    const [foodList, setFoodList] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    let [id, setId] = useState('');
    let [name, setName] = useState('');
    let [duckCount, setDuckCount] = useState('');
    let [location, setLocation] = useState('');
    let [selectedFood, setSelectedFood] = useState('');

    const handleClose = () => {
        onClose(selectedValue);
    };

    useEffect(() => {
        if (actionType === 'edit') {
            setId(selectedValue.id);
            setName(selectedValue.name);
            setDuckCount(selectedValue.duck_count);
            setLocation(selectedValue.location);
            setSelectedFood(selectedValue.food_id);
        } else {
            setId(null);
            setName(null);
            setDuckCount(null);
            setLocation(null);
            setSelectedFood(null);
        }
    }, [actionType, selectedValue]);

    const handleChange = (event) => {
        const { target: { value }, } = event;
        setSelectedFood(value);
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
        dispatch(Actions.getAllFood())
    }, [])

    function handleSubmit(event) {
        event.preventDefault();

        if (actionType === 'add') {
            const bodyParameters = {
                name: name,
                duck_count: duckCount,
                food_id: selectedFood,
                location: location
            };
            dispatch(Actions.addFarm(bodyParameters)).then(function (response) {
                if (response.payload.status === 200) {
                    setSnackbarOpen(true)
                }
            })
        } else {
            const bodyParameters = {
                id: id,
                name: name,
                duck_count: duckCount,
                food_id: selectedFood,
                location: location
            };
            dispatch(Actions.updateFarm(bodyParameters)).then(function (response) {
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

    return (
        <div>
            <Snackbar
                message={"Data Added/Edit Successfully"}
                open={snackbarOpen}
                onClose={handleSnackClose}
                autoHideDuration={2000}
            />
            <Dialog open={open} onClose={onClose}>
                <DialogTitle>{actionType === 'edit' ? "Edit Scheduled Feeding" : "Add Schedule Feeding"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {actionType === 'edit' ? "Edit the previous data" : "Add a new data"}
                    </DialogContentText>
                    <Box
                        component="form"
                        sx={{
                            '& .MuiTextField-root': { m: 1, width: '25ch' },
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <FormControl fullWidth>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                value={name}
                                onInput={e => setName(e.target.value)}
                                label="Name"
                                type="name"
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
                        <FormControl fullWidth>
                            <TextField
                                autoFocus
                                margin="dense"
                                value={location}
                                onInput={e => setLocation(e.target.value)}
                                id="location"
                                label="Location"
                                type="text"
                                variant="standard"
                            />
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Select A Food</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="food"
                                value={selectedFood}
                                onChange={handleChange}
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

export default FarmManagement;