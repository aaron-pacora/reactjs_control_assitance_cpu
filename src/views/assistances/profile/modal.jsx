import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';

function getModalStyle() {
  return {
    top: `50%`,
    left: `50%`,
    transform: `translate(-50%, -50%)`,
  };
}

const styles = theme => ({
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    borderRadius : '5px'
  },
  titleModal : {
   fontSize: '40px',
   marginBottom: '20px',
   textAlign: 'center',
   color : '#E34A1D'
  },
  subtitleModal : {
     textAlign : 'center',
     color: '#5A5A5A'
  }
});

class SimpleModal extends React.Component {
  state = {
    open: false,
  };
  componentDidMount(){
     this.handleOpen();
  }
  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;

    return (

        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.open}
          onClose={this.handleClose}
        >
          <div style={getModalStyle()} className={classes.paper}>
            <Typography  id="modal-title" color="secondary" className={classes.titleModal}>
              ¡Advertencia!
            </Typography>
            <Typography variant="subheading" id="simple-modal-description"
              className = {classes.subtitleModal}>
               Usted debe regular sus asistencias, no se encuentra apto, posee mas de 3 faltas.
            </Typography>

          </div>
        </Modal>

    );
  }
}

SimpleModal.propTypes = {
  classes: PropTypes.object.isRequired,
};

// We need an intermediary variable for handling the recursive nesting.
const SimpleModalWrapped = withStyles(styles)(SimpleModal);

export default SimpleModalWrapped;