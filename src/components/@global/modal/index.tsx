/* ------| Servidor |------ */
import React from 'react'

/* ------| Estilo |------ */
import Styles from '../../../sass/modal.module.scss'
import { AnimatePresence, motion } from 'framer-motion'

import { X } from 'react-feather'

/* ------| Interface |------ */
interface  ModalProps {
    children: React.ReactNode;
    title: string;
    isToggled: boolean;
    setToggle: React.SetStateAction<boolean>;
    buttonClose?: boolean;
}

export const Modal = ({ children, title, isToggled, setToggle, buttonClose = true }) => {
    return (
        <AnimatePresence>
            { isToggled &&
                <div className={Styles.Modal}>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={Styles.ModalOverlay}
                        >
                        <motion.div
                            initial={{
                                opacity: 0,
                                top: 256
                            }}
                            animate={{
                                opacity: 1,
                                top: 0
                            }}
                            exit={{
                                opacity: 0,
                                top: -256
                            }}
                            className={Styles.ModalContainer}
                            >
                            <header className={`${Styles.ModalHeader}${!buttonClose ? ` ${Styles.ModalHeaderCenter}`: ''}`}>
                                <h3 className={Styles.ModalHeaderTitle}>{ title }</h3>
                                { buttonClose && (
                                    <button
                                        type="button"
                                        className={`${Styles.ModalButton} ${Styles.ModalHeaderButton}`}
                                        onClick={() => setToggle(false)}
                                    >
                                        <X size={14} strokeWidth={4} />
                                    </button>
                                )}
                            </header>
                            <main className={Styles.ModalContent}>
                                { children }
                            </main>
                            <footer className={Styles.ModalFooter}>
                                { buttonClose && (
                                    <button
                                        type="button"
                                        className={`${Styles.ModalButton} ${Styles.ModalFooterButton}`}
                                        onClick={() => setToggle(false)}
                                    >
                                        Fechar
                                    </button>
                                )}
                            </footer>
                        </motion.div>
                    </motion.div>
                </div>
            }
        </AnimatePresence>
    )
} 