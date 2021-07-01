/* ------| Servidor |------ */
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Head from '../src/components/@next/head'


/* ------| Componentes |------ */
import { Grid, GridMain, GridSidebar } from '../src/components/@page/Grid'
import { Navbar, NavbarItemUser } from '../src/components/@page/Navbar'
import { Modal } from '../src/components/@global/modal'

/* ------| Estilos |------ */
import Styles from '../src/sass/success.module.scss'
import cookie from 'js-cookie'

export default function Success() {

    const [ isToggled, setToggle ] = useState(false)
    const router = useRouter()
    
    useEffect(() => {
        let timingModal;
        let timingRedirect;

        timingModal = setTimeout(() => {
            setToggle(true)
            clearTimeout(timingModal)
        }, 600)

        if (isToggled) {
            if (cookie.get('cart')) cookie.remove('cart')
            timingRedirect = setTimeout(() => {
                router.push('/')
                clearTimeout(timingModal)
            }, 3000)
        }
    }, [ isToggled ])

    return (
        <div className={Styles.Wrapper}>
            <Head title="Nonation - Finalizar" />
            <div className={`${Styles.Container} ${Styles.ContainerFluid}`}>
                <Grid>
                    <GridSidebar>
                        <div className={Styles.Sidebar}>
                            <div className={Styles.SidebarMenu}>
                                <ul className={Styles.SidebarListGroup}>
                                    <li className={`${Styles.SidebarListGroupItem} ${Styles.Active}`}>
                                        <Link href="/">
                                            <a>
                                                Retornar à loja
                                            </a>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </GridSidebar>
                    <GridMain>
                        <div className={Styles.Main}>
                            <div className={Styles.MainContent}>
                                <Navbar>
                                    <NavbarItemUser />
                                </Navbar>
                                <section className={Styles.MainItems}>
                                    <h1>Compra efetuada com sucesso!</h1>
                                    <Modal title="Compra efetuada com sucesso" isToggled={isToggled} setToggle={setToggle} buttonClose={false}>
                                        <div style={{ textAlign: 'center', fontSize: 18, fontWeight: 600 }}>
                                            Você será redirecionado em alguns segundos
                                        </div>
                                    </Modal>
                                </section>
                            </div>
                        </div>
                    </GridMain>
                </Grid>
            </div>
        </div>
    )
}