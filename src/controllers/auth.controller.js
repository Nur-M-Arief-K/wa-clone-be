import { createUser } from "../services/auth.service.js";

export const postRegister = async (req, res, next) => {
    try {
        const { name, email, picture, status, password } = req.body;
        const newUser = await createUser({ name, email, picture, status, password });
        res.send( newUser );
    } catch (error) {
        next(error);
    }
}

export const postLogin = async (req, res, next) => {
    try {
        
    } catch (error) {
        next(error);
    }
}

export const postLogout = async (req, res, next) => {
    try {
        
    } catch (error) {
        next(error);
    }
}

export const postRefreshToken = async (req, res, next) => {
    try {
        
    } catch (error) {
        next(error);
    }
}