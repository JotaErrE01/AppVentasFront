import React, {
  createContext,
  useEffect,
  useReducer
} from 'react';
import jwtDecode from 'jwt-decode';
import SplashScreen from 'src/components/SplashScreen';

import axs from 'src/utils/axs';
import baseurl from 'src/config/baseurl';


const authState = {
  isAuthenticated: false,
  isInitialised: false,
  user: null,
  role: null,
};


const roleMap = (user) => {
  const { tipo_venta_asesor } = user;

  switch (tipo_venta_asesor) {
    case 0: return "NO VENTA ::";
    case 1: return `VENTA FONDO LARGO PLAZO :: HORIZONTE ::${user}`;
    case 2: return `VENTA FONDO CORTO PLAZO :: CORTO PLAZO INVERSION ::${user}`;
    case 3: return `VENTA PARA AMBOS FONDOS :: HORIZONTE :: CORTO PLAZO INVERSION ::${user}`;
    default: return `NO ROLE`
  }
}

const isValidToken = (accessToken) => {

  if (!accessToken) return false
  const decoded = jwtDecode(accessToken);
  const valid = decoded.exp > (Date.now() / 1000);
  return valid;


};

const setSession = (accessToken) => {
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
    axs.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    localStorage.removeItem('accessToken');
    delete axs.defaults.headers.common.Authorization;
  }
};




const authReducer = (state, action) => {

  switch (action.type) {
    case 'INITIALISE': {
      const { isAuthenticated, user, role } = action.payload;
      return {
        ...state,
        isAuthenticated,
        isInitialised: true,
        user,
        role
      };
    }
    case 'FORGOT_PASSWORD': {
      return {
        ...state,
        password_reset_success: true
      };
    }

    case 'FORGOT_PASSWORD_ERROR': {
      const { mensaje } = action.payload;
      return {
        ...state,
        password_reset_error: mensaje
      };
    }

    case 'LOGIN': {
      const { user, role } = action.payload;

      return {
        ...state,
        isAuthenticated: true,
        user,
        role
      };
    }
    case 'LOGOUT': {
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        role: null
      };
    }
    case 'REGISTER': {
      const { user } = action.payload;

      return {
        ...state,
        isAuthenticated: true,
        user
      };
    }
    case 'ERRORS': {
      const { errors } = action.payload;

      return {
        ...state,
        isAuthenticated: false,
        errors: errors,
        user: null

      };
    }
    default: {
      return { ...state };
    }
  }
};

const AuthContext = createContext({
  ...authState,
  method: 'JWT',
  login: () => Promise.resolve(),
  forgotPassword: () => Promise.resolve(),

  logout: () => { },
  register: () => Promise.resolve()
});


export const AuthProvider = ({ children }) => {

  const [state, dispatch] = useReducer(authReducer, authState);
  const login = async (email, password) => {

    const res = await axs.post(baseurl + '/auth/login', { "usuario": email, "password": password });
    
    if (!res.data.access_token && !res.data.success && res.data.data.length) {
      
      dispatch({
        type: 'ERRORS',
        payload: {
          errors: res.data.data,
        }
      });

    } else {
      
      setSession(res.data.access_token);
      dispatch({
        type: 'LOGIN',
        payload: {
          user: {
            mechanism: res.data.mechanism,
            ...res.data.user,
          },
          role: res.data.role,
          errors: false
        }
      });
    }






  };


  const forgotPassword = async (usuario, password, nuevoPassword) => {

    const res = await axs.post(baseurl + '/auth/forgotPassword', { "usuario": usuario, "password": password, "nuevoPassword": nuevoPassword });
    

    if (!res.data.success) {
      dispatch({
        type: 'FORGOT_PASSWORD_ERROR',
        payload: res.data.payload

      });

    } else {
      dispatch({
        type: 'FORGOT_PASSWORD',
        payload: res.data.payload

      });
    }
  };




  const logout = () => {
    setSession(null);
    dispatch({ type: 'LOGOUT' });
  };



  const register = async (email, name, password) => {
    const response = await axs.post('/api/account/register', {
      email,
      name,
      password
    });
    const { accessToken, user } = response.data;

    window.localStorage.setItem('accessToken', accessToken);

    dispatch({
      type: 'REGISTER',
      payload: {
        user
      }
    });
  };


  /// USE EFFECT PARA EJECUTAR VALIDACION EN BASE A TOKENS
  useEffect(() => {
    const initialise = async () => {
      try {
        const accessToken = window.localStorage.getItem('accessToken');

        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken);

          const config = {
            headers: { Authorization: `Bearer ${accessToken}` }
          }
          const response = await axs.get(baseurl + '/users/me', config);
          const user = response.data.user;
          const role = response.data.role;

          console.log(roleMap(user))

          dispatch({
            type: 'INITIALISE',
            payload: { isAuthenticated: true, user, role }
          });
        } else {
          dispatch({
            type: 'INITIALISE',
            payload: {
              isAuthenticated: false,
              user: null,
              role: null
            }
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: 'INITIALISE',
          payload: { isAuthenticated: false, user: null }
        });
      }
    };

    initialise();
  }, []);

  if (!state.isInitialised) {
    return <SplashScreen />;
  }

  return (
    <AuthContext.Provider value={{ ...state, method: 'JWT', login, forgotPassword, logout, register }} >

      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
