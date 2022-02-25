import './Navigation.css';
import { useNavigate } from 'react-router-dom';

interface NavigationProps {
    name: string;
    address: string;
}

function Navigation(props: { nav: NavigationProps[] }) {
    let navigate = useNavigate();
    let key = 0;
    return <div className="main-navigation">
        {props.nav.map((n => <div className={`navigation-link navigation-${n.name}`}
            key={++key}
            onClick={() => { navigate(n.address) }}>
            {n.name}
        </div>))}
    </div>
}

export default Navigation;