import * as Yup from 'yup';
import React ,{ useState } from 'react';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Link, Stack, IconButton, InputAdornment , Snackbar} from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField, RHFCheckbox } from '../../../components/hook-form';
// import { Snackbar } from '../../../components/SnakBar/snackbar';
import { auth } from '../../../firebase';
// ----------------------------------------------------------------------

const Alert = React.forwardRef((
  props,
  ref,
) => {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function LoginForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [snackbarState, setSnackbarState] = React.useState({
    open: false,
    message: "",
  });

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('올바른 이메일을 입력해주세요').required('이메일을 입력해주세요'),
    password: Yup.string().min(6, '비밀번호는 6자이상입니다.').required('패스워드를 입력해주세요'),
  });

  const defaultValues = {
    email: '',
    password: '',
    remember: true,
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleClose = () => {
    setSnackbarState(prev => ({ ...prev, open: false }));
  };
  //

  const onSubmit = async (data) => {
    try {
      const loginRes = await auth.signInWithEmailAndPassword(data.email, data.password)
      if(loginRes) navigate('/dashboard/app')

    } catch(e) {
      console.error(e)
      console.error(e.code)

      if (e.code === "auth/wrong-password") {
        setSnackbarState(({
          message: "비밀번호가 틀렸습니다.",
          open: true,
        }))
      } else if (e.code === "auth/user-not-found"){
        setSnackbarState(({
          message: "존재하지 않는 아이디입니다.",
          open: true,
        }))
      } else {
        // console.error(e)
      }
    }

    // navigate('/dashboard', { replace: true });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <RHFTextField name="email" label="메일 주소" />

        <RHFTextField
          name="password"
          label="비밀번호"
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
        />
      </Stack>
      <Snackbar
        autoHideDuration={1500}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={snackbarState.open}
        onClose={handleClose}
        message={snackbarState.message}
        key='login-fail-alert'
      >
        <Alert onClose={handleClose} severity="error">
          {snackbarState.message}
        </Alert>
      </Snackbar>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <RHFCheckbox name="remember" label="로그인정보 기억하기" />
        <Link variant="subtitle2" underline="hover">
          비밀번호를 잊으셨나요?
        </Link>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
        로그인
      </LoadingButton>
    </FormProvider>
  );
}
