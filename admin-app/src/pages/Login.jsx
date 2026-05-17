import LoginForm from '../components/auth/LoginForm';

export default function Login() {
  const handleSuccess = () => {
    window.location.href = '/';
  };

  return <LoginForm onSuccess={handleSuccess} />;
}
