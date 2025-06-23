import React, { useState, useEffect } from 'react';
import '../styles/blogimage.css';

function BlogImage({ 
  src, 
  alt = 'Blog image',
  currentTime,
  customStyle = {}, 
  imageStyle = {}, 
  hideDetails = false 
}) {
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [attempts, setAttempts] = useState(0);
    const [imageUrl, setImageUrl] = useState(null);

    // Định nghĩa hình ảnh fallback dạng Base64
    const fallbackImageBase64 = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2VlZWVlZSIvPjxwYXRoIGQ9Ik0zMjUgMTc1TDQ3NSAxNzVMNDAwIDI3NVoiIGZpbGw9IiNhYWFhYWEiLz48Y2lyY2xlIGN4PSIzMjUiIGN5PSIxMjUiIHI9IjI1IiBmaWxsPSIjYWFhYWFhIi8+PHRleHQgeD0iNDAwIiB5PSIyMDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzMzMzMzMyI+SW1hZ2UgQ291bGQgTm90IEJlIExvYWRlZDwvdGV4dD48L3N2Zz4=';
    
    // Pinterest fallback image
    const pinterestFallbackBase64 = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2U2MDAyMyIvPjxjaXJjbGUgY3g9IjQwMCIgY3k9IjIwMCIgcj0iODAiIGZpbGw9IiNmZmZmZmYiLz48Y2lyY2xlIGN4PSI0MDAiIGN5PSIyMDAiIHI9IjYwIiBmaWxsPSIjZTYwMDIzIi8+PHRleHQgeD0iNDAwIiB5PSIzMjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2ZmZmZmZiI+UGludGVyZXN0IEltYWdlIChDT1JTIFByb3RlY3RlZCk8L3RleHQ+PC9zdmc+';
    
    // Sử dụng props thời gian nếu được cung cấp, hoặc thời gian hiện tại
    const time = currentTime || new Date().toISOString().replace('T', ' ').substring(0, 19);

    // Xử lý Pinterest URLs - sử dụng fallback ngay lập tức vì biết sẽ có vấn đề CORS
    function processPinterestUrl(url) {
        console.log('Using Pinterest fallback image due to CORS restrictions');
        return pinterestFallbackBase64;
    }
    
    // Hàm xử lý đặc biệt cho Kenh14 URLs
    function processKenh14Url(url) {
        console.log('Using fallback for Kenh14 image due to CORS restrictions');
        
        // Thử sử dụng CORS proxy công cộng thay vì fallback ngay
        try {
          return `https://corsproxy.io/?${encodeURIComponent(url)}`;
        } catch (e) {
          return fallbackImageBase64;
        }
    }
    
    // Hàm xử lý URL chuyển hướng của Google
    function extractGoogleRedirectUrl(googleUrl) {
        try {
            const match = googleUrl.match(/url=([^&]+)/);
            if (match && match[1]) {
                return decodeURIComponent(match[1]);
            }
        } catch (e) {
            console.error('Error extracting URL from Google redirect:', e);
        }
        return null;
    }
    
    // Hàm xử lý URL Google Image
    function extractGoogleImageUrl(googleUrl) {
        try {
            const match = googleUrl.match(/imgurl=([^&]+)/);
            if (match && match[1]) {
                return decodeURIComponent(match[1]);
            }
        } catch (e) {
            console.error('Error extracting URL from Google Image:', e);
        }
        return null;
    }

    // Hàm xử lý URL hình ảnh nâng cao
    useEffect(() => {
        const processImageUrl = async () => {
            if (!src) {
                console.log('No source URL provided');
                setImageUrl(fallbackImageBase64);
                setLoading(false);
                return;
            }

            let processedUrl = src;
            let directlyUseFallback = false;

            // Kiểm tra xem URL có phải là URL chuyển hướng Google không
            if (src.includes('google.com/url') && src.includes('url=')) {
                const extractedUrl = extractGoogleRedirectUrl(src);
                if (extractedUrl) {
                    console.log('Extracted direct URL from Google redirect:', extractedUrl);
                    
                    // Xử lý đặc biệt cho các domain đã biết có vấn đề CORS
                    if (extractedUrl.includes('pinterest.com')) {
                        processedUrl = processPinterestUrl(extractedUrl);
                        directlyUseFallback = true;
                    }
                    else if (extractedUrl.includes('kenh14.vn')) {
                        processedUrl = processKenh14Url(extractedUrl);
                    }
                    else {
                        processedUrl = extractedUrl;
                    }
                }
            }
            
            // Xử lý URL Google Image
            else if (src.includes('google.com/imgres') && src.includes('imgurl=')) {
                const extractedUrl = extractGoogleImageUrl(src);
                if (extractedUrl) {
                    console.log('Extracted direct URL from Google Image:', extractedUrl);
                    processedUrl = extractedUrl;
                }
            }
            
            // Xử lý URL trực tiếp
            else {
                // Xử lý đặc biệt cho các domain có vấn đề CORS
                if (src.includes('pinterest.com')) {
                    processedUrl = processPinterestUrl(src);
                    directlyUseFallback = true;
                }
                else if (src.includes('kenh14.vn')) {
                    processedUrl = processKenh14Url(src);
                }
            }
            
            // Nếu đã xác định sử dụng fallback, không cần thử tải ảnh
            if (directlyUseFallback) {
                setImageUrl(processedUrl);
                setLoading(false);
                return;
            }
            
            // Thử sử dụng proxy từ server nếu không phải base64
            if (!processedUrl.startsWith('data:')) {
                try {
                    // Kiểm tra nếu URL là từ domain đã biết có vấn đề CORS
                    const problematicDomains = ['kenh14.vn', 'pinterest.com', 'facebook.com', 'instagram.com'];
                    const isProblematicDomain = problematicDomains.some(domain => processedUrl.includes(domain));
                    
                    // Sử dụng CORS proxy công cộng cho các domain có vấn đề
                    if (isProblematicDomain) {
                        processedUrl = `https://corsproxy.io/?${encodeURIComponent(processedUrl)}`;
                    }
                } catch (e) {
                    console.error('Error processing URL:', e);
                }
            }
            
            setImageUrl(processedUrl);
        };

        processImageUrl();
    }, [src, attempts]);

    function handleRetry() {
        setError(false);
        setLoading(true);
        setAttempts(prev => prev + 1);
        console.log(`Retrying image load, attempt: ${attempts + 1}`);
    }

    function tryPlaceholder() {
        setImageUrl(fallbackImageBase64);
        setError(false);
        setLoading(false);
        console.log('Using base64 placeholder image');
    }

    // Xử lý trường hợp khi không có URL nguồn
    useEffect(() => {
        if (!src) {
            tryPlaceholder();
        }
    }, [src]);

    return (
        <div className="blog-image-container" style={customStyle}>
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
                            onLoad={() => {
                                setLoading(false);
                                console.log('Image loaded successfully!');
                            }}
                            onError={(e) => {
                                console.error("Failed to load image:", imageUrl);
                                setLoading(false);
                                
                                // Nếu đây là URL bình thường (không phải base64 và chưa dùng proxy)
                                if (!imageUrl.startsWith('data:') && 
                                    !imageUrl.includes('cors-anywhere') && 
                                    !imageUrl.includes('images.weserv.nl') &&
                                    !imageUrl.includes('corsproxy.io')) {
                                    
                                    // Thử sử dụng proxy thay thế
                                    const corsProxyUrl = `https://corsproxy.io/?${encodeURIComponent(imageUrl)}`;
                                    console.log('Trying with alternative CORS proxy:', corsProxyUrl);
                                    setImageUrl(corsProxyUrl);
                                } else {
                                    // Nếu đã thử tất cả các cách mà vẫn thất bại, hiển thị lỗi
                                    setError(true);
                                    // Sử dụng fallback
                                    setImageUrl(fallbackImageBase64);
                                }
                            }}
                            className="blog-image"
                            style={imageStyle}
                            crossOrigin="anonymous"
                            referrerPolicy="no-referrer"
                        />
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
                        <button
                            onClick={handleRetry}
                            className="blog-image-retry"
                        >
                            Try Again
                        </button>
                        
                        <button
                            onClick={tryPlaceholder}
                            className="blog-image-fallback"
                        >
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

            {/* Hiển thị thông tin chi tiết nếu không bị ẩn */}
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
            
            {/* Chỉ hiển thị thời gian - không hiển thị người dùng */}
            {!hideDetails && (
                <div className="blog-image-time-info">
                    <span>Time: {time}</span>
                </div>
            )}
        </div>
    );
}

export default BlogImage;