import PropTypes from 'prop-types';
// material
import { Grid } from '@mui/material';
import AcademyCard from './AcademyCard';

// ----------------------------------------------------------------------

AcademyList.propTypes = {
  Academys: PropTypes.array.isRequired
};

export default function AcademyList({ Academys, ...other }) {
  return (
    <Grid container spacing={3} {...other}>
      {Academys.map((academy) => (
        <Grid key={academy.id} item xs={12} sm={6} md={3}>
          <AcademyCard academy={academy} />
        </Grid>
      ))}
    </Grid>
  );
}
