import React from 'react';
import {Box} from '../../design';

export const DetailDivider = React.memo(function DetailDivider() {
  return (
    <Box
      height={1}
      backgroundColor="divider"
      marginTop="l"
      marginBottom="m"
    />
  );
});
