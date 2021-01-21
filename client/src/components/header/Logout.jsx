import { useKeycloak } from '@react-keycloak/web';
import SecureLocalStorageManager from '../../utils/SecureLocalStorageManager';

const Logout = () => {
  SecureLocalStorageManager.removeAll();
  const [keycloak] = useKeycloak();
  keycloak.logout({
    redirectUri: window.location.origin.toString(),
  });
  return null;
};

export default Logout;
