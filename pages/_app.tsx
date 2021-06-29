import { CartContextProvider } from '../src/context/CartContext'
import { AuthContextProvider } from '../src/context/AuthContext'

import '../src/css/globals.css'

function MyApp({ Component, pageProps }) {
    return (
        <AuthContextProvider>
            <CartContextProvider>
                <Component {...pageProps} />
            </CartContextProvider>
        </AuthContextProvider>
    )
}

export default MyApp
