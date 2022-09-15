import { useContext } from 'react';
import AuthContext from 'src/contextapi/contexts/AuthContextPROD';

const useAuth = () => useContext(AuthContext);

export default useAuth;
