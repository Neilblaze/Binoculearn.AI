import { Request } from "express";
import jwt from "jsonwebtoken";
import { jwtUserPayloadType } from "./getAuthToken";

// Used by server
export const getAuthUser = (req: Request): null | jwtUserPayloadType => {
    const token = req.headers.authorization ?? "";
    return getAuthUserFromJwt(token)
};


export const getAuthUserFromJwt = (jwtToken: string): null | jwtUserPayloadType => {
    const res: any = jwt.verify(jwtToken, process.env.JSON_WEB_TOKEN_SECRET ?? "");
    return res;
}
