import React, { useState, useEffect, useRef } from "react";
import { filter } from "lodash";
import Swal from 'sweetalert2'
import {
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
// import { InboxOutlined } from "@ant-design/icons";
// import { message, Upload } from "antd";
// import { AppWidgetSummary } from "../sections/@dashboard/app";
import Modal from "react-bootstrap/Modal";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { FormControl, InputLabel, Select } from "@mui/material";
import { Tooltip } from "@mui/material";

import {FaUserCircle, FaUserTie} from 'react-icons/fa'
import {AiTwotoneMail} from 'react-icons/ai'
import { BiSolidContact } from 'react-icons/bi'
import {BsBackspaceFill} from 'react-icons/bs'




// import './App.css';
import {
  Card,
  Stack,
  // Avatar,
  MenuItem,
  Button,
  Container,
  Typography,
  IconButton,
  TablePagination,
} from "@mui/material";
// components
import Iconify from "../components/iconify";
import Scrollbar from "../components/scrollbar";
// sections
import { UserListHead, UserListToolbar } from "../sections/@dashboard/user";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const TABLE_HEAD = [
  { id: "name", label: "Sr. No", alignRight: false },
  { id: "Company_Name", label: "Company Name", alignRight: false },
  { id: "Company_Number", label: "Company Number", alignRight: false },
  {
    id: "Company Incorporation Date",
    label: "Company Incorporation Date",
    alignRight: false,
  },
  { id: "Status", label: "Status", alignRight: false },
  { id: "Remark", label: "Remark", alignRight: false },

];

export default function ProfilePage() {
  // ----------------------------------------------------------------------
  const [statusFilter, setStatusFilter] = useState("All");
  const handleStatusFilterChange = (event,newStatus) => {
    setStatusFilter(newStatus);
    setPage(0); // Reset the page when changing the filter

  };
  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator(order, orderBy) {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function applySortFilter(array, comparator, companyNameQuery, companyNumberQuery) {
    let filteredArray = [...array];
  
    if (companyNameQuery) {
      filteredArray = filteredArray.filter((_user) =>
        _user['Company Name'].toLowerCase().includes(companyNameQuery.toLowerCase())
      );
    }
  
    if (companyNumberQuery) {
      filteredArray = filteredArray.filter((_user) =>
        _user['Company Number'].toLowerCase().includes(companyNumberQuery.toLowerCase())
      );
    }
  
    if (statusFilter !== "All") {
      filteredArray = filteredArray.filter((_user) => _user.Status === statusFilter);
    }
  
    return filteredArray;
  }
  

  const [fileData, setFileData] = useState([]);
  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState("asc");

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState("name");

  const [filterCompanyName, setFilterCompanyName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(50);

  const [selectedUserForPopover, setSelectedUserForPopover] = useState(null);

  const [companyCount, setCompanyCount] = useState(0);

  
  const [showRemark, setShowRemark] = useState(false);
  const [remark, setRemark] = useState("")


  const handleShowRemark = (remark) => {
       setRemark(remark);
       setShowRemark(true)
  }

  const handleCloseRemark = () => {
    setShowRemark(false)
    setRemark('');
  }

  const handleOpenMenu = (event, user) => {
    setSelectedUserForPopover(user); 
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = getData.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };
  const handleFilterByName = (event) => {
    setPage(0);
    setFilterCompanyName(event.target.value);
  };

 

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - fileData.length) : 0;

  const filteredUsers = applySortFilter(fileData, getComparator(order, orderBy), filterCompanyName, '', statusFilter);

  const filteredUsersByStatus = statusFilter !== "All"
  ? filteredUsers.filter((_user) => _user.Status === statusFilter)
  : filteredUsers;


  const isNotFound = !filteredUsers.length && !!filterCompanyName && !!filteredUsersByStatus.length;


  const navigate = useNavigate();
  const [getData, setGetData] = useState([]);
  const [notPickedCount, setNotPickedCount] = useState(0);
  const [interestedCount, setInterestedCount] = useState(0);
  const [matureCount, setMatureCount] = useState(0);
  const [busyCount, setBusyCount] = useState(0);
  const [switchOffCount, setSwitchOffCount] = useState(0);
  const [wrongNoCount, setWrongNoCount] = useState(0);
  const [notInterestedCount, setnotInterestedCount] = useState(0);

  

  const { emailAddress } = useParams();
  async function fetchExcelData() {
    try {
      const response = await axios.post(
        `http://3.85.191.21:4001/exceldata/view/${emailAddress}`
      );
      setFileData(response.data);
      const switchOffCount = response.data.reduce(
        (count, row) => (row.Status === "Switch off" ? count + 1 : count),
        0
      );
      setSwitchOffCount(switchOffCount);
      const wrongNoCount = response.data.reduce(
        (count, row) => (row.Status === "Wrong No" ? count + 1 : count),
        0
      );
      setWrongNoCount(wrongNoCount);
      const interestedCount = response.data.reduce(
        (count, row) => (row.Status === "Interested" ? count + 1 : count),
        0
      );
      setInterestedCount(interestedCount);

      const notInterestedCount = response.data.reduce(
        (count, row) => (row.Status === "Not Interested" ? count + 1 : count),
        0
      );
      setnotInterestedCount(notInterestedCount);

      const matureCount = response.data.reduce(
        (count, row) => (row.Status === "Mature" ? count + 1 : count),
        0
      );
      setMatureCount(matureCount);

      const busyCount = response.data.reduce(
        (count, row) => (row.Status === "Busy" ? count + 1 : count),
        0
      );
      setBusyCount(busyCount);

      const notPickedCount = response.data.reduce(
        (count, row) => (row.Status === "Not Pickup" ? count + 1 : count),
        0
      );
  
      setNotPickedCount(notPickedCount === 0 ? 0 : notPickedCount);
      
      const uniqueCompanyNames = [...new Set(response.data.map((row) => row["Company Name"]))];
      setCompanyCount(uniqueCompanyNames.length);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  async function fetchUser() {

    try {
      const response = await axios.post(
        `http://3.85.191.21:4001/emp/profile/${emailAddress}`
      );
      setGetData(response.data);
    } catch (error) {
      console.error("Error fetching user:", error);
      // setIsLoading(false); // Error occurred, stop loading
    }
  }
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [selectedFileSize, setSelectedFileSize] = useState("");
  const [isFileSelected, setIsFileSelected] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setSelectedFileName(selectedFile.name);
      setSelectedFileSize(selectedFile.size);
      setIsFileSelected(true);
    }
    else {
      setSelectedFileName("");
      setSelectedFileSize("");
      setIsFileSelected(false); // Reset the state when no file is selected
    }
  };


  const handleUpload = async (emailAddress) => {
    if (!isFileSelected) {
      alert('please select file');
      return;
    }
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        `http://3.85.191.21:4001/upload/${emailAddress}`,
        {
          method: "POST",
          body: formData,
        }
      );
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'You have Add Successfully',
        showConfirmButton: true,
        
      })
      fetchExcelData();
      setDataModal(false)
      fileInputRef.current.value = ""; // Clear the file input
      setSelectedFileName("");
      setSelectedFileSize("");
      setIsFileSelected(false);
      const data = await response.text();
      // Display the response from the server
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchExcelData();
  }, [emailAddress]);
  const BackButton = () => {
    navigate(`/dashboard/user`);
  };

  /////////////////////////File Data Modal////////////
  const [dataModal, setDataModal] = useState(false);
  const dataCloseModal = () => {
    setDataModal(false);
  };

  const dataShowModal = () => {
    setDataModal(true);
  };

  return (
    <>
      {getData.map((row)=>{
        return(

      
      {/* <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={5}
      >
        <Typography variant="subtitle2"  sx={{ color: 'text.primary' }}>
          <FaUserCircle  style={{height:'40px',width:'20px',marginLeft:'10px'}}/> : {row.name}

        <AiTwotoneMail style={{height:'40px',width:'20px', marginLeft:'20px'}}/> : {row.emailAddress}
     
          <FaUserTie style={{marginLeft:'20px'}} /> : {row.Designation}
        
        
        <BiSolidContact  style={{height:'40px',width:'20px',marginLeft:'20px'}}/> : {row.number}
        </Typography>
       
        <Button variant="info" marginLeft="-100px" onClick={BackButton}>
         Back
        </Button>
    
      </Stack> */},
      
      <Card style={{backgroundColor:'#F4F6F8', borderbottom: '1px solid rgba(241, 243, 244, 1)'}}>
       <div style={{justifyContent:'space-between',display:'flex'}}>
        <div display='flex'> <FaUserCircle  style={{height:'40px',width:'20px',marginLeft:'10px'}}/> : {row.name}
        <AiTwotoneMail style={{height:'40px',width:'20px', marginLeft:'20px'}}/> : {row.emailAddress}
     
     <FaUserTie style={{marginLeft:'20px'}} /> : {row.Designation}
   
   
   <BiSolidContact  style={{height:'40px',width:'20px',marginLeft:'20px'}}/> : {row.number}
      </div>
       <div style={{display:'flex'}}>
       <Button variant="info" onClick={BackButton}>
         Back
        </Button>
    
       </div>
      </div>
      </Card>
      )
      })}
  
        <Card style={{backgroundColor:'#F4F6F8', borderbottom: '1px solid rgba(241, 243, 244, 1)'}}>
          <div style={{justifyContent:'space-between',display:'flex',textAlign:'center', padding:'10px'}}>
            <div style={{justifyContent:'space-between', textAlign:'center',display:'flex', marginbuttom:'5px'}}>
          <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={dataShowModal}
            >
              Assign Data
            </Button>
            <Typography variant="subtitle2"  sx={{ color: 'text.blue',cursor: 'pointer', alignItems:'center', marginTop:'8px','&:hover': {
          textDecoration: 'underline',
          color:'blue' }, }} onClick={(event) => handleStatusFilterChange(event,'All')} style={{marginLeft:'10px'}}>
             Leads: {companyCount}
        </Typography> 
         <Typography variant="subtitle2"  sx={{ color: 'text.primary',cursor: 'pointer', marginTop:'8px','&:hover': {
          textDecoration: 'underline',
          color:'blue' }, }} onClick={(event) => handleStatusFilterChange(event,'Mature')} style={{marginLeft:'10px'}}>
             Mature: {matureCount}
        </Typography>
        <Typography variant="subtitle2"  sx={{ color: 'text.primary',ml:'20px',cursor: 'pointer', marginTop:'8px','&:hover': {
          textDecoration: 'underline',
          color:'blue' },  }} onClick={(event) => handleStatusFilterChange(event,'Not Pickup')}>
             NotPickUp: {notPickedCount}
        </Typography>
        <Typography variant="subtitle2"  sx={{ color: 'text.primary',ml:'20px',cursor: 'pointer', marginTop:'8px','&:hover': {
          textDecoration: 'underline',
          color:'blue' },  }} onClick={(event) => handleStatusFilterChange(event,'Interested')}>
             Interested: {interestedCount}
        </Typography>
        <Typography variant="subtitle2"  sx={{ color: 'text.primary',ml:'20px',cursor: 'pointer', marginTop:'8px','&:hover': {
          textDecoration: 'underline',
          color:'blue' },  }}  onClick={(event) => handleStatusFilterChange(event,'Busy')}>
             Busy: {busyCount}
        </Typography>
        <Typography variant="subtitle2"  sx={{ color: 'text.primary',ml:'20px',cursor: 'pointer', marginTop:'8px','&:hover': {
          textDecoration: 'underline',
          color:'blue' },  }}  onClick={(event) => handleStatusFilterChange(event,'Wrong No')}>
             WrongNo.: {wrongNoCount}
        </Typography>
        <Typography variant="subtitle2"  sx={{ color: 'text.primary',ml:'20px',cursor: 'pointer', marginTop:'8px','&:hover': {
          textDecoration: 'underline',
          color:'blue' },  }}  onClick={(event) => handleStatusFilterChange(event,'Switch off')}>
             SwitchOff: {switchOffCount}
        </Typography>
        <Typography variant="subtitle2"  sx={{ color: 'text.primary',ml:'20px',cursor: 'pointer', marginTop:'8px','&:hover': {
          textDecoration: 'underline',
          color:'blue' },  }}  onClick={(event) => handleStatusFilterChange(event,'Not Interested')}>
             Not Interested: {notInterestedCount}
        </Typography>
        </div>
       <div style={{display:'flex',marginRight:'100px'}}>
        <UserListToolbar
        numSelected={selected.length}
        filterName={filterCompanyName}
        onFilterName={handleFilterByName}
        // Use the correct function and state here
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
       
      /></div>
      </div>
      </Card>
 
            <Card 
            sx={{mt:6}}>

              <Scrollbar>
              <TableContainer component={Paper}  >
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
               
                    <UserListHead
                      order={order}
                      orderBy={orderBy}
                      headLabel={TABLE_HEAD}
                      rowCount={getData.length}
                      numSelected={selected.length}
                      onRequestSort={handleRequestSort}
                      onSelectAllClick={handleSelectAllClick}
                    />
                    {/* Status Filter */}

                    <TableBody>
                      {filteredUsers
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((row) => {
                          const {
                            id,
                            Company_Name,
                            Company_Number,
                            avatarUrl,
                          } = row;
                          const selectedUser =
                            selected.indexOf(Company_Name) !== -1;

                          return (
                            <TableRow
          hover
          key={row.id}
          tabIndex={-1}
          role="checkbox"
          selected={selectedUser}
          className="custom-row-margin"
          sx={{
            '&:last-child td, &:last-child th': { border: 0 },
            // Apply a CSS class for adjusting row height
            '&.auto-adjust-row': { height: 'auto', whiteSpace: 'normal' },
          }}
        >                  
                        <TableCell
                              align="left"
                              className="custom-row custom-no-wrap"
                              component="th"
                              sx={{ width: '50px' }}
                            >
                              <div className="column-divider">
                                          {row.id}
                                          </div>
                              </TableCell>

                               <TableCell   align="left"
                                            component="th" >
                                           {row["Company Name"]}
                              </TableCell>

                              <TableCell   align="left"  component="th"  >
                                         {row["Company Number"]}
                              </TableCell>

                              <TableCell  align="left"   component="th" >
                                {new Date(
                                  row["Company Incorporation date"]
                                ).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </TableCell>
                              <TableCell align="left">{row.Status}</TableCell>

                              <TableCell   align="left"  component="th"  >
                              <Tooltip title={row.remark || "No Remark"} placement="top">
                              <Button variant="primary" onClick={()=>handleShowRemark(row.remark)} style={{padding:'1px'}}>
                                  view
                                </Button> 
                                </Tooltip>
                                <Modal show={showRemark} onHide={handleCloseRemark} animation={false}>
                                  <Modal.Header closeButton>
                                   <Modal.Title>Remark</Modal.Title>
                                  </Modal.Header>
                                    <Modal.Body> {remark}</Modal.Body>
                                    <Modal.Footer>
                                      <Button variant="secondary" onClick={handleCloseRemark}>
                                        Close
                                      </Button>
                                    
                                      </Modal.Footer>
                                   </Modal>
                                   
                              </TableCell>
                             
                            </TableRow>
                          );
                        })}
                      {emptyRows > 0 && (
                        <TableRow style={{ height: 53 * emptyRows }}>
                          <TableCell colSpan={6} />
                        </TableRow>
                      )}
                    </TableBody>

                    {isNotFound && (
                      <TableBody>
                        <TableRow>
                          <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                            <Paper
                              sx={{
                                textAlign: "center",
                              }}
                            >
                              <Typography variant="h6" paragraph>
                                Not found
                              </Typography>

                              <Typography variant="body2">
                                No results found for &nbsp;
                                <strong>&quot;{filterCompanyName}&quot;</strong>.
                                <br /> Try checking for typos or using complete
                                words.
                              </Typography>
                            </Paper>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    )}
                  </Table>
                  <TablePagination
                rowsPerPageOptions={[50, 100, 200]}
                component="div"
                count={filteredUsers.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
                </TableContainer>
              </Scrollbar>

           
            </Card>
      {/*////////File Upload /////////////////////// */}
      <Modal show={dataModal} onHide={dataCloseModal} class=" modal-xl" style={{"backgroundColor":"black"}}>
        <Modal.Body style={{"backgroundColor":"black"}}>
          <form
            class="form-container"
            enctype="multipart/form-data"
            show={dataModal}
          >
            <div class="upload-files-container" style={{marginLeft:"-300px"}}>
              <div class="drag-file-area">
                <span class="material-icons-outlined upload-icon">
                  {" "}
                  file_upload{" "}
                </span>
                <h3 class="dynamic-message"> Drag & drop any file here </h3>
                <label class="label">
                  {" "}
                  <span class="browse-files">
                    {" "}
                    <input
                      type="file"
                      class="default-file-input"
                      onChange={handleFileChange}
                      ref={fileInputRef}
                    />{" "}
                    <span class="browse-files-text">browse file</span>
                    <br />
                    <span className="file-name" >{selectedFileName}</span>
                  </span>{" "}
                </label>
              </div>
              <span class="cannot-upload-message">
                {" "}
                <span class="material-icons-outlined">error</span> Please select
                a file first{" "}
                <span class="material-icons-outlined cancel-alert-button">
                  cancel
                </span>{" "}
              </span>
              <div class="file-block">
                <div class="file-info">
                  {" "}
                  <span class="material-icons-outlined file-icon">
                    description
                  </span>{" "}
                  
                  <span class="file-name"> </span> |{" "}
                  <span class="file-size"> </span>{" "}
                </div>
                <span class="material-icons remove-file-icon">delete</span>
                <div class="progress-bar"> </div>
              </div>
              <button
                type="button"
                class="upload-button"
                onClick={() => handleUpload(emailAddress)}
              >
                {" "}
                Assign Data{" "}
              </button>
              <Button variant="secondary" onClick={dataCloseModal}>
                Close
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
      {/*/////////////////////Complete File Upload///////// */}
    </>
  );
}
