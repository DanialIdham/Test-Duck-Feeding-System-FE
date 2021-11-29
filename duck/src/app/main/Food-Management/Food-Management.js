import React, { useState, useRef, useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Actions from "../store/actions";
import { makeStyles } from "@material-ui/core/styles";
import Button from '@material-ui/core/Button';
import moment from 'moment';
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



const FoodManagement = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const foods = useSelector(({ app }) => app.App.foods);
    const [data, setData] = useState([]);
    const [open, setOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState(null);
    const [actionType, setActionType] = React.useState('add');

    useEffect(() => {
        function getFilteredArray(foods) {
            const arr = Object.keys(foods).map((id) => foods[id]);
            return arr;
        }
        if (foods) {
            setData(getFilteredArray(foods));
        }
    }, [foods]);

    useEffect(() => {
        dispatch(Actions.getAllFood())
    }, [])

    const handleClickOpen = (data, type) => {
        setActionType(type)
        setSelectedValue(data);
        setOpen(true);
    };

    const handleClose = (value) => {
        dispatch(Actions.getAllFood())
        setOpen(false);
        setSelectedValue(value);
    };

    const backToMain = () => {
        window.location.href = "/";
    }

    const goToFarm = () => {
        window.location.href = "/farms";
    }
    return (
        <div className={classes.root}>
            <ButtonGroup variant="contained" aria-label="outlined primary button group">
                <Button variant="contained" onClick={() => backToMain()} color="primary">Back To Main</Button>
                <Button variant="contained" onClick={() => goToFarm()} color="primary">Farm Management</Button>
                <Button variant="contained" onClick={() => handleClickOpen("", 'add')} color="default">Add New Food</Button>
                <Button variant="contained" color="primary">Schedule A Feeding</Button>
            </ButtonGroup>
            <div style={{ height: 400, width: '100%' }}>
                <EditFood
                    actionType={actionType}
                    selectedValue={selectedValue}
                    open={open}
                    onClose={handleClose} />
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Food Name</TableCell>
                                <TableCell>Created Date</TableCell>
                                <TableCell>Modified Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((row) => (
                                <TableRow key={row.id} hover onClick={() => handleClickOpen(row, 'edit')}>
                                    <TableCell>{row.name}</TableCell>
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

const EditFood = (props) => {
    const { onClose, selectedValue, actionType, open } = props;
    const dispatch = useDispatch();
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    let [id, setId] = useState('');
    let [name, setName] = useState('');

    const handleClose = () => {
        onClose(selectedValue);
    };

    useEffect(() => {
        if (actionType === 'edit') {
            setId(selectedValue.id);
            setName(selectedValue.feeding_time);

        } else {
            setId(null);
            setName("");
        }
    }, [actionType, selectedValue]);

    const handleSnackClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    function handleSubmit(event) {
        event.preventDefault();
        if (actionType === 'add') {
            const bodyParameters = {
                name: name,
            };
            dispatch(Actions.addFood(bodyParameters)).then(function (response) {
                if (response.payload.status === 200) {
                    setSnackbarOpen(true)
                }
            })
        } else {
            console.log("name", name)
            const bodyParameters = {
                id: id,
                name: name,
            };
            dispatch(Actions.updateFood(bodyParameters)).then(function (response) {
                if (response.payload.status === 200) {
                    setSnackbarOpen(true)
                }
            })
        }
        onClose(selectedValue);
    }

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
                        <FormControl fullWidth>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                value={name}
                                onInput={e => setName(e.target.value)}
                                label="Food Name"
                                type="text"
                                variant="standard"
                            />
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

export default FoodManagement;