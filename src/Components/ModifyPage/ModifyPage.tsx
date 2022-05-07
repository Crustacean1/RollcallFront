import ChildPage from './ChildPage';
import GroupPage from './GroupPage';
import './ModifyPage.css';

interface ModifyPageProps {
    nav: JSX.Element;
}

function ModifyPage({ nav }: ModifyPageProps) {
    return <div className="main-component modify-page">
        {nav}
        <ChildPage />
        <GroupPage />
    </div>
}

export default ModifyPage;