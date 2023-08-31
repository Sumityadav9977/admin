import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Stack, IconButton, InputAdornment, TextField } from '@mui/material';
import axios from 'axios';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';
import { useAuth } from '../../../AuthContext';
// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [emailAddress, setNewemailAddress] = useState("")
  const [password, setPassword] = useState("")

 
  const handleClick = async () => {
    const credentials = { emailAddress, password };
      const apidata = await axios.post(`http://3.85.191.21:4001/employee/admin?emailAddress=${emailAddress}&password=${password}`, credentials)
      console.log(apidata.data.response[0].emailAddress)
      console.log(apidata.data.user)
      if (apidata.data.status === 200) {
        console.log(apidata.data)
          login();
          navigate('/dashboard/app', { replace: true });
          const emailAddress = apidata.data.response[0].emailAddress;
          const name = apidata.data.response[0].name;
          sessionStorage.setItem('emailAddress', emailAddress)
          sessionStorage.setItem('name', name)
          sessionStorage.setItem('token', apidata.data.user)
      }
      else
          alert(apidata.data.response)
       
  }
  useEffect(()=>{
    handleClick()
   }, [])   
  // const handleClick = async () => {
   
  //   const credentials = { emailAddress, password };
    
   
//    const apidata = await axios.post(`http://3.85.191.21:4001/employee/admin?emailAddress=${emailAddress}&password=${password}`,
//    credentials,
//    {
//     headers: {
//     'Content-Type': 'application/json',
//     'Authorization': 'JWT '
// }
//   })
  
// let apiURL = `http://3.85.191.21:4001/employee/admin?emailAddress=${emailAddress}&password=${password}`;
// let option = {
//   method: "POST",
//   headers: {
//       'Accept': 'application/json',
//       'Content-Type': 'application/json'
//     },
//   body: JSON.stringify(credentials)
// }
// let response = await fetch(apiURL, option)
//     let result = await response.json();
//     console.log(result);
// const apiURL = 'http://3.85.191.21:4001/employee/admin';
// const requestData = {
//   emailAddress: emailAddress,
//   password: password,
  // Other data you might want to send
// };

// const headers = {
//   'Content-Type': 'application/json', // Set the appropriate content type
//   // Add any other headers you might need, such as authorization headers
// };

// try {
//   const response = await axios.post(apiURL, requestData, { headers });
//   const responseData = response.data;
//   console.log("response :",responseData)
//   // Handle the response data
// } catch (error) {
  // Handle errors

// }

//     if(apiURL.data.user === 200) {
//     login();
//     navigate('/dashboard/app', { replace: true });
//     console.log(apiURL)
//      const emailAddress = apiURL.data.response[0].emailAddress;
//      const name = apiURL.data.response[0].name;

//      sessionStorage.setItem('emailAddress',emailAddress)
//      sessionStorage.setItem('name',name)
//      sessionStorage.setItem('token',apiURL.data.user)

//    }
//    else
//    alert(apiURL.data.responseData)
 
// }
   
// useEffect(()=>{
//   handleClick()
// }, [])


  return (
    <>
      <Stack spacing={3}>
        <TextField name="email" label="Email address" onChange={(e) => setNewemailAddress(e.target.value)} required/>

        <TextField
          name="password"
          label="Password"
          
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        onChange={(e) => setPassword(e.target.value)} required />
      </Stack>

      <LoadingButton fullWidth style={{marginTop:"30px"}} size="large" type="submit" variant="contained" onClick={handleClick}>
        Login
      </LoadingButton>
    </>
  );
}
