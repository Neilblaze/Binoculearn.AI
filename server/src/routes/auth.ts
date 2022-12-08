// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import jwt from "jsonwebtoken";
import { PrismaClient } from '@prisma/client'
import { Router } from "express";
import { googleOAuth2ClientInstance } from "../utils/googleOAuth2ClientInstance";
import { getAuthToken } from "../utils/getAuthToken";
import { getAuthUser } from "../utils/getAuthUser";
const prisma = new PrismaClient()

const router = Router()

router.get("/google/callback", async (req, res) => {
    try {
        const code: string = (req.query as any).code;
        let { tokens } = await googleOAuth2ClientInstance.getToken(code);
        googleOAuth2ClientInstance.setCredentials(tokens);

        // get data
        // also we're damn sure that the token integrity is okay
        const data: any = jwt.decode(tokens.id_token as string);

        const { name, email, picture } = data;

        let userInstance = await prisma.user.findFirst({
            where: {
                email
            }
        })

        if (!userInstance) {
            const currTime = new Date();
            userInstance = await prisma.user.create({
                data: {
                    email,
                    name,
                    picture,
                    created_time: currTime,
                    last_token_generated_at: currTime
                }
            })
        } else {
            // send the auth cookie
            userInstance.last_token_generated_at = new Date();
            // doing it async
            prisma.user.update({
                where: {
                    email
                },
                data: userInstance
            })
        }

        const token = getAuthToken(userInstance);

        res.setHeader("Content-Type", "text/html")
        res.write(`
            <script>
                localStorage.setItem('${process.env.TOKEN_COOKIE_KEY}', '${token}')
                window.location="/"
            </script>
        `)
        res.end()
    } catch (err) {
        console.error(err);
        res.redirect("/error");
    }
})


router.get('/google/start', (req, res) => {
    try {
        const authUrl = googleOAuth2ClientInstance.generateAuthUrl({
            scope: [
                "https://www.googleapis.com/auth/userinfo.profile",
                "https://www.googleapis.com/auth/userinfo.email",
            ],
        });
        res.redirect(authUrl);
    } catch (err) {
        console.error(err);
        res.redirect("/error");
    }
})


router.get('/me', async (req, res) => {
    try {
        const user=getAuthUser(req)
        if(!user) return res.send({"user": null})

        const userData=await prisma.user.findFirst({
            where: {
                id: user.id
            }
        })
        return res.send({
            error: false,
            user: userData
        });
    } catch (err) {
        console.error(err);
        return res.send({
            user: null
        })
    }
})

export default router
