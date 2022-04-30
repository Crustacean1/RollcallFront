import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import './LoginPage.css';
import apiHandler from '../../Api/Api';
import { JWToken } from '../../Api/ApiTypes';
import { Loader, Loading } from '../Common/Loading';
import { useSession } from '../Common/Session';

interface LoginPageProps {
}
interface FieldProps {
    setValue: (value: string) => void;
    label: string;
    value: string
}

function Field(props: FieldProps) {
    return <div className="login-field">
        <label htmlFor={props.label + "-field"}>{props.label}</label>
        <input type={props.label === "Hasło" ? "password" : "text"} id={props.label + "-field"} value={props.value}
            onChange={(e) => props.setValue(e.currentTarget.value)} placeholder={props.label} />
    </div>
}

function LoginPage(props: LoginPageProps) {
    const navigate = useNavigate();

    const _session = useSession();

    const [login, setLogin] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [_loading, setLoading] = useState(false);

    const tryLogin = () => {
        setLoading(true);
        apiHandler.sendRequest<JWToken>("POST", { "Login": login, "Password": password }, "token", "user").then(
            (value: JWToken) => {
                setLoading(false);
                _session.startSession(value.token);
                navigate("/");
            },
            (error: Error) => {
                setLoading(false);
                alert(error);
                setLogin("");
                setPassword("");
            }
        )
    }

    let content = (
        <div className="login-panel">
            <h3>Zaloguj się:</h3>
            <Field label="Login" setValue={setLogin} value={login} />
            <Field label="Hasło" setValue={setPassword} value={password} />
            <button className="login-button" onClick={tryLogin}>Zaloguj</button>
        </div>)

    return <div className="login-page main-component">
        <div className="outer-login-panel">
            <Loading condition={!_loading} target={content} loader={<Loader size="100px" />} />
        </div>
    </div>;
}

export default LoginPage;