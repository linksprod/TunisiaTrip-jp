import { Helmet } from 'react-helmet-async';

interface PageSEOProps {
    title: string;
    description: string;
    canonicalPath: string;
    ogImage?: string;
    ogType?: 'website' | 'article';
    keywords?: string;
    noIndex?: boolean;
}

const DEFAULT_OG_IMAGE = 'https://tunisiatrip.jp/uploads/0c1b3cad-b8c4-4e02-a789-e700a147f440.png';
const BASE_URL = 'https://tunisiatrip.jp';

/**
 * PageSEO - A reusable, Japanese-first SEO component for every public page.
 * Provides per-page: title, description, canonical URL, OG tags, Twitter cards,
 * hreflang, and robots directives.
 */
export function PageSEO({
    title,
    description,
    canonicalPath,
    ogImage = DEFAULT_OG_IMAGE,
    ogType = 'website',
    keywords,
    noIndex = false,
}: PageSEOProps) {
    const canonicalUrl = `${BASE_URL}${canonicalPath}`;

    return (
        <Helmet>
            {/* Basic */}
            <html lang="ja" />
            <title>{title}</title>
            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords} />}
            <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow, max-snippet:-1, max-image-preview:large'} />
            <meta name="author" content="TunisiaTrip" />

            {/* Canonical */}
            <link rel="canonical" href={canonicalUrl} />

            {/* Hreflang — Japanese only site */}
            <link rel="alternate" hrefLang="ja" href={canonicalUrl} />
            <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />

            {/* Open Graph */}
            <meta property="og:type" content={ogType} />
            <meta property="og:site_name" content="TunisiaTrip" />
            <meta property="og:locale" content="ja_JP" />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:alt" content={title} />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={canonicalUrl} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />
            <meta name="twitter:image:alt" content={title} />
        </Helmet>
    );
}
