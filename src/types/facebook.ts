export interface FacebookAuthResponse {
  /** 🔥 Token bạn sẽ dùng để gọi Facebook Graph API (quan trọng nhất) */
  accessToken: string;
  /** Thời gian sống (giây) của token này (ví dụ: 5087 = ~1.4 giờ) */
  expiresIn: number;
  /** ID Facebook của user đang đăng nhập */
  userID: string;
  /**
   * JWT-like string Facebook tạo để chứng minh token hợp lệ
   * (chủ yếu dùng nội bộ, ít dùng ở frontend)
   */
  signedRequest: string;
  /**
   * Cho biết đây là login từ Facebook
   * (có thể là "facebook", "instagram", "messenger" tùy trường hợp)
   */
  graphDomain: "facebook" | "instagram" | "messenger";
  /**
   * Unix timestamp khi quyền hết hạn
   * (user phải re-login nếu app không được dùng lâu)
   */
  data_access_expiration_time: number;
}

/**
 * Response từ window.FB.login() callback
 */
export interface FacebookLoginResponse {
  /**
   * Response chứa thông tin authentication khi user đăng nhập thành công
   * undefined nếu user hủy hoặc không authorize
   */
  authResponse?: FacebookAuthResponse;
  /**
   * Trạng thái đăng nhập:
   * - "connected" → user đã đăng nhập và cho phép app
   * - "not_authorized" → user đã đăng nhập nhưng không cho phép app
   * - "unknown" → user chưa đăng nhập Facebook hoặc đã logout
   */
  status?: "connected" | "not_authorized" | "unknown";
}
