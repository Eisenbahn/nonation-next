/* ------| Servidor |------ */
import NextHead from 'next/head'

interface HeadProps {
    title?: string
}

export default function Head({ title }: HeadProps) {
    return (
        <>
            <NextHead>
                <meta name="theme-color" content="#1C1917" />
                <meta name="viewport" content="width=device-width,initial-scale=1"/>
                <meta name="description" content="Boleto através do WhatsApp, serviço de rastreio para sua loja, criação de e-mails para automação de marketing e muito mais. Plataforma ideal para o dropshipper" />
                <meta name="keywords" content="drop, dropshipping, drop shipping, shopify, boletos, whatsapp, automação, rastreio, automação de marketing, mercado pago, yampi" />

                <meta property="og:title" content={ title } />
                <meta property="og:description" content="Boleto através do WhatsApp, serviço de rastreio para sua loja, criação de e-mails para automação de marketing e muito mais. Plataforma ideal para o dropshipper" />
                <meta property="og:image" content=""/>

                <title>{ title }</title>

                <link rel="preconnect" href="https://fonts.gstatic.com" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap" rel="stylesheet" />
            </NextHead>
        </>
    )
}   