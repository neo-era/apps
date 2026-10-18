/* ============================================================
   DANH MỤC ỨNG DỤNG — chỉ cần sửa file này để thêm/bớt/sửa app
   Mỗi app: { name, desc, group, icon, url }
   - group: Tính toán | Khảo sát | Hồ sơ | Hiện trường | Sự cố | Văn phòng | Nhân sự ...
   - icon : một trong các khoá trong HUB_ICONS bên dưới (thêm icon mới nếu cần)
   ============================================================ */
window.HUB_APPS = [
  { name: "WebDialux-CS",          desc: "Mô phỏng chiếu sáng đường kiểu DIALux theo QCVN 07-7:2023", group: "Tính toán",   icon: "bulb",      url: "https://neo-era.github.io/webdialux-cs/" },
  { name: "Lighting System",       desc: "Khảo sát chiếu sáng trên bản đồ — ghi trụ/tủ theo tuyến",   group: "Khảo sát",    icon: "map",       url: "https://neo-era.github.io/lighting-survey/" },
  { name: "Khảo sát CS Trung Tâm", desc: "Khảo sát trụ đèn + trạm xe buýt khu trung tâm, xuất Excel/CSV", group: "Khảo sát", icon: "ruler",     url: "https://neo-era.github.io/tthtkt-khao-sat/index.html" },
  { name: "Khảo sát CS SAPULICO",  desc: "Quản lý khảo sát hiện trường, hồ sơ, biên bản (SAPULICO)",  group: "Khảo sát",    icon: "clip",      url: "https://neo-era.github.io/khaosat/index.html" },
  { name: "Đèn Tắt CSCC",          desc: "Quản lý & báo cáo đèn công cộng hỏng/tắt, xuất Excel/DXF",   group: "Sự cố",       icon: "alert",     url: "https://neo-era.github.io/dentat/dentat.html" },
  { name: "Hoàn công CSKVTT",      desc: "Lập hồ sơ hoàn công các gói duy tu chiếu sáng",              group: "Hồ sơ",       icon: "filecheck", url: "https://neo-era.github.io/cskvtt/hoancong/" },
  { name: "Nhật ký thi công",      desc: "Nhật ký thi công hàng ngày, xuất PDF/Word",                 group: "Hiện trường", icon: "book",      url: "https://neo-era.github.io/diary/" },
  { name: "Biên bản họp",          desc: "Ghi biên bản cuộc họp bằng giọng nói, xuất file Word",       group: "Văn phòng",   icon: "mic",       url: "https://neo-era.github.io/bien-ban-hop/" },
  { name: "Chấm công CSCC",        desc: "Hệ thống chấm công cho đơn vị chiếu sáng công cộng",         group: "Nhân sự",     icon: "clock",     url: "https://neo-era.github.io/chamcong/web/index.html" },
];

/* Icon dạng SVG path (stroke). Thêm icon mới: thêm 1 khoá ở đây rồi dùng trong HUB_APPS. */
window.HUB_ICONS = {
  bulb:      '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.6.6 1 1.4 1 2.5h6c0-1.1.4-1.9 1-2.5A6 6 0 0 0 12 3Z"/>',
  map:       '<path d="M12 21s-7-6.3-7-11a7 7 0 0 1 14 0c0 4.7-7 11-7 11Z"/><circle cx="12" cy="10" r="2.5"/>',
  mic:       '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
  filecheck: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z"/><path d="M14 3v5h5"/><path d="m9 15 2 2 4-4"/>',
  book:      '<path d="M5 4a2 2 0 0 1 2-2h11v18H7a2 2 0 0 0-2 2V4Z"/><path d="M9 7h6M9 11h6"/>',
  alert:     '<path d="M12 3 2 20h20L12 3Z"/><path d="M12 10v4M12 17h.01"/>',
  clip:      '<rect x="6" y="4" width="12" height="17" rx="2"/><path d="M9 4a3 3 0 0 1 6 0M9 11h6M9 15h4"/>',
  ruler:     '<path d="M3 15 15 3l6 6L9 21Z"/><path d="m7 11 2 2M11 7l2 2M15 11l2 2"/>',
  clock:     '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
};
