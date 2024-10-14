// src/hooks/useBreakPoint.ts
import { useTheme, useMediaQuery } from '@mui/material';

const useBreakPoint = () => {
	const theme = useTheme();
	const isXs = useMediaQuery(theme.breakpoints.down('sm'));
	const isSm = useMediaQuery(theme.breakpoints.between('sm', 'md'));
	const isMd = useMediaQuery(theme.breakpoints.between('md', 'lg'));
	const isLg = useMediaQuery(theme.breakpoints.up('lg'));

	if (isXs) return 'xs';
	if (isSm) return 'sm';
	if (isMd) return 'md';
	if (isLg) return 'lg';
	return 'xl';
};

export { useBreakPoint };
