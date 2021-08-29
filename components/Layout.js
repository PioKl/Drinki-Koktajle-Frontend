import Head from 'next/head'
import Header from './Header';

export default function Layout({ title, keywords, description, children }) {
    return (
        <div>
            <Head>
                <title>{title}</title>
                <meta name='description' content={description} />
                <meta name='keywords' content={keywords} />
                
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;0,800;1,300;1,400;1,600;1,700;1,800&family=Rasa:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600;1,700&display=swap" rel="stylesheet" />
            </Head>

            {/* <Header /> */}
            <div className="page-content">
                {children}
            </div>

        </div>
    )
}

Layout.defaultProps = {
    title: 'Drinki i Koktajle',
    description: 'Wyszukaj różne drinki i koktajle',
    keywords: 'drink, koktajl'
}
