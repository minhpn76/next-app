import { theme, utils } from '@dls/web';

const extendedTheme = {
  ...theme,
  main: {
    ...theme.main,
    colours: {
      ...theme.main.colours,
      divider: '#E1E1E1', // overwrite, default: #D0D0D0
    },
  },
};

/** 
 * breakpoints must be align with the values in above "theme" (if customized)
 * usage sample:
 const StyledDiv = styled.div`
  display: block;

  ${media.xs` // @media (min-width: 48em)
    display: inline-block;
  `}

  ${media.md` // @media (min-width: 62em)
    display: block;
  `}
`;
 */
export const media = utils.createMediaQueries({
  xs: '0em',
  sm: theme.breakpoints.xs,
  md: theme.breakpoints.sm,
  lg: theme.breakpoints.md,
  xl: theme.breakpoints.lg,
  xxl: theme.breakpoints.xl,
});

export default extendedTheme;
