/* ------| Servidor |------ */
import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import Head from '../src/components/@next/head'
import { AuthContext } from '../src/context/AuthContext'
import { CartContext } from '../src/context/CartContext'


/* ------| Componentes |------ */
import { Grid, GridMain, GridSidebar } from '../src/components/@page/Grid'
import { Navbar, NavbarItemUser } from '../src/components/@page/Navbar'
import { Modal } from '../src/components/@global/modal'

/* ------| Estilos |------ */
import Styles from '../src/sass/checkout.module.scss'
import { X } from 'react-feather'

/* ------| Tipagem |------ */
import { GetServerSidePropsContext } from 'next'

interface CouponItem {
    ok: boolean;
    data: {
        coupon: string;
        message: string;
        discountPrice?: string;
        totalPrice?: string;
    }
}

export default function Checkout(props) {
    const { user, signUp } = useContext(AuthContext)
    const { cart, updateQuantityCart, removeToCart, checkCoupon } = useContext(CartContext)
    const router = useRouter()

    const [ cartCheckout, setCartCheckout ] = useState([])

    const [ termsCheckout, setTermsCheckout ] = useState(true)
    const [ couponInput, setCouponInput ] = useState('')
    const [ couponItem, setCouponItem ] = useState<CouponItem>()
    const [ total, setTotal ] = useState('0,00')
    const [ subtotal, setSubtotal ] = useState('0,00')
    const [ isToggled, setToggle ] = useState(false)
    
    useEffect(() => {
        if (!cart) return
        
        let total = 0
        const formatter = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })

        cart.forEach((item) => {
            total += item.price * item.quantity
        })

        let totalInString = formatter.format(total)
        setTotal(totalInString)
        setSubtotal(totalInString)

        const datas = []
        cart.forEach((item) => {
            const product = {
                id_produto: item.id,
                quantidade: item.quantity  
            }

            datas.push(product)
        })
        

        setCartCheckout(datas)

    }, [ cart ])

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
                                    <form className={Styles.Form} method="POST" action="https://www.lojasquare.com.br/gateways/checkout2.php">
                                        <div style={{
                                            width: '0',
                                            height: '0',
                                            opacity: '0'
                                        }}>
                                            {cart && (<input type="hidden" name="servidor" value={cart[0]?.server} readOnly />)}
                                            <input type="hidden" name="carrinho" value={JSON.stringify(Object.assign({}, cartCheckout))} readOnly />
                                            <input type="hidden" name="player" value={user?.name} readOnly />
                                            <input type="hidden" name="returnURL" value="http://loja.nationmc.com.br" />
                                            <input type="hidden" name="cancelURL" value="http://loja.nationmc.com.br" />
                                        </div>
                                        <header className={Styles.FormHeader}>
                                            <ul className={Styles.FormListGroup}>
                                                <li className={Styles.FormListGroupItem}>
                                                    <Link href="/">
                                                        <a>
                                                            Loja
                                                        </a>
                                                    </Link>
                                                </li>
                                                <li className={Styles.FormListGroupItem}>
                                                    Carrinho
                                                </li>
                                            </ul>
                                            <Link href="/">
                                                <a className={Styles.FormLinkButton}>
                                                    Voltar a loja
                                                </a>
                                            </Link>
                                        </header>
                                        <div className={Styles.FormSection}>
                                            <div className={Styles.FormSectionTitle}>
                                                Seu carrinho de compras
                                            </div>
                                            <div className={Styles.FormSectionCart}>
                                                {cart && cart.length >= 1 ? (
                                                    <>
                                                        { cart.map((item) => (
                                                            <div className={Styles.FormSectionCartGroup} key={ item.id }>
                                                                <div className={Styles.FormSectionCartGroupProduct}>
                                                                    <Image src={ item.image } alt={ item.name } width={64} height={64} />
                                                                    <div className={Styles.FormSectionCartGroupProductListGroup}>
                                                                        <h3>{ item.name }</h3>
                                                                        <h4>R$ { item.price.toFixed(2).replace(/\./g, ',') }</h4>
                                                                    </div>
                                                                </div>
                                                                <div className={Styles.FormSectionCartGroupUpdate}>
                                                                    <label className={Styles.FormSectionCartGroupUpdateLabel} htmlFor="">Quantidade</label>
                                                                    <input
                                                                        className={Styles.FormSectionCartGroupUpdateInput}
                                                                        type="number"
                                                                        defaultValue={ item.quantity }
                                                                        onChange={({ target }) => updateQuantityCart(target.value, item, cart)}
                                                                    />
                                                                </div>
                                                                <div className={Styles.FormSectionCartGroupRemove}>
                                                                    <button
                                                                        className={Styles.FormSectionCartGroupRemoveButton}
                                                                        type="button"
                                                                        onClick={() => removeToCart(item, cart)}
                                                                    >
                                                                        <X size={18} strokeWidth={3} />
                                                                    </button>
                                                                </div>
                                                            </div> 
                                                        ))}

                                                        <ul className={Styles.FormSectionCartListGroup}>
                                                            <li className={`${Styles.FormSectionCartListGroupItem} ${Styles.FormSectionCartListGroupPositivePrice}`}>
                                                                <h3>Subtotal</h3>
                                                                <span>{ subtotal }</span>
                                                            </li>
                                                            { couponItem?.ok === true && (
                                                                <li className={`${Styles.FormSectionCartListGroupItem} ${Styles.FormSectionCartListGroupNegativePrice}`}>
                                                                    <h3>Desconto</h3>
                                                                    <span>{ couponItem.data.discountPrice }</span>
                                                                </li>
                                                            )}

                                                            <li className={`${Styles.FormSectionCartListGroupItem} ${Styles.FormSectionCartListGroupPositivePrice}`}>
                                                                <h3>Total</h3>
                                                                <span>{ total }</span>
                                                            </li>
                                                        </ul>
                                                    </>
                                                ):(
                                                    <div className={Styles.FormSectionCartEmpty}>
                                                        Sem item no carrinho
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className={Styles.FormSection}>
                                            <div className={Styles.FormSectionTitle}>
                                                Quem receberá?
                                            </div>
                                            <div className={Styles.FormSectionUser}>
                                                <div className={Styles.FormSectionUserInfo}>
                                                    {user && (
                                                        <>
                                                            <Image src={ user.avatar } alt={ user.name } width={24} height={24} />
                                                            <p>{ user.name }</p>
                                                        </>
                                                    )}
                                                </div>
                                                <Link href="/signin?redirect=/checkout">
                                                    <a
                                                        className={Styles.FormSectionUserLink}
                                                        onClick={(event: React.MouseEvent<HTMLElement>) => {
                                                            const target = event.target as HTMLButtonElement
                                                            event.preventDefault()
                                                            signUp()
                                                            router.push(target?.getAttribute('href') as string)
                                                        }}
                                                    >Alterar conta</a>
                                                </Link>
                                            </div>
                                        </div>
                                        <div className={Styles.FormSection}>
                                            <div className={Styles.FormSectionTitle}>
                                                Código de cupom
                                            </div>
                                            <div className={Styles.FormSectionCoupon}>
                                                <div className={Styles.FormSectionCouponGroup}>
                                                    <input
                                                        className={Styles.FormSectionCouponInput}
                                                        type="text"
                                                        name="cupomON"
                                                        value={couponInput}
                                                        onChange={(event) => setCouponInput(event.target.value)}
                                                    />
                                                    <button
                                                        className={Styles.FormSectionCouponButton}
                                                        type="button"
                                                        onClick={async (event: React.MouseEvent<HTMLElement>) => {
                                                            const target = event.target as HTMLButtonElement
                                                            const { ok, data } = await checkCoupon(couponInput, cart)
                                                            if (ok === true) {
                                                                const input = document.querySelector(`.${Styles.FormSectionCouponInput}`)
                                                                input.setAttribute('readonly', 'true')
                                                                target.setAttribute('disabled', 'true')

                                                                setTotal(data.totalPrice)
                                                                setCouponItem({
                                                                    ok,
                                                                    data
                                                                })
                                                            } else {
                                                                setCouponItem({
                                                                    ok,
                                                                    data
                                                                })
                                                            }
                                                        }}
                                                    >
                                                        Aplicar código
                                                    </button>
                                                </div>
                                                { couponItem?.ok === false && (
                                                    <p className={Styles.FormSectionCouponError}>{ couponItem.data.message }</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className={Styles.FormSection}>
                                            <div className={Styles.FormSectionTitle}>
                                                Método de pagamento
                                            </div>
                                            <div className={Styles.FormSectionGateway}>
                                                <div className={Styles.FormSectionGatewayGroup}>
                                                    <input type="checkbox" id="terms" checked={termsCheckout}  onChange={(event) => setTermsCheckout(termsCheckout => !termsCheckout)} />
                                                    <label htmlFor="terms">Eu concordo com os <a onClick={() => setToggle(true)} target="_blank">termos & condições</a> desta compra</label>
                                                    <Modal title="Termos e condições" isToggled={isToggled} setToggle={setToggle}>
                                                        <div className={Styles.FormSectionGatewayGroupModal}>
                                                            <h1>Termos</h1>
                                                            <p>O termo a seguir, é aceito por sua parte iniciando assim que efetuado o pagamento. (Note que os items podem levar até o total de 48 horas para serem enviados. Por favor, seja paciente. Todos os pagamentos feitos são decisões FINAIS, como confirmados por esses termos de serviço.)
                                                            Devido à natureza de serviço Online, (especialmente baseado em Minecraft) nós não oferecemos nenhum estorno.</p>

                                                            <p>Ao doar para NONation, você está concordando que, se você é menor de 18 anos, você tem todo consentimento de seus pais/familiares para pagamento. e que nós não oferecemos nenhum tipo de estorno. Isto é uma doação. Todos os benefícios desta, são conhecidos por você, o doador, como bens virtuais.</p>
                                                        </div>
                                                    </Modal>
                                                </div>
                                                <div className={Styles.FormSectionGatewayGroup}>
                                                    <div className={Styles.FormSectionGatewayGroupRadio}>
                                                        <div className={Styles.FormSectionGatewayGroupRadioItem}>
                                                            <input type="radio" name="gateway" id="MercadoPago" value="MercadoPago" defaultChecked />
                                                            <label htmlFor="MercadoPago" onClick={(event: React.MouseEvent<HTMLElement>) => {
                                                                const target = event.target as HTMLInputElement
                                                                target.checked = true
                                                            }}>
                                                                <Image width={192} height={48} src="https://i.imgur.com/YvXg8et.png" alt="MercadoPago"  />
                                                            </label>
                                                        </div>
                                                        <div className={Styles.FormSectionGatewayGroupRadioItem}>
                                                            <input type="radio" name="gateway" id="PayPal" value="PayPal" />
                                                            <label htmlFor="PayPal" onClick={(event: React.MouseEvent<HTMLElement>) => {
                                                                const target = event.target as HTMLInputElement
                                                                target.checked = true
                                                            }}>
                                                                <Image width={192} height={48}  src="https://i.imgur.com/63EFChc.png" alt="PayPal" />
                                                            </label>
                                                        </div>
                                                        <div className={Styles.FormSectionGatewayGroupRadioItem}>
                                                            <input type="radio" name="gateway" id="PagSeguro" value="PagSeguro" />
                                                            <label htmlFor="PagSeguro" onClick={(event: React.MouseEvent<HTMLElement>) => {
                                                                const target = event.target as HTMLInputElement
                                                                target.checked = true
                                                            }}>
                                                                <Image width={192} height={48}  src="https://i.imgur.com/sPOxOJU.png" alt="PagSeguro" />
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={Styles.FormSection}>
                                            <div className={Styles.FormSectionGroup}>
                                                <button className={Styles.FormSectionGroupButton} type="submit" disabled={!termsCheckout ? true : false}>
                                                    Finalizar pedido
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </section>
                            </div>
                        </div>
                    </GridMain>
                </Grid>
            </div>
        </div>
    )
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    if (!context.req.cookies['access-token']) {
        return {
            redirect: {
                permanent: false,
                destination: `/signin?redirect=${context.resolvedUrl}`
            }
        }
    }

    return {
        props: {}
    }
}