/* ------| Servidor |------ */
import { ReactNode, useContext } from 'react'
import { CartContext } from '../../../context/CartContext'
import { AuthContext } from '../../../context/AuthContext'
import Image from 'next/image'
import Link from 'next/link'

/* ------| Estilos |------ */
import { ShoppingBag } from 'react-feather'
import Styles from '../../../sass/home.module.scss'

/* ------| Interface |------ */
interface NavbarAllProps {
    children?: ReactNode;
}

export const Navbar = ({ children }: NavbarAllProps) => {
    return (
        <div className={Styles.Navbar}>
            <ul className={Styles.NavbarListGroup}>
                { children }
            </ul>
        </div>
    )
}

export const NavbarItemCart = () => {
    const { cart } = useContext(CartContext)

    return (
        <li className={Styles.NavbarListGroupItem}>
            <Link href="/checkout" >
                <a>
                    <ShoppingBag />
                    <span className={Styles.NavbarListGroupItemTextFloat}>
                        { cart?.length ?? ('0') }
                    </span>
                </a>
            </Link>
        </li>
    )
}

export const NavbarItemUser = () => {
    const { user } = useContext(AuthContext)
    return (
        <li className={Styles.NavbarListGroupItem}>
            {user ? (   
                <a>
                    <Image className={Styles.NavbarListGroupItemAvatar} width={24} height={24} src={ user.avatar } alt={user.name} />
                    <span className={Styles.NavbarListGroupItemText}>
                        {user.name}
                    </span>
                </a> 
            ):(
                
                <Link href="/signin">
                    <a>
                        <Image className={Styles.NavbarListGroupItemAvatar} width={24} height={24} src="https://cravatar.eu/helmavatar/Notch/24" alt="Convidado" />
                        <span className={Styles.NavbarListGroupItemText}>
                            Convidado
                        </span>
                    </a> 
                </Link>
            )}
        </li>
    )
}