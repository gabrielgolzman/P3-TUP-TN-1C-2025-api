import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { User } from "../models/User.js";
import { validateEmail, validatePassword, validateString } from "../utils/validations.js";

export const loginUser = async (req, res) => {
    if (!validateLoginUser(req.body))
        return res.status(400).send({ message: "Hubo un error en la solicitud" });

    const { email, password } = req.body;

    const user = await User.findOne({
        where: {
            email
        }
    });

    if (!user)
        return res.status(401).send({ message: "Usuario no existente" });

    const comparison = await bcrypt.compare(password, user.password);

    if (!comparison)
        return res.status(401).send({ message: "Contraseña incorrecto" });

    // Generate token
    const secretKey = 'programacion-2025';
    const token = jwt.sign({ email }, secretKey, { expiresIn: '1h' });

    return res.json(token);
}

export const registerUser = async (req, res) => {

    // if (!validateRegisterUser(req.body))
    //     return res.status(400).send({ message: "Hubo un error en la solicitud" });
    const {
        name,
        email,
        password
    } = req.body;

    const existingUser = await User.findOne({
        where: {
            email,
        }
    });

    if (existingUser)
        return res.status(400).send({ message: "Email ya registrado" })

    const saltRounds = 10;

    const salt = await bcrypt.genSalt(saltRounds);

    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        name,
        email,
        password: hashedPassword
    });

    res.json(user.id);

}

const validateLoginUser = ({ email, password }) => {
    if (!validateEmail(email))
        return false;
    else if (!validatePassword(password, 6, 20, true, true))
        return false;

    return true;
}