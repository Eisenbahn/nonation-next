/* ------| Estilos |------ */
import Styles from '../../../sass/home.module.scss'

export const Grid = ({ children }) => {
    return (
        <div className={Styles.Grid}>
            { children }
        </div>
    )
}

export const GridSidebar = ({ children }) => {
    return (
        <aside className={Styles.GridSide}>
            { children }
        </aside>
    )
}

export const GridMain = ({ children }) => {
    return (
        <main className={Styles.GridMain}>
            { children }
        </main>
    )
}