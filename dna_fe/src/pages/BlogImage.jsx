import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Đảm bảo bạn đã import axios

// Hàm proxy hình ảnh từ URL bên ngoài (do không có blogService)
const proxyBlogImage = async (imageUrl) => {
  try {
    // Xử lý Google URL redirect nếu có
    let processedUrl = imageUrl;
    if (imageUrl.includes('google.com/url') && imageUrl.includes('url=')) {
      try {
        const match = imageUrl.match(/url=([^&]+)/);
        if (match && match[1]) {
          processedUrl = decodeURIComponent(match[1]);
          console.log('Extracted URL from Google redirect:', processedUrl);
        }
      } catch (e) {
        console.error('Error extracting URL from Google redirect:', e);
      }
    }
    
    // Thử gọi API proxy của server nếu có
    try {
      const response = await axios.post('/api/blogs/proxy-image', { 
        url: processedUrl,
        timestamp: new Date().toISOString(),
        user: 'trihqse184859'  // Thêm thông tin user nếu cần
      });
      
      return response.data;
    } catch (error) {
      // Nếu server API không có, trả về URL gốc đã xử lý
      console.error('Server proxy not available, using direct URL:', error);
      return { fileUrl: processedUrl, error: true };
    }
  } catch (error) {
    console.error('Error proxying blog image:', error);
    return { fileUrl: imageUrl, error: true };
  }
};

const BlogImage = ({ 
  src, 
  alt, 
  currentUser, 
  currentTime,
  customStyle = {}, // Thêm prop để tùy chỉnh container style
  imageStyle = {}, // Thêm prop để tùy chỉnh image style
  hideDetails = false // Thêm prop để ẩn phần chi tiết URL
}) => {
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [attempts, setAttempts] = useState(0);
    const [imageUrl, setImageUrl] = useState(null);

    // Định nghĩa hình ảnh fallback dạng Base64
    const fallbackImageBase64 = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2VlZWVlZSIvPjxwYXRoIGQ9Ik0zMjUgMTc1TDQ3NSAxNzVMNDAwIDI3NVoiIGZpbGw9IiNhYWFhYWEiLz48Y2lyY2xlIGN4PSIzMjUiIGN5PSIxMjUiIHI9IjI1IiBmaWxsPSIjYWFhYWFhIi8+PHRleHQgeD0iNDAwIiB5PSIyMDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzMzMzMzMyI+SW1hZ2UgQ291bGQgTm90IEJlIExvYWRlZDwvdGV4dD48L3N2Zz4=';
    
    // Pinterest fallback image
    const pinterestFallbackBase64 = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2U2MDAyMyIvPjxjaXJjbGUgY3g9IjQwMCIgY3k9IjIwMCIgcj0iODAiIGZpbGw9IiNmZmZmZmYiLz48Y2lyY2xlIGN4PSI0MDAiIGN5PSIyMDAiIHI9IjYwIiBmaWxsPSIjZTYwMDIzIi8+PHRleHQgeD0iNDAwIiB5PSIzMjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2ZmZmZmZiI+UGludGVyZXN0IEltYWdlIChDT1JTIFByb3RlY3RlZCk8L3RleHQ+PC9zdmc+';
    
    // Sử dụng props nếu được cung cấp, hoặc giá trị mặc định
    const user = currentUser || 'trihqse184859';
    const time = currentTime || new Date().toISOString().replace('T', ' ').substring(0, 19);

    // Kiểm tra xem một URL có phải là URL hình ảnh hay không
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
            try {
                const urlObj = new URL(url);
                if (imageHostingDomains.some(domain => urlObj.hostname === domain)) {
                    return true;
                }
            } catch (e) {
                // URL parsing error, ignore
            }
            
            return false;
        } catch (e) {
            console.error('Error checking image URL:', e);
            return false;
        }
    };

    // Xử lý Pinterest URLs - sử dụng fallback ngay lập tức vì biết sẽ có vấn đề CORS
    const processPinterestUrl = (url) => {
        console.log('Using Pinterest fallback image due to CORS restrictions');
        return pinterestFallbackBase64;
    };
    
    // Hàm xử lý đặc biệt cho Kenh14 URLs
    const processKenh14Url = (url) => {
        console.log('Using fallback for Kenh14 image due to CORS restrictions');
        
        // Thử sử dụng CORS proxy công cộng thay vì fallback ngay
        try {
          return `https://corsproxy.io/?${encodeURIComponent(url)}`;
        } catch (e) {
          return fallbackImageBase64;
        }
    };
    
    // Tạo hình ảnh fallback với text tùy chỉnh
    const generateFallbackImage = (text) => {
        // Tạo SVG với text tùy chỉnh
        const svgText = `<svg width="800" height="400" xmlns="http://www.w3.org/2000/svg">
            <rect width="800" height="400" fill="#eeeeee"/>
            <path d="M325 175L475 175L400 275Z" fill="#aaaaaa"/>
            <circle cx="325" cy="125" r="25" fill="#aaaaaa"/>
            <text x="400" y="200" font-family="Arial" font-size="24" text-anchor="middle" fill="#333333">${text || 'Image Could Not Be Loaded'}</text>
        </svg>`;
        
        // Chuyển đổi sang base64
        return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgText)))}`;
    };
    
    // Hàm xử lý URL chuyển hướng của Google
    const extractGoogleRedirectUrl = (googleUrl) => {
        try {
            const match = googleUrl.match(/url=([^&]+)/);
            if (match && match[1]) {
                return decodeURIComponent(match[1]);
            }
        } catch (e) {
            console.error('Error extracting URL from Google redirect:', e);
        }
        return null;
    };
    
    // Hàm xử lý URL Google Image
    const extractGoogleImageUrl = (googleUrl) => {
        try {
            const match = googleUrl.match(/imgurl=([^&]+)/);
            if (match && match[1]) {
                return decodeURIComponent(match[1]);
            }
        } catch (e) {
            console.error('Error extracting URL from Google Image:', e);
        }
        return null;
    };

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

    // Combine default styles with custom styles
    const containerStyle = {
        marginBottom: '20px',
        textAlign: 'center',
        border: '1px solid #eee',
        borderRadius: '8px',
        padding: '10px',
        backgroundColor: '#fff',
        ...customStyle
    };
    
    // Default image styles
    const defaultImageStyle = {
        maxWidth: '100%',
        maxHeight: '500px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: loading ? 'none' : 'block'
    };
    
    // Combined image styles
    const combinedImageStyle = {
        ...defaultImageStyle,
        ...imageStyle
    };

    return (
        <div style={containerStyle}>
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
                            style={combinedImageStyle}
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
                            <li>Pinterest and some other sites restrict direct image access</li>
                        </ul>
                    </div>
                </div>
            )}

            {/* Hiển thị thông tin chi tiết nếu không bị ẩn */}
            {!hideDetails && src && (
                <div style={{ marginTop: '10px', fontSize: '0.8rem', color: '#666' }}>
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
                                {imageUrl === pinterestFallbackBase64 && ' (Pinterest Placeholder)'}
                            </div>
                        )}
                    </>
                </div>
            )}
            
            {/* Thông tin người dùng và thời gian - cũng bị ẩn nếu hideDetails=true */}
            {!hideDetails && (
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
            )}
        </div>
    );
};

export default BlogImage;