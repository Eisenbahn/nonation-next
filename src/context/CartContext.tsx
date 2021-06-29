/* ------| Servidor |------ */
import { createContext, ReactNode, useEffect, useState } from "react";
import cookie from 'js-cookie'
import axios from "axios";


/* ------| Interface |------ */
export interface Cart {
    id: number;
    name: string;
    category: string;
    image: string;
    price: number;
    days: string;
    quantity: number;
    server: string;
}

interface ProductType {
    categoria: string;
    descricao: string;
    dias: string;
    grupo: string;
    idproduto: number;
    imagem: string;
    outros: {
        imagem: string;
        descricao:  string;
    }
    posicao: number;
    produto: string;
    servidor: string;
    subServidor: string;
    userid: number;
    valor: number;
}

interface CartContextType {
    cart: Cart[] | undefined;
    addToCart: (product: ProductType, cart: Cart[]) => void;
    updateQuantityCart: (quantity: string | number, product: Cart, cart: Cart[]) => void 
    removeToCart: (product: Cart, cart: Cart[]) => void
    checkCoupon: (coupon: string, cart: Cart[]) => Promise<{ 
        ok: boolean;
        data: {
            coupon: string;
            message: string;
            discountPrice?: string;
            totalPrice?: string;
        }
    }>
}

interface CartContextProviderType {
    children: ReactNode
}

export const CartContext = createContext({} as CartContextType)

export const CartContextProvider = ({ children }: CartContextProviderType) => { 
    const [ cart, setCart ]= useState<Cart[]>()

    useEffect(() => {
        const cartCookie = cookie.get('cart')
        if (!cartCookie) return

        setCart(JSON.parse(cartCookie))
    }, [])

    const addToCart = async (data: ProductType, cart) => {
        const datas = []
        if (cart) datas.push(...cart)

        const productIndex = datas.findIndex(item => item.id === data.idproduto)

        console.log(cart)

        if (productIndex === -1) {
            const product = {
                id: data.idproduto,
                name: data.produto,
                category: data.categoria,
                image: data.imagem,
                price: data.valor,
                days: data.dias,
                quantity: 1,
                server: data.servidor
            }

            datas.push(product)
            setCart(datas)

            console.log(typeof datas)

            return cookie.set('cart', JSON.stringify(datas))
        }

        datas[productIndex].quantity = datas[productIndex].quantity + 1
        setCart(datas)

        return cookie.set('cart', JSON.stringify(datas))

    }

    const updateQuantityCart = (quantity, data, cart) => {
        const cartCookie = cookie.get('cart')
        if (!cartCookie) return
        if (quantity <= 0) quantity = 1

        const datas = []
        datas.push(...cart)

        const productIndex = datas.findIndex((item: Cart) => item.id === data.id)
        datas[productIndex].quantity = parseInt(quantity)

        setCart(datas)
        return cookie.set('cart', JSON.stringify(datas))
        
    }

    const removeToCart = async (data, cart) => {
        const cartCookie = cookie.get('cart')
        if (!cartCookie) return

        const datas = []
        datas.push(...cart)

        const productIndex = datas.findIndex(item => item.id === data.id)
        datas.splice(productIndex, 1)

        setCart(datas)

        if (datas.length === 0) return cookie.remove('cart')

        return cookie.set('cart', JSON.stringify(datas))
    }

    const checkCoupon = async (coupon, data) => {
        const connect = axios.create({
            baseURL: 'https://api.lojasquare.com.br//v1/',
            headers: {
                'AUTHORIZATION': '30MqqJU1etyERb6sHqhFwQFPF7vPeM'
            }
        })

        const datas = []
        cart.forEach((item) => {
            const product = {
                id_produto: item.id,
                quantidade: item.quantity  
            }

            datas.push(product)
        })

        try {
            const response = await connect.put(`/cupom/${coupon}`, datas)

            const formatter = new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })
    
            return {
                ok: true,
                data: {
                    coupon: response.data.cupom,
                    message: response.data.msg,
                    discountPrice: formatter.format(response.data.valorDesconto),
                    totalPrice: formatter.format(response.data.valorTotal)
                }
            }
        } catch (error) {
            return {
                ok: false,
                data: {
                    coupon,
                    message: 'Cupom inválido',
                }
            }
        }
    }

    return (
        <CartContext.Provider value={{ cart, addToCart, updateQuantityCart, removeToCart, checkCoupon }}>
            { children }
        </CartContext.Provider>
    )
}