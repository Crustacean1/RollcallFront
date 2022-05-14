import { useState } from 'react';
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
    logIn: () => void
    label: string;
    value: string
    fieldType: string;
}

function Field({ setValue, logIn, label, value, fieldType }: FieldProps) {
    const onEnter = (event: React.KeyboardEvent) => { if (event.key === "Enter" && fieldType === "password") { logIn(); } }
    return <div className="login-field">
        <label htmlFor={label + "-field"}>{label}</label>
        <input type={fieldType} id={label + "-field"} value={value} onKeyDown={onEnter}
            onChange={(e) => setValue(e.currentTarget.value)} placeholder={label} />
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
        apiHandler.post<JWToken>({ "Login": login, "Password": password }, "blank_token", "user").then(
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
            <Field label="Login" fieldType="text" logIn={tryLogin} setValue={setLogin} value={login} />
            <Field label="Hasło" fieldType="password" logIn={tryLogin} setValue={setPassword} value={password} />
            <button className="login-button" onClick={tryLogin}>Zaloguj</button>
        </div>)

    return <div className="login-page main-component">
        <div className="outer-login-panel">
            <Loading condition={!_loading} target={content} loader={<Loader size="100px" />} />
        </div>
    </div>;
}

export default LoginPage;