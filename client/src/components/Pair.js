import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Button, TextField, IconButton, Checkbox, FormControlLabel } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../icon.png';
import '../App.css';
import { FaSun, FaMoon } from 'react-icons/fa';
import LogoutPopup from './LogoutPopup';
import { getGoals,getPair} from '../api';


const PairPage = () => {
    const email = sessionStorage.getItem('userEmail');

    const fetchPair = () =>{
        if (email){
            
        }
    }

    useEffect(() =>{
        fetchPair();
    });

};

export default PairPage;
