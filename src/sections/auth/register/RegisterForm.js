import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import { auth } from '../../../firebase';

// ----------------------------------------------------------------------

export default function RegisterForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const RegisterSchema = Yup.object().shape({
    // firstName: Yup.string().required('이름을 입력해주세요'),
    // lastName: Yup.string().required('성을 입력해주세요'),
    email: Yup.string().email('올바른 메일 주소를 입력해주세요').required('e메일 주소를 입력해주세요'),
    password: Yup.string().min(6, '최소 6자이상 입력해주세요').required('비밀번호를 입력해주세요'),
    passwordChecker: Yup.string().min(6, '최소 6자이상 입력해주세요').required('비밀번호를 입력해주세요'),
  });

  const defaultValues = {
    // firstName: '',
    // lastName: '',
    email: '',
    password: '',
    passwordChecker: '',
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async ({ email, password, passwordChecker }) => {
    // console.log(data)
    // navigate('/dashboard', { replace: true });
    if (password !== passwordChecker) {
      window.alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    try {
      const registRes = await auth.createUserWithEmailAndPassword(email, password);
      console.log(registRes);
      console.log(registRes.user);
      if (registRes.user) navigate('/dashboard/app');
    } catch (e) {
      console.error(e.code, e.message);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {/* <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField name="firstName" label="이름" />
          <RHFTextField name="lastName" label="성" />
        </Stack> */}

        <RHFTextField name="email" label="메일 주소" />

        <RHFTextField
          name="password"
          label="비밀번호"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end" onClick={() => setShowPassword(!showPassword)}>
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <RHFTextField
          name="passwordChecker"
          label="비밀번호 확인"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end" onClick={() => setShowPassword(!showPassword)}>
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
          가입하기
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
