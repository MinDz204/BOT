function extractId(tag) {
    const regex = /<@(\d+)>/; // Tạo một regular expression để tìm kiếm số ID
    const match = tag.match(regex); // Sử dụng match để tìm kiếm theo regex
  
    if (match) {
      return match[1]; // Trả về ID (phần trong dấu ngoặc)
    } else {
      return null; // Trả về null nếu không tìm thấy
    }
  }
  
  // Ví dụ sử dụng
  const tag = "<@1210193685501706260> safsa fasfsaf asfsaf";
  const id = extractId(tag);
  console.log(id); // Kết quả: 1210193685501706260
  