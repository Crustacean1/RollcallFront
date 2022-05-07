import './Button.css';
interface ButtonProps {
    onPress: () => void;
    text?: string;
    image?: string;
    color?: string;
    textColor?: string;
    hoverColor?: string;
    className?: string;
}

function Button({ onPress, text, image, color, textColor, className }: ButtonProps) {
    const style: any = {};
    if (image !== undefined) { style["backgroundImage"] = `url(${image})`; }
    if (color !== undefined) { style["backgroundColor"] = color; }
    if (textColor !== undefined) { style["color"] = textColor; }
    return <span style={style} className={`button ${className === undefined ? "" : className}`} onClick={onPress}>
        {text !== undefined ? text : ""}
    </span>
}

export default Button;
export type { ButtonProps };