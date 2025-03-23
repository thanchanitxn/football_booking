// ดึง URL ปัจจุบัน
const currentPage = window.location.pathname.split("/").pop();

// ค้นหาทุกลิงก์ในเมนู
const menuLinks = document.querySelectorAll(".menu a");

// เพิ่ม class="active" ให้เมนูที่ตรงกับหน้า
menuLinks.forEach(link => {
    if (link.getAttribute("href") === currentPage) {
        link.classList.add("active");
    }
});
