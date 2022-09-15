import { useContext } from 'react';
import SettingsContext from 'src/contextapi/contexts/SettingsContext';

const useSettings = () => useContext(SettingsContext);

export default useSettings;
