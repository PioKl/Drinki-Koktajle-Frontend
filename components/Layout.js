import Head from 'next/head'

export default function Layout({title, keywords, description, children}) {
    return (
        <div>
            <Head>
                <title>{title}</title>
                <meta name='description' content={description}/>
                <meta name='keywords' content={keywords}/>
            </Head>

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
