import React, { useState, useEffect } from 'react';

const BlogImage = ({ src, alt, currentUser, currentTime }) => {
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [attempts, setAttempts] = useState(0);
    const [imageUrl, setImageUrl] = useState(null);
    
    // Định nghĩa hình ảnh fallback dạng Base64 để tránh phụ thuộc vào external services
    const fallbackImageBase64 = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2VlZWVlZSIvPjxwYXRoIGQ9Ik0zMjUgMTc1TDQ3NSAxNzVMNDAwIDI3NVoiIGZpbGw9IiNhYWFhYWEiLz48Y2lyY2xlIGN4PSIzMjUiIGN5PSIxMjUiIHI9IjI1IiBmaWxsPSIjYWFhYWFhIi8+PHRleHQgeD0iNDAwIiB5PSIyMDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzMzMzMzMyI+SW1hZ2UgQ291bGQgTm90IEJlIExvYWRlZDwvdGV4dD48L3N2Zz4=';
    
    // Sử dụng props nếu được cung cấp, hoặc giá trị mặc định
    const user = currentUser || 'trihqse184859';
    const time = currentTime || new Date().toISOString().replace('T', ' ').substring(0, 19);

    // Cải thiện hàm kiểm tra URL hình ảnh
    const isImageUrl = (url) => {
        if (!url) return false;
        
        try {
            // Kiểm tra các extension hình ảnh phổ biến
            const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg', '.ico', '.tiff'];
            const lowercaseUrl = url.toLowerCase();
            
            // Nếu URL chứa extension hình ảnh
            if (imageExtensions.some(ext => lowercaseUrl.endsWith(ext) || lowercaseUrl.includes(`${ext}?`))) {
                return true;
            }
            
            // Kiểm tra URL có chứa từ khóa liên quan đến hình ảnh
            const imageKeywords = ['image', 'img', 'photo', 'pic', 'picture', 'avatar'];
            if (imageKeywords.some(keyword => lowercaseUrl.includes(`/${keyword}/`) || 
                                            lowercaseUrl.includes(`=${keyword}`) || 
                                            lowercaseUrl.includes(`_${keyword}`))) {
                return true;
            }
            
            // Kiểm tra các domain image hosting phổ biến
            const imageHostingDomains = ['i.imgur.com', 'i.pinimg.com', 'images.unsplash.com', 'img.youtube.com'];
            const urlObj = new URL(url);
            if (imageHostingDomains.some(domain => urlObj.hostname === domain)) {
                return true;
            }
            
            return false;
        } catch (e) {
            console.error('Error checking image URL:', e);
            return false;
        }
    };

    // Cải thiện xử lý Pinterest và sử dụng proxy CORS
    const processPinterestUrl = (url) => {
        try {
            // Cố gắng trích xuất ID của pin từ URL Pinterest
            const pinMatch = url.match(/\/pin\/(\d+)/);
            if (pinMatch && pinMatch[1]) {
                const pinId = pinMatch[1];
                // Thử tạo URL trực tiếp đến ảnh Pinterest dựa trên ID
                // Lưu ý: Pinterest có thể thay đổi cấu trúc URL, vì vậy đây chỉ là nỗ lực tốt nhất
                return `https://i.pinimg.com/originals/pin/${pinId}.jpg`;
            }
            
            // Thử sử dụng CORS proxy (ví dụ với proxy giả định)
            // Lưu ý: Đây là ví dụ, bạn cần thay thế bằng proxy CORS thực tế
            const corsProxyUrl = `https://images.weserv.nl/?url=${encodeURIComponent(url)}`;
            console.log('Using CORS proxy for Pinterest URL:', corsProxyUrl);
            return corsProxyUrl;
        } catch (e) {
            console.error('Error processing Pinterest URL:', e);
            return generateFallbackImage('Pinterest Image (CORS Blocked)');
        }
    };
    
    // Cải thiện xử lý URL từ Kenh14
    const processKenh14Url = (url) => {
        try {
            // Thử sử dụng CORS proxy
            const corsProxyUrl = `https://images.weserv.nl/?url=${encodeURIComponent(url)}`;
            console.log('Using CORS proxy for Kenh14 URL:', corsProxyUrl);
            return corsProxyUrl;
        } catch (e) {
            console.error('Error processing Kenh14 URL:', e);
            return generateFallbackImage('Kenh14 Image (CORS Blocked)');
        }
    };
    
    // Cải thiện hàm tạo hình ảnh fallback với text tùy chỉnh
    const generateFallbackImage = (text) => {
        // Tạo SVG với text tùy chỉnh
        const svgText = `<svg width="800" height="400" xmlns="http://www.w3.org/2000/svg">
            <rect width="800" height="400" fill="#eeeeee"/>
            <path d="M325 175L475 175L400 275Z" fill="#aaaaaa"/>
            <circle cx="325" cy="125" r="25" fill="#aaaaaa"/>
            <text x="400" y="200" font-family="Arial" font-size="24" text-anchor="middle" fill="#333333">${text || 'Image Could Not Be Loaded'}</text>
        </svg>`;
        
        // Chuyển đổi sang base64
        const encodedSvg = btoa(svgText);
        return `data:image/svg+xml;base64,${encodedSvg}`;
    };

    // Cải thiện hàm xử lý URL hình ảnh
    useEffect(() => {
        const processImageUrl = async () => {
            if (!src) {
                console.log('No source URL provided');
                setImageUrl(fallbackImageBase64);
                setLoading(false);
                return;
            }

            try {
                let processedUrl = src;

                // Xử lý URL redirect từ Google
                if (src.includes('google.com/url') && src.includes('url=')) {
                    try {
                        const match = src.match(/url=([^&]+)/);
                        if (match && match[1]) {
                            const decodedUrl = decodeURIComponent(match[1]);
                            console.log('Extracted direct URL from Google redirect:', decodedUrl);
                            
                            // Xử lý đặc biệt cho Pinterest
                            if (decodedUrl.includes('pinterest.com')) {
                                processedUrl = processPinterestUrl(decodedUrl);
                                console.log('Processed Pinterest URL to:', processedUrl);
                            }
                            // Xử lý đặc biệt cho Kenh14
                            else if (decodedUrl.includes('kenh14.vn')) {
                                processedUrl = processKenh14Url(decodedUrl);
                                console.log('Processed Kenh14 URL to:', processedUrl);
                            }
                            // Kiểm tra nếu URL trích xuất là URL bài viết, không phải hình ảnh
                            else if (!isImageUrl(decodedUrl)) {
                                console.warn('Extracted URL is not an image URL:', decodedUrl);
                                // Thử sử dụng CORS proxy
                                processedUrl = `https://images.weserv.nl/?url=${encodeURIComponent(decodedUrl)}`;
                            } else {
                                processedUrl = decodedUrl;
                            }
                        }
                    } catch (e) {
                        console.error('Error extracting URL from Google redirect:', e);
                        processedUrl = fallbackImageBase64;
                    }
                }
                
                // Xử lý Google Image URL
                else if (src.includes('google.com/imgres') && src.includes('imgurl=')) {
                    try {
                        const match = src.match(/imgurl=([^&]+)/);
                        if (match && match[1]) {
                            processedUrl = decodeURIComponent(match[1]);
                            console.log('Extracted direct URL from Google Image:', processedUrl);
                        }
                    } catch (e) {
                        console.error('Error extracting URL from Google Image:', e);
                        processedUrl = fallbackImageBase64;
                    }
                }
                
                // Xử lý direct URLs
                else {
                    // Xử lý đặc biệt cho các domain có vấn đề CORS
                    if (src.includes('pinterest.com')) {
                        processedUrl = processPinterestUrl(src);
                    }
                    else if (src.includes('kenh14.vn')) {
                        processedUrl = processKenh14Url(src);
                    }
                    // Kiểm tra xem URL có hợp lệ không
                    else if (!isImageUrl(src)) {
                        console.warn('Source URL does not appear to be an image URL:', src);
                        // Thử sử dụng CORS proxy
                        processedUrl = `https://images.weserv.nl/?url=${encodeURIComponent(src)}`;
                    }
                }
                
                // Kiểm tra trạng thái của ảnh trước khi hiển thị (pre-flight check)
                if (!processedUrl.startsWith('data:')) {
                    try {
                        // Thêm timestamp để tránh cache
                        const timestamp = new Date().getTime();
                        const urlWithTimestamp = processedUrl.includes('?') 
                            ? `${processedUrl}&_t=${timestamp}` 
                            : `${processedUrl}?_t=${timestamp}`;
                        
                        setImageUrl(urlWithTimestamp);
                    } catch (e) {
                        console.error('Error during pre-flight check:', e);
                        setImageUrl(fallbackImageBase64);
                    }
                } else {
                    setImageUrl(processedUrl);
                }
            } catch (error) {
                console.error('Error processing image URL:', error);
                setImageUrl(fallbackImageBase64);
                setLoading(false);
            }
        };

        processImageUrl();
    }, [src, alt, attempts]);

    const handleRetry = () => {
        setError(false);
        setLoading(true);
        setAttempts(prev => prev + 1);
        console.log(`Retrying image load, attempt: ${attempts + 1}`);
    };

    const tryPlaceholder = () => {
        setImageUrl(fallbackImageBase64);
        setError(false);
        setLoading(false);
        console.log('Using base64 placeholder image');
    };

    // Xử lý trường hợp khi không có URL nguồn
    useEffect(() => {
        if (!src) {
            tryPlaceholder();
        }
    }, [src]);

    return (
        <div style={{
            marginBottom: '20px',
            textAlign: 'center',
            border: '1px solid #eee',
            borderRadius: '8px',
            padding: '10px',
            backgroundColor: '#fff'
        }}>
            {!error ? (
                <>
                    {loading && (
                        <div style={{
                            padding: '40px',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '8px',
                            marginBottom: '10px'
                        }}>
                            <div style={{
                                border: '3px solid #f3f3f3',
                                borderTop: '3px solid #3498db',
                                borderRadius: '50%',
                                width: '30px',
                                height: '30px',
                                animation: 'spin 1s linear infinite',
                                margin: '0 auto'
                            }}></div>
                            <style>{`
                                @keyframes spin {
                                    0% { transform: rotate(0deg); }
                                    100% { transform: rotate(360deg); }
                                }
                            `}</style>
                            <p style={{ marginTop: '10px', color: '#666' }}>Loading image...</p>
                        </div>
                    )}
                    {imageUrl && (
                        <img
                            src={imageUrl}
                            alt={alt || 'Blog image'}
                            key={`img-${attempts}`}
                            onLoad={() => {
                                setLoading(false);
                                console.log('Image loaded successfully!');
                            }}
                            onError={(e) => {
                                console.error("Failed to load image:", imageUrl);
                                setLoading(false);
                                
                                // Thử với CORS proxy nếu chưa phải là ảnh Base64
                                if (!imageUrl.startsWith('data:') && !imageUrl.includes('images.weserv.nl')) {
                                    console.log('Trying with CORS proxy...');
                                    setImageUrl(`https://images.weserv.nl/?url=${encodeURIComponent(imageUrl)}`);
                                } else {
                                    setError(true);
                                    // Tự động sử dụng fallback nếu lỗi
                                    setImageUrl(fallbackImageBase64);
                                }
                            }}
                            style={{
                                maxWidth: '100%',
                                maxHeight: '500px',
                                borderRadius: '8px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                display: loading ? 'none' : 'block'
                            }}
                            crossOrigin="anonymous"
                            referrerPolicy="no-referrer"
                        />
                    )}
                </>
            ) : (
                <div style={{
                    padding: '30px',
                    backgroundColor: '#f8f9fa',
                    border: '1px dashed #ccc',
                    borderRadius: '8px',
                    marginBottom: '10px'
                }}>
                    <svg
                        width="50"
                        height="50"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ margin: '0 auto', display: 'block' }}
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
                    <p style={{ textAlign: 'center', color: '#dc3545', marginTop: '10px' }}>
                        The original image could not be loaded
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '15px', flexWrap: 'wrap' }}>
                        <button
                            onClick={handleRetry}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#17a2b8',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Try Again
                        </button>
                        
                        <button
                            onClick={tryPlaceholder}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#6c757d',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Use Placeholder
                        </button>
                    </div>
                    
                    <div style={{ marginTop: '15px', fontSize: '0.9rem', color: '#666' }}>
                        <p>Common issues:</p>
                        <ul style={{ textAlign: 'left', paddingLeft: '20px' }}>
                            <li>Google redirect URLs often don't work directly</li>
                            <li>The image might not allow access from other websites (CORS)</li>
                            <li>The image URL might be invalid or the file deleted</li>
                        </ul>
                    </div>
                </div>
            )}

            <div style={{ marginTop: '10px', fontSize: '0.8rem', color: '#666' }}>
                {src && (
                    <>
                        <div>
                            <strong>Original URL:</strong> {src.substring(0, 50)}{src.length > 50 ? '...' : ''}
                        </div>
                        
                        {imageUrl !== src && imageUrl && !imageUrl.startsWith('data:') && (
                            <div style={{ marginTop: '5px' }}>
                                <strong>Processed URL:</strong> {imageUrl.substring(0, 50)}{imageUrl.length > 50 ? '...' : ''}
                            </div>
                        )}
                        {imageUrl && imageUrl.startsWith('data:') && (
                            <div style={{ marginTop: '5px' }}>
                                <strong>Processed URL:</strong> [Base64 Image]
                            </div>
                        )}
                    </>
                )}
            </div>
            
            <div style={{ 
                marginTop: '15px', 
                fontSize: '0.75rem', 
                color: '#999', 
                textAlign: 'right',
                borderTop: '1px solid #eee',
                paddingTop: '5px' 
            }}>
                <span>User: {user}</span>
                <span style={{ marginLeft: '15px' }}>Time: {time}</span>
            </div>
        </div>
    );
};

export default BlogImage;