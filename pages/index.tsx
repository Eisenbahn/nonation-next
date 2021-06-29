/* ------| Servidor |------ */
import { useContext, useState } from 'react'
import { CartContext } from '../src/context/CartContext'
import Image from 'next/image'
import Head from '../src/components/@next/head'
import axios from 'axios'

/* ------| Componentes |------ */
import { Modal } from '../src/components/@global/modal'
import { Grid, GridMain, GridSidebar } from '../src/components/@page/Grid'
import { Navbar, NavbarItemCart, NavbarItemUser } from '../src/components/@page/Navbar'

/* ------| Estilos |------ */
import { X } from 'react-feather'
import Styles from '../src/sass/home.module.scss'

/* ------| Interface |------ */
interface ModalProps {
    title?: string;
    content?: string;
}

export default function Home({ dataCategory, dataProducts }) {

    const { cart, addToCart, removeToCart } = useContext(CartContext)

    const [ categories, setCategories ] = useState([ ...dataCategory ])
    const [ products, setProducts ] = useState([ ...dataProducts ])

    const [ isToggled, setToggle ] = useState(false)

    const [ modalContent, setModalContent ] = useState<ModalProps>({})

    
    const handleActiveSideList = (event) => {
        event.preventDefault()

        const globalClass = document.querySelectorAll(`.${Styles.SidebarListGroupItem}`)
        globalClass.forEach((item) => item.classList.remove(`${Styles.Active}`))
        
        event.target.parentElement.classList.add(`${Styles.Active}`)
    }

    const handleFilterProduct = (category) => {

        if (category === 'none') return setProducts([...dataProducts])

        const filterProducts = dataProducts.filter((item) => {
            return item.categoria.toLowerCase() === category.toLowerCase()
        })
        
        setProducts([ ...filterProducts ])
    }

    return (
        <div className={Styles.Wrapper}>
            <Head title="Nonation - Bem vindo à loja" />
            <div className={`${Styles.Container} ${Styles.ContainerFluid}`}>
                <Grid>
                    <GridSidebar>
                        <div className={Styles.Sidebar}>
                            <div className={Styles.SidebarMenu}>
                                <ul className={Styles.SidebarListGroup}>
                                    <li className={`${Styles.SidebarListGroupItem} ${Styles.Active}`} onClick={(event) => handleActiveSideList(event)}>
                                        <a href="" onClick={() => handleFilterProduct('none')}>
                                            Geral
                                        </a>
                                    </li>
                                    {categories && categories.map((item) => (
                                        <li className={Styles.SidebarListGroupItem} key={item.categoriaID} onClick={(event) => handleActiveSideList(event) }>
                                            <a href="" onClick={() => handleFilterProduct(item.categoria.toLowerCase())}>
                                                {item.categoria}
                                            </a>
                                        </li>
                                    ))}
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
                                <header className={Styles.MainHeader}>
                                    <h1 className={Styles.MainHeaderTitle}>Loja VIP</h1>
                                    <p className={Styles.MainHeaderText}>Atingindo R$ 20,00 em Doações, você ganhará o rank de Vip. Vip's recebem kit semanal, comando exclusivos, tag, extra /sethome e vaga garantida caso o server esteja lotado!</p>
                                    <p className={Styles.MainHeaderText}>
                                        <strong>Todos os Ranks são Vitalícios! Não expiram!</strong>
                                    </p>
                                </header>
                                <section className={Styles.MainItems}>
                                    <Modal title={modalContent.title} isToggled={isToggled} setToggle={setToggle}>
                                        <div dangerouslySetInnerHTML={{ __html: modalContent.content}} />
                                    </Modal>
                                    { products && products.length >= 1 ? products.map((item) => {
                                        const isOnTheCart = cart?.some((cart) => cart.id === item.idproduto)
                                        return (
                                            <div
                                                key={item.idproduto}
                                                className={`${Styles.MainItem}`}
                                            >
                                                <div
                                                    className={Styles.MainItemHeader}
                                                    onClick={() => {
                                                        setModalContent({
                                                            title: item.produto,
                                                            content: item.descricao
                                                        })
                                                        setToggle(true)
                                                    }}
                                                >
                                                    <figure className={Styles.MainItemHeaderImage}>
                                                        <Image src={item.imagem} alt={item.produto} width={205} height={205} />
                                                    </figure>
                                                    <p className={Styles.MainItemHeaderProduct}>{item.produto}</p>
                                                </div>
                                                <div className={Styles.MainItemActions}>
                                                    {isOnTheCart ? (
                                                        <button
                                                            className={`${Styles.MainItemButton} ${Styles.MainItemButtonAdded}`}
                                                            onClick={() => removeToCart(item, cart)}
                                                        >
                                                            <X strokeWidth={3} />
                                                        </button>
                                                    ) : (
                                                        <button
                                                                className={Styles.MainItemButton}
                                                                onClick={() => addToCart(item, cart)}
                                                        >
                                                            Adicionar
                                                        </button>
                                                    )}
                                                    <p className={Styles.MainItemPrice}>R$ {item.valor.toFixed(2).replace('.', ',')}</p>
                                                </div>
                                            </div>
                                        )
                                    }) :
                                        <div className={Styles.MainItemsEmpty}>
                                            Nenhum produto encontrado
                                        </div> 
                                    }
                                </section>
                            </div>
                        </div>
                    </GridMain>
                </Grid>
            </div>
        </div>
    )
}

export const getStaticProps = async () => {
    const connect = axios.create({
        baseURL: 'https://api.lojasquare.com.br//v1/',
        headers: {
            'AUTHORIZATION': '30MqqJU1etyERb6sHqhFwQFPF7vPeM'
        }
    })

    const products = []
    
    const categoryResponse = await connect.get('categorias')
    const productResponse = await connect.get('produtos')

    Object.entries(productResponse.data).forEach((item) => products.push(item[1]))

    return {
        props: {
            dataCategory: categoryResponse.data,
            dataProducts: products
        }
    }
}
