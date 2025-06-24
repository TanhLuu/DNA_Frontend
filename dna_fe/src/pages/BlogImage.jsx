import React, { useState, useEffect } from 'react';
import '../styles/blogimage.css';

function BlogImage({ 
  src, 
  alt = 'Blog image',
  currentTime,
  customStyle = {}, 
  imageStyle = {}, 
  hideDetails = false,
  isDetailView = false
}) {
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [attempts, setAttempts] = useState(0);
    const [imageUrl, setImageUrl] = useState(null);

    // Fallback images as Base64
    const fallbackImageBase64 = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2VlZWVlZSIvPjxwYXRoIGQ9Ik0zMjUgMTc1TDQ3NSAxNzVMNDAwIDI3NVoiIGZpbGw9IiNhYWFhYWEiLz48Y2lyY2xlIGN4PSIzMjUiIGN5PSIxMjUiIHI9IjI1IiBmaWxsPSIjYWFhYWFhIi8+PHRleHQgeD0iNDAwIiB5PSIyMDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzMzMzMzMyI+SW1hZ2UgQ291bGQgTm90IEJlIExvYWRlZDwvdGV4dD48L3N2Zz4=';
    const pinterestFallbackBase64 = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2U2MDAyMyIvPjxjaXJjbGUgY3g9IjQwMCIgY3k9IjIwMCIgcj0iODAiIGZpbGw9IiNmZmZmZmYiLz48Y2lyY2xlIGN4PSI0MDAiIGN5PSIyMDAiIHI9IjYwIiBmaWxsPSIjZTYwMDIzIi8+PHRleHQgeD0iNDAwIiB5PSIzMjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2ZmZmZmZiI+UGludGVyZXN0IEltYWdlIChDT1JTIFByb3RlY3RlZCk8L3RleHQ+PC9zdmc+';
    
    // Use provided time or current time
    const time = currentTime || new Date().toISOString().replace('T', ' ').substring(0, 19);

    // URL processing helpers
    function extractUrlFromRedirect(url, pattern) {
        try {
            const match = url.match(pattern);
            if (match && match[1]) {
                return decodeURIComponent(match[1]);
            }
        } catch (e) {
            console.error('Error extracting URL:', e);
        }
        return null;
    }
    
    // Process image URL on mount or when source/attempts change
    useEffect(() => {
        const processImageUrl = async () => {
            if (!src) {
                setImageUrl(fallbackImageBase64);
                setLoading(false);
                return;
            }

            let processedUrl = src;
            const problematicDomains = ['pinterest.com', 'kenh14.vn', 'facebook.com', 'instagram.com'];
            const useCorsProxy = problematicDomains.some(domain => src.includes(domain));
            
            // Process Google redirects
            if (src.includes('google.com/url') && src.includes('url=')) {
                const extractedUrl = extractUrlFromRedirect(src, /url=([^&]+)/);
                if (extractedUrl) {
                    // Use Pinterest fallback if it's a Pinterest URL
                    if (extractedUrl.includes('pinterest.com')) {
                        setImageUrl(pinterestFallbackBase64);
                        setLoading(false);
                        return;
                    } else {
                        processedUrl = extractedUrl;
                    }
                }
            }
            // Process Google Image URLs
            else if (src.includes('google.com/imgres') && src.includes('imgurl=')) {
                const extractedUrl = extractUrlFromRedirect(src, /imgurl=([^&]+)/);
                if (extractedUrl) {
                    processedUrl = extractedUrl;
                }
            }
            // Handle problematic domains directly
            else if (useCorsProxy && !src.startsWith('data:')) {
                if (src.includes('pinterest.com')) {
                    setImageUrl(pinterestFallbackBase64);
                    setLoading(false);
                    return;
                } else {
                    processedUrl = `https://corsproxy.io/?${encodeURIComponent(src)}`;
                }
            }
            
            setImageUrl(processedUrl);
        };

        processImageUrl();
    }, [src, attempts]);

    // Handle retry
    function handleRetry() {
        setError(false);
        setLoading(true);
        setAttempts(prev => prev + 1);
    }

    // Use fallback image
    function tryPlaceholder() {
        setImageUrl(fallbackImageBase64);
        setError(false);
        setLoading(false);
    }

    // Set container style for detail view
    const containerStyle = isDetailView ? {
        margin: '30px auto',
        position: 'relative',
        maxWidth: '100%',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 5px 20px rgba(0,0,0,0.15)',
        background: '#ffffff',
        padding: '10px',
        ...customStyle
    } : customStyle;

    // Set image style for detail view
    const finalImageStyle = isDetailView ? {
        width: '100%',
        height: 'auto',
        maxHeight: '800px',
        objectFit: 'contain',
        display: 'block',
        margin: '0 auto',
        borderRadius: '8px',
        ...imageStyle
    } : imageStyle;

    const containerClassName = `blog-image-container ${isDetailView ? 'blog-detail-image-container' : ''}`;

    return (
        <div className={containerClassName} style={containerStyle}>
            {!error ? (
                <>
                    {loading && (
                        <div className="blog-image-loading">
                            <div className="blog-image-spinner"></div>
                            <p className="blog-image-loading-text">Loading image...</p>
                        </div>
                    )}
                    {imageUrl && (
                        <img
                            src={imageUrl}
                            alt={alt}
                            key={`img-${attempts}`}
                            onLoad={() => setLoading(false)}
                            onError={() => {
                                // If not using a proxy or fallback yet, try with CORS proxy
                                if (!imageUrl.startsWith('data:') && 
                                    !imageUrl.includes('corsproxy.io')) {
                                    
                                    const corsProxyUrl = `https://corsproxy.io/?${encodeURIComponent(imageUrl)}`;
                                    setImageUrl(corsProxyUrl);
                                } else {
                                    // If proxy fails, use fallback
                                    setError(true);
                                    setImageUrl(fallbackImageBase64);
                                }
                            }}
                            className="blog-image"
                            style={finalImageStyle}
                            crossOrigin="anonymous"
                            referrerPolicy="no-referrer"
                        />
                    )}

                    {/* Caption for detail view */}
                    {isDetailView && !loading && !error && alt && (
                        <div className="blog-detail-image-caption-static">
                            <span>{alt}</span>
                        </div>
                    )}
                </>
            ) : (
                <div className="blog-image-error">
                    <svg
                        width="50"
                        height="50"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="blog-image-error-icon"
                    >
                        <path
                            d="M18 3H6C4.34 3 3 4.34 3 6V18C3 19.66 4.34 21 6 21H18C19.66 21 21 19.66 21 18V6C21 4.34 19.66 3 18 3Z"
                            stroke="#999"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M9 10C10.1 10 11 9.1 11 8C11 6.9 10.1 6 9 6C7.9 6 7 6.9 7 8C7 9.1 7.9 10 9 10Z"
                            stroke="#999"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M21 15L18 12L6 18"
                            stroke="#999"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <p className="blog-image-error-text">
                        The original image could not be loaded
                    </p>
                    <div className="blog-image-buttons">
                        <button onClick={handleRetry} className="blog-image-retry">
                            Try Again
                        </button>
                        <button onClick={tryPlaceholder} className="blog-image-fallback">
                            Use Placeholder
                        </button>
                    </div>
                    
                    <div className="blog-image-info">
                        <p>Common issues:</p>
                        <ul>
                            <li>Google redirect URLs often don't work directly</li>
                            <li>The image might not allow access from other websites (CORS)</li>
                            <li>The image URL might be invalid or the file deleted</li>
                            <li>Pinterest and some other sites restrict direct image access</li>
                        </ul>
                    </div>
                </div>
            )}

            {/* Image details section */}
            {!hideDetails && src && (
                <div className="blog-image-details">
                    <div>
                        <strong>Original URL:</strong> {src.substring(0, 50)}{src.length > 50 ? '...' : ''}
                    </div>
                    
                    {imageUrl !== src && imageUrl && !imageUrl.startsWith('data:') && (
                        <div className="blog-image-details-processed">
                            <strong>Processed URL:</strong> {imageUrl.substring(0, 50)}{imageUrl.length > 50 ? '...' : ''}
                        </div>
                    )}
                    
                    {imageUrl && imageUrl.startsWith('data:') && (
                        <div className="blog-image-details-processed">
                            <strong>Processed URL:</strong> [Base64 Image]
                            {imageUrl === pinterestFallbackBase64 && ' (Pinterest Placeholder)'}
                        </div>
                    )}
                </div>
            )}
            
            {/* Time info */}
            {!hideDetails && (
                <div className="blog-image-time-info">
                    <span>Time: {time}</span>
                </div>
            )}
        </div>
    );
}

export default BlogImage;