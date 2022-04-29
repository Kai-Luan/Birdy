import React, { useState, useEffect} from 'react';

import axios from 'axios'

export const api = axios.create({baseURL: 'http://localhost:4000', withCredentials: true})
export const UserContext = React.createContext();