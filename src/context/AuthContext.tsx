/* ------| Servidor |------ */
import { createContext, ReactNode, useEffect, useState } from "react"
import { useRouter } from "next/router"
import jwt from 'jsonwebtoken'
import cookie from 'js-cookie'

/* ------| Interfaces |------ */
interface User {
    name: string;
    avatar: string;
    loggedAt: number;
}

interface AuthContextType {
    user: User | undefined;
    signIn: (name: string) => void;
    signUp: () => void;
}

interface AuthContextProviderProps {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextType)

export function AuthContextProvider({ children }: AuthContextProviderProps) {

    const [ user, setUser ] = useState<User>()
    const router = useRouter()

    useEffect(() => {
        const auth = cookie.get('access-token')
        if (auth) {
            const decode = jwt.decode(auth) as User
            setUser(decode)
        }
    }, [])

    const signIn = (name) => {
        const auth = {
            name,
            avatar: `https://cravatar.eu/helmavatar/${name}/24`,
            loggedAt: new Date().getTime()
        }


        const encode = jwt.sign(auth, '@auth')        
        cookie.set('access-token', encode)

        setUser({
            name,
            avatar: `https://cravatar.eu/helmavatar/${name}/24`,
            loggedAt: new Date().getTime()
        })

        const { redirect } = router.query

        if (redirect) {
            return router.push(redirect as string)
        }

        return router.push('/')


    }

    const signUp = () => {
        setUser(undefined)
        const auth = cookie.get('access-token')
        if (auth) cookie.remove('access-token')
    }

    return (
        <AuthContext.Provider value={{ user, signIn, signUp }}>
            { children }
        </AuthContext.Provider>
    )
}