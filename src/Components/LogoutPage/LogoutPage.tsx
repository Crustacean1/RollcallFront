import { useEffect } from 'react';
import { Loading, Loader } from '../Common/Loading';
import { useSession } from '../Common/Session';
import './LogoutPage.css';

function LogoutPage({ nav }: { nav: JSX.Element }) {
    const _session = useSession();

    const redirect = () => {
        _session.endSession();
    }
    const logout = () => {
        setTimeout(redirect, 500);
    }
    useEffect(() => { logout() }, []);
    return <div className="main-component logout-page">
        {nav}
        <h1>Wylogowywanie...</h1>
        <Loading condition={false} target={<></>} loader={<Loader size="100px" />} />
    </div>
}

export default LogoutPage;
