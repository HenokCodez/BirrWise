import { useSelector } from 'react-redux';
import { LIGHT_THEME, DARK_THEME } from '../constants/theme';

export const useTheme = () => {
  const { darkMode } = useSelector((state) => state.theme);
  const colors = darkMode ? DARK_THEME : LIGHT_THEME;
  
  return { colors, isDark: darkMode };
};
