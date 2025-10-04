// src/App.js
import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  lazy,
  Suspense
} from 'react';
import {
  Container,
  Navbar,
  Nav,
  Button,
  InputGroup,
  FormControl,
  Spinner
} from 'react-bootstrap';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { FaSun, FaBuilding } from 'react-icons/fa';
import { FaBuildingCircleCheck } from "react-icons/fa6";
import { MdAddAlert } from "react-icons/md";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

import './App.css';

// Lazy load pages
const DashboardHome = lazy(() => import('./pages/DashboardHome'));
const ErtPage = lazy(() => import('./pages/ErtPage'));
const ZoneDetailsTable = lazy(() => import('./components/ZoneDetailsTable'));
const CompanySummary = lazy(() => import('./components/CompanySummary'));