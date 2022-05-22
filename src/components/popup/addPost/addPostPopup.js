import { Button, CircularProgress, Dialog, FormHelperText, TextField } from '@material-ui/core';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Container, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import * as React from 'react';
import { UserContext } from '../../../context/UserContext';
import { FirebaseService } from '../../../services/FirebaseService';
import { Utils } from '../../../utils/utils';
import './addPostPopup.css';

export default function AddPostPopup() {
  const { user } = React.useContext(UserContext);
  const [open, setOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [hasTriedSubmit, setHasTriedSubmit] = React.useState(false);
  const [values, setValues] = React.useState({
    title: '',
    image: '',
    description: '',
    category: '',
  });

  const onOpen = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    setValues({
      title: '',
      image: '',
      description: '',
      category: '',
    });
    setHasTriedSubmit(false);
  };

  const onValueChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const onFileChange = async (event) => {
    const file = event.target.files[0];
    const fileBase64 = await Utils.fileToBase64(file);
    const image = await Utils.optimizeImage(fileBase64);

    setValues({ ...values, image });
  };

  const onSubmit = async () => {
    setHasTriedSubmit(true);

    if (!values.title || !values.image || !values.description || !values.category) {
      return;
    }

    setIsSubmitting(true);

    await FirebaseService.addPost(
      values.title,
      values.image,
      values.description,
      values.category,
      user.uid,
      user.displayName
    );

    setIsSubmitting(false);

    onClose();
  };

  const categories = ['food', 'music', 'sport', 'technology'];

  return (
    <>
      <IconButton onClick={onOpen} size="small">
        <AddCircleOutlineIcon style={{ fontSize: 48, color: '#bdbdbd' }} />
      </IconButton>
      <Dialog fullScreen open={open} onClose={onClose}>
        <DialogTitle className="add-post-popup-title">
          <h2>Create Your Article</h2>
          <IconButton onClick={onClose} size="small">
            <CloseIcon fontSize="large" />
          </IconButton>
        </DialogTitle>
        <DialogContent style={{ backgroundColor: '#eee' }}>
          {isSubmitting && (
            <div className="post-popup-loading">
              <CircularProgress />
            </div>
          )}
          {!isSubmitting && (
            <Container maxWidth="xl">
              <div className="add-post-popup-content">
                <div className="add-post-popup-image">
                  <label htmlFor="add-post-popup-image">
                    {values.image ? (
                      <img src={values.image} />
                    ) : (
                      <>
                        <IconButton>
                          <CloudUploadIcon style={{ fontSize: 35 }} />
                        </IconButton>
                        <p>Click here to upload an image</p>
                      </>
                    )}
                    <input id="add-post-popup-image" type="file" onChange={onFileChange} />
                  </label>
                  <FormHelperText error={true}>
                    {!values.image && hasTriedSubmit ? 'Image is required' : ''}
                  </FormHelperText>
                </div>
                <div className="add-post-popup-text-fields">
                  <div>
                    <TextField
                      onChange={onValueChange('title')}
                      value={values.title}
                      label="Title"
                      placeholder="Title here"
                      variant="outlined"
                      error={!values.title && hasTriedSubmit}
                      helperText={!values.title && hasTriedSubmit ? 'Title is required' : ''}
                      fullWidth
                    />
                  </div>
                  <div>
                    <TextField
                      onChange={onValueChange('description')}
                      value={values.description}
                      label="Description"
                      placeholder="Description here"
                      variant="outlined"
                      error={!values.description && hasTriedSubmit}
                      helperText={!values.description && hasTriedSubmit ? 'Description is required' : ''}
                      fullWidth
                      multiline={true}
                      minRows={4}
                      maxRows={4}
                    />
                  </div>
                  <div>
                    <FormControl fullWidth>
                      <InputLabel>Choose category</InputLabel>
                      <Select
                        onChange={onValueChange('category')}
                        value={values.category}
                        label="Choose category"
                        error={!values.category && hasTriedSubmit}
                        fullWidth
                      >
                        {categories.map((category) => (
                          <MenuItem key={category} value={category}>
                            {category}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText error={true}>
                        {!values.category && hasTriedSubmit ? 'Category is required' : ''}
                      </FormHelperText>
                    </FormControl>
                  </div>
                </div>
              </div>

              <div className="add-post-popup-submit-button">
                <Button variant="contained" onClick={onSubmit}>
                  Submit
                </Button>
              </div>
            </Container>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
