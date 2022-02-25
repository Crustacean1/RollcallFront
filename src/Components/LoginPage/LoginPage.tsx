import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './LoginPage.css';
import apiHandler from '../../Api/Api';
import { JWToken } from '../../Api/ApiTypes';
import { saveTokenToStorage } from '../Common/Session';

interface LoginPageProps {
    setToken: (token: string) => void;
}
interface FieldProps {
    setValue: (value: string) => void;
    label: string;
    value: string
}

function Field(props: FieldProps) {
    return <div className="login-field">
        <label htmlFor={props.label + "-field"}>{props.label}</label>
        <input type="text" id={props.label + "-field"} value={props.value}
            onChange={(e) => props.setValue(e.currentTarget.value)} placeholder={props.label} />
    </div>
}

function LoginPage(props: LoginPageProps) {
    var navigate = useNavigate();

    var [login, setLogin] = useState<string>("");
    var [password, setPassword] = useState<string>("");

    let tryLogin = () => {
        apiHandler.tryLogin(login, password).then(
            (value: JWToken) => {
                props.setToken(value.token);
                saveTokenToStorage(value.token);
                navigate("/");
            },
            (error: Error) => {
                alert(error);
                setLogin("");
                setPassword("");
            }
        )
    }

    return <div className="login-page main-component">
        <div className="login-panel">
            <h3>Zaloguj się:</h3>
            <Field label="Login" setValue={setLogin} value={login} />
            <Field label="Hasło" setValue={setPassword} value={password} />
            <button className="login-button" onClick={tryLogin}>Zaloguj</button>
        </div>
    </div>
}

export default LoginPage;