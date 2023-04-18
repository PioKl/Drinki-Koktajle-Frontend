import React from 'react'
import styles from '../styles/Footer.module.scss';
import GithubIcon from '../icons/github.svg';

export default function Footer() {
  return (
    <footer className={styles.footer}>
        <div className={styles.footer__socialIconsContainer}>
            <a href="https://github.com/PioKl" target='_blank' rel="noopener noreferrer">
                <GithubIcon className={styles.footer__icon} />
            </a>
        </div>
    </footer>
  )
}
