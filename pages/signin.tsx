/* ------| Servidor |------ */
import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { AuthContext } from '../src/context/AuthContext'
import Link from 'next/link'
import Head from '../src/components/@next/head'

/* ------| Componentes |------ */
import { Grid, GridMain, GridSidebar } from '../src/components/@page/Grid'
import { Navbar, NavbarItemCart, NavbarItemUser } from '../src/components/@page/Navbar'

/* ------| Estilos |------ */
import { ArrowRight } from 'react-feather'
import Styles from '../src/sass/signin.module.scss'

/* ------| Tipagem |------ */
import { GetServerSidePropsContext } from 'next'

/* ------| Error |------ */
interface InputError {
    hasErrors: boolean;
    errors?: string
}

export default function Signin() {
    const [ inputUser, setInputUser ] = useState('')
    const [ inputUserError, setInputUserError ] = useState<InputError>({ hasErrors: false })
    const { user, signIn } = useContext(AuthContext)

    const router = useRouter()

    useEffect(() => {
        const { redirect } = router.query
        if (user) {
            (redirect)
                ? window.location.href = redirect as string
                : window.location.href = '/'
        }
    }, [ user ])

    return (
        <div className={Styles.Wrapper}>
            <Head title="Nonation - Entrar" />
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
                                    <NavbarItemCart />
                                    <NavbarItemUser />
                                </Navbar>
                                <form className={`${Styles.MainForm} ${inputUserError.hasErrors ? Styles.Error : ''}`} onSubmit={(event) => {
                                    event.preventDefault()
                                    setInputUserError({ hasErrors: false })

                                    if (inputUser == '') {
                                        setInputUserError({
                                            hasErrors: true,
                                            errors: 'O input não pode ser vazio'
                                        })
                                    }

                                    if (!inputUserError?.hasErrors) return signIn(inputUser)
                                }}>
                                    <input
                                        className={Styles.Inputbox}
                                        type="text"
                                        value={inputUser}
                                        onChange={({ target }) => {
                                            setInputUser(target.value)
                                        }}
                                    />
                                    <button className={Styles.ButtonSubmit}  type="submit">
                                        <ArrowRight size={18} strokeWidth={3} />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </GridMain>
                </Grid>
            </div>
        </div>
    )
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    if (context.req.cookies['access-token']) {
        return {
            redirect: {
                permanent: false,
                destination: "/"
            }
        }
    }

    return {
        props: {}
    }
}