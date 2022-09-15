



const templateExample = {
    "email_cliente": "",
    "nombre_cliente": "",
    "asunto": "",
    "datetime": "",
    "url": "",
    "mail_soporte": "",
    "facebook": "",
    "contact": "",
    "web": "",
}




const MailAgendarVideoCall = (
    { 
        email_cliente, nombre_cliente, asunto, datetime, 
        url, mail_soporte, facebook, instagram, website,
        url_kit
    }
) => {

    const _website = process.env.REACT_APP_AFP_WEB_CLIENT;

    const body = `
    <body style="margin: 0;">
    <div style="
    font-family: Arial, Helvetica, sans-serif;
    max-width: 900px;
    display: block;
    margin-left: auto;
    margin-right: auto;
    color:#3D4852;
    ">
    <div name="banner" style="background-color: #002f83; padding: 1.2em;">
        <img style="height: 45px;"
        src="${_website}/static/mail/logos/genesis_logo_blue.png" />
    </div>
    <div style="
        max-width: 900px;
        background-color: #ffffff;
        border-radius: 12px;
        box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.05);
        margin-bottom: 6em;
        padding-bottom: 3em;
        ">
        <div style="padding: 12px; text-align: center;">
        <img style="
            object-fit: cover;
            height: 300px;
            width: 100%;
            border-top-left-radius: 9pt;
            border-top-right-radius: 9pt;
            " src="${_website}/static/mail/portadas/agendar.png" />
        </div>
        <div style="padding: 0.9em 3em;">
        <h1 style="margin: auto; vertical-align: middle; text-align: center;">
            Hola ${nombre_cliente},
        </h1>
        </div>
        <div style="padding: 0.9em 3em;">
        <p style="font-size: 1.5em;">
            A través de este correo, puedes acceder a nuestra cita en la fecha y hora acordada:
     
        </p>
        </div>
        <div style="padding: 0.9em 3em;">
        <h2 style="margin: auto; text-align: center; margin: 0.6em;">
            ${datetime}
        </h2>
        </div>
        <div style="padding: 0.3em 3em;">
        <p style="font-size: 1.5em;">
            Haz clic en el botón de abajo para acceder a la reunión.
        </p>
        </div>
        <div style="padding: 0.3em 3em;">
        <a href="${url}" style="text-decoration: none;">
            <div style="background-color: #2196f3; border-radius: 9pt;">
                <p style="
                    color: #ffffff;
                    font-size: 1.5em;
                    text-align: center;
                    padding: 0.9em;
                    ">
                    Entrar en la llamada
                </p>
            </div>
        </a>
        </div>
        <div style="padding: 0.3em 3em;">
        <p style="font-size: 1.5em; text-align: center;">
            O ingresa con el link:
        </p>
        <p style="font-size: 1.5em; text-align: center;">
            <a href="${url}" style="color: #2196f3; word-wrap: break-word;">
                ${url}
            </a>
        </p>
        </div>
      

      
      
        <div style="padding: 0.3em 3em;">
        <h3 style="margin: auto; text-align: center; margin: 0.6em;">
            Atención personalizada
        </h3>
     
        <p style="font-size: 1em; text-align: center;">
            a
            <a href="mailto:${mail_soporte}" style="color: #2196f3;">
            ${mail_soporte}
            </a>
        </p>
        </div>
        <div style="padding: 3em 3em;">
        <div style="
            position: absolute;
            height: 0.1em;
            width: 80%;
            background: #f4f6f8;
            "></div>
        </div>
        <div style="padding: 0.3em 3em;">
        <p style="font-size: 1em; text-align: center;">
            GENESIS - Av. V. E. Estrada 511 y Las Monjas (esq.), Guayaquil - EC
        </p>
        </div>
        <div style="padding: 0.3em 3em;">
        <div style="text-align:center; 	">
            
      
                <a href="${facebook}" style="text-decoration:none">
                <img style="height: 30px; margin:.7em "
                    src="${_website}/static/mail/icons/facebook.png"></img>
                </a>

     
                <a href="${instagram}" style="text-decoration:none">
                <img style="height: 30px; margin:.7em "
                    src="${_website}/static/mail/icons/instagram.png"></img>
                </a>

         
                <a href="${website}" style="text-decoration:none">
                <img style="height: 30px; margin:.7em "
                    src="${_website}/static/mail/icons/website.png"></img>
                </a>
          


        </div>
        </div>
    </div>
    </div>
    </body>
    `
    return body;
}


export default MailAgendarVideoCall;