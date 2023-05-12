import Subscribe from '../models/Subscribe.js'
import bizSdk from 'facebook-nodejs-business-sdk'
import nodemailer from 'nodemailer'

export const createSubscribe = async (req, res) => {
    try {
        const { email, fbp, fbc } = req.body
        const EventRequest = bizSdk.EventRequest
        const UserData = bizSdk.UserData
        const ServerEvent = bizSdk.ServerEvent
        const access_token = process.env.APIFACEBOOK_TOKEN
        const pixel_id = process.env.APIFACEBOOK_PIXELID
        const api = bizSdk.FacebookAdsApi.init(access_token)
        let current_timestamp = new Date()
        const userData = (new UserData())
            .setEmail(email)
            .setClientIpAddress(req.connection.remoteAddress)
            .setClientUserAgent(req.headers['user-agent'])
            .setFbp(fbp)
            .setFbc(fbc)
        const serverEvent = (new ServerEvent())
            .setEventName('Lead')
            .setEventTime(current_timestamp)
            .setUserData(userData)
            .setEventSourceUrl('https://blaspod.cl/')
            .setActionSource('website')
        const eventsData = [serverEvent]
        const eventRequest = (new EventRequest(access_token, pixel_id))
            .setEvents(eventsData)
            eventRequest.execute().then(
                response => {
                    console.log('Response: ', response)
                },
                err => {
                    console.error('Error: ', err)
                }
            )
        const fecha = new Date()
        async function main() {
            let transporter = nodemailer.createTransport({
                host: "smtp.hostinger.com",
                port: 465,
                secure: true,
                auth: {
                    user: 'contacto@blaspod.cl',
                    pass: 'Estevan5966@',
                },
            })
            await transporter.sendMail({
                from: '"Blaspod Store" <contacto@blaspod.cl>',
                to: email,
                subject: "¡Te damos la bienvenida a Blaspod Store! Nos hace muy felices tenerte con nosotros",
                html: `<div style="display: flex; margin: 20px;">
                <div style="margin: auto; width: 600px;">
                    <div style="display: flex; border-bottom: 1px solid #caccd6; padding-bottom: 10px;">
                        <a style="margin: auto;" href="https://blaspod.cl/"><img src="https://res.cloudinary.com/blasspod/image/upload/v1664841659/blaspod/ouxxwsmqodpemvffqs7b.png" style="width: 270px;" /></a>
                    </div>
                    <div style="border-bottom: 1px solid #caccd6; padding-bottom: 30px;">
                        <h1 style="text-align: center; font-family: poppins, sans-serif; padding-bottom: 0px; font-weight: 500; font-size: 30px;">Te damos las gracias por unirte a nuestra lista</h1>
                        <p style="text-align: center; font-family: poppins, sans-serif; color: #000000; font-size: 16px; font-weight: 300;">Ahora seras el primero en enterarte de increíbles ofertas, sorteos y ademas podras tener acceso privilegiado a ofertas exclusivas de la tienda.</p>
                        <div style="display: flex;">
                            <a style="margin: auto; background-color: #303237; color: #fff; padding: 8px 35px; border-radius: 5px; font-family: poppins, sans-serif; text-decoration: none; font-size: 16px;" href="https://blaspod.cl/">Visitar tienda</a>
                        </div>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <div style="padding: 0px 5px; width: 50%;">
                            <p style="font-family: poppins, sans-serif; font-size: 15px;">Blaspod Store</p>
                            <p style="font-family: poppins, sans-serif; font-size: 15px;">+56996150056</p>
                            <p style="font-family: poppins, sans-serif; font-size: 15px;">Comandante chacon 6076, Quinta Normal</p>
                        </div>
                        <div style="padding: 0px 5px; width: 50%; margin-top: 10px; text-align: end">
                            <a style="font-family: poppins, sans-serif; font-size: 15px; display: block;" href="https://blaspod.cl">Pagina web</a>
                            <a style="font-family: poppins, sans-serif; font-size: 15px; display: block;" href="https://facebook.com/blaspod">Facebook</a>
                            <a style="font-family: poppins, sans-serif; font-size: 15px; display: block;" href="https://instagram.com/blaspod">Instagram</a>
                            <a style="font-family: poppins, sans-serif; font-size: 15px; display: block;" href="https://wa.me/message/4H6Q4RGYT4FHK1">Whatsapp</a>
                            <a style="font-family: poppins, sans-serif; font-size: 15px; display: block;" href="https://blaspod.cl">Cancelar Suscripción</a>
                        </div>
                    </div>
                </div>
            </div>`
            })
        }
        main().catch(console.error)
        const nuevaSuscripcion = new Subscribe({email, fecha})
        await nuevaSuscripcion.save()
        return res.json(nuevaSuscripcion)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const getSubscribe = async (req, res) => {
    try {
        const suscripciones = await Subscribe.find()
        res.send(suscripciones)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}