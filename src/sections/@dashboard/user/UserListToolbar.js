import React, {useState,  useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
// @mui
import { styled, alpha, useTheme } from '@mui/material/styles';
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { Toolbar, Tooltip, IconButton, Typography, OutlinedInput, InputAdornment } from '@mui/material';
// component
import Iconify from '../../../components/iconify';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
// ----------------------------------------------------------------------
const statusOptions = [
  { value: "All", label: "All" },
  { value: "Interested", label: "Interested" },
  { value: "Mature", label: "Mature" },
  { value: "Busy", label: "Busy" },
  { value: "Not Pickup", label: "Not Pickup" },
];

const StyledRoot = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}));

const StyledSearch = styled(OutlinedInput)(({ theme, open }) => ({
  width: open ? 320 : 48, // Adjust the widths as needed
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': {
    width: 320,
    boxShadow: theme.customShadows.z8,
  },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
  },
}));

// ----------------------------------------------------------------------

UserListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
};

export default function UserListToolbar(props) {
  const { numSelected, filterName, onFilterName, statusFilter, onStatusFilterChange } = props;
  const [isSearchOpen, setSearchOpen] = useState(false);
  const theme = useTheme();
  
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    };

    // Add event listener when the search input is open
    if (isSearchOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isSearchOpen]);

  const handleSearchIconClick = () => {
    setSearchOpen(true);
  };

  const handleSearchInputChange = (event) => {
    onFilterName(event);
    setSearchOpen(false);
  };
  return (
    <>
    
    {/* <StyledRoot
       sx={{
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <StyledSearch
          open={isSearchOpen}
          value={filterName}
          // onChange={handleSearchInputChange}
          onChange={handleSearchInputChange}
          placeholder="Search...."
          startAdornment={
            <InputAdornment position="start"  onClick={() => setSearchOpen(true)}>
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }}  />
            </InputAdornment>
          }
        />
      )} */}

      {/* {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <Iconify icon="eva:trash-2-fill" />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip style={{marginLeft:"50px"}}>
        
        <FormControl sx={{ m: 1, minWidth: 150 }}>
        <Select
      value={statusFilter}
      onChange={onStatusFilterChange}
      MenuProps={{
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'left',
        },
        transformOrigin: {
          vertical: 'top',
          horizontal: 'left',
        },
        getContentAnchorEl: null, // Close immediately after selection
        // onClose: handleCloseStatusDropdown,  // Prevent default close behavior
      }}
    >
      <MenuItem value="All" style={{ borderTop: 'none' }}>All</MenuItem>
      <MenuItem value="Switch Off">Switch Off</MenuItem>
      <MenuItem value="Interested">Interested</MenuItem>
      <MenuItem value="Mature">Mature</MenuItem>
      <MenuItem value="Busy">Busy</MenuItem>
      <MenuItem value="Not Pickup">Not Pickup</MenuItem>
      
    </Select>
    </FormControl> */}
   

          {/* <IconButton> */}
            {/* <Iconify icon="ic:round-filter-list" /> */}
            {/* <FormControl sx={{ m: 1, minWidth: 120 }}> */}
    {/* <InputLabel>Status Filter</InputLabel> */}
    {/* <Select
      value={statusFilter}
      onChange={onStatusFilterChange}
    >
      <MenuItem value="All">All</MenuItem>
      <MenuItem value="Switch Off">Switch Off</MenuItem>
      <MenuItem value="Interested">Interested</MenuItem>
      <MenuItem value="Mature">Mature</MenuItem>
      <MenuItem value="Busy">Busy</MenuItem>
      <MenuItem value="Not Pickup">Not Pickup</MenuItem>
      
    </Select> */}
  {/* </FormControl> */}
          {/* </IconButton> */}
              {/* </Tooltip> */}
            {/* )} */}
          {/* </StyledRoot> */}
          <StyledSearch
  open
  value={filterName}
  onChange={handleSearchInputChange}
  placeholder="Search...."
  startAdornment={
    <InputAdornment position="start">
      <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
    </InputAdornment>
  }
  sx={{
    width: 180, // Set the width for the fixed position
    height:35,
    right: 18, // Set the right position for the fixed position
    transition: 'none', // Disable transition for fixed position
    position: 'absolute', // Set the position to absolute
  }}
/>


    </>
  );
}
