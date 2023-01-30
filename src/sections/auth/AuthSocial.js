import { useNavigate } from 'react-router-dom';
// material
import { Stack, Button, Divider, Typography } from '@mui/material';
// firebase
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
// component
import Iconify from '../../components/Iconify';
import { auth } from '../../firebase';

// ----------------------------------------------------------------------

export default function AuthSocial() {
  const navigate = useNavigate();
  const handleClickGoogleLogin = () => {
    const googleAuthProvider = new GoogleAuthProvider();
    signInWithPopup(auth, googleAuthProvider)
      .then((res) => {
        console.log(res);
        if (res) navigate('/dashboard/app');
      })
      .catch((err) => {
        console.error(err);
        window.alert('서비스 사용 불가');
      });
  };

  const handleClickOtherProviderLogin = () => {
    window.alert('서비스 사용 불가.');
  };

  return (
    <>
      <Stack direction="row" spacing={2}>
        <Button fullWidth size="large" color="inherit" variant="outlined" onClick={handleClickGoogleLogin}>
          <Iconify icon="eva:google-fill" color="#DF3E30" width={22} height={22} />
        </Button>

        <Button fullWidth size="large" color="inherit" variant="outlined">
          <Iconify
            icon="eva:facebook-fill"
            color="#1877F2"
            width={22}
            height={22}
            onClick={handleClickOtherProviderLogin}
          />
        </Button>

        <Button fullWidth size="large" color="inherit" variant="outlined" onClick={handleClickOtherProviderLogin}>
          <Iconify icon="eva:twitter-fill" color="#1C9CEA" width={22} height={22} />
        </Button>
      </Stack>

      <Divider sx={{ my: 3 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          OR
        </Typography>
      </Divider>
    </>
  );
}
